import { useRef, useCallback } from 'react'
import { useModelStore } from '@/store/modelStore'
import { useSettingsStore } from '@/store/settingsStore'
import { createAdapter, isProviderSupported } from '@/services/adapters/index'
import { MODELS } from '@/constants/models'
import { SCOUT_SYSTEM_PROMPT } from '@/constants/prompts'
import type { ProviderId } from '@/types/models'

export function useModelQuery() {
  const abortControllers = useRef<Map<string, AbortController>>(new Map())

  // Subscribe to reactive state via selectors
  const anyStreaming = useModelStore((s) => s.anyStreaming)

  const sendQuery = useCallback(
    (prompt: string) => {
      // Read store actions via getState() — stable, non-reactive
      const { startStreaming, clearAll } = useModelStore.getState()
      const { getApiKey } = useSettingsStore.getState()

      // Abort any in-flight requests
      for (const [, controller] of abortControllers.current) {
        controller.abort()
      }
      abortControllers.current.clear()
      clearAll()

      // Only query models that have an API key set AND a supported adapter
      const activeModels = MODELS.filter(
        (m) => isProviderSupported(m.providerId) && getApiKey(m.providerId),
      )

      if (activeModels.length === 0) {
        return
      }

      for (const model of activeModels) {
        const apiKey = getApiKey(model.providerId)
        if (!apiKey) continue

        const adapter = createAdapter(model.providerId as ProviderId, {
          apiKey,
          systemPrompt: SCOUT_SYSTEM_PROMPT,
          modelId: model.modelId,
        })
        if (!adapter) continue

        const controller = new AbortController()
        abortControllers.current.set(model.providerId, controller)
        const startTime = performance.now()

        startStreaming(model.providerId)

        adapter
          .sendMessage(
            prompt,
            {
              onToken: (token) => {
                useModelStore.getState().appendToken(model.providerId, token)
              },
              onComplete: (_fullText) => {
                const elapsed = Math.round(performance.now() - startTime)
                useModelStore.getState().completeStreaming(model.providerId, elapsed)
                abortControllers.current.delete(model.providerId)
              },
              onError: (err) => {
                useModelStore.getState().setError(model.providerId, err.message)
                abortControllers.current.delete(model.providerId)
              },
            },
            controller.signal,
          )
          .catch((err: unknown) => {
            if (controller.signal.aborted) return
            const message = err instanceof Error ? err.message : 'Unknown error'
            useModelStore.getState().setError(model.providerId, message)
            abortControllers.current.delete(model.providerId)
          })
      }
    },
    [], // No deps — all store access via getState()
  )

  const abortAll = useCallback(() => {
    const { completeStreaming, responses } = useModelStore.getState()
    for (const [providerId, controller] of abortControllers.current) {
      controller.abort()
      if (responses[providerId]?.streaming) {
        completeStreaming(providerId, 0)
      }
    }
    abortControllers.current.clear()
  }, [])

  const abortOne = useCallback((providerId: string) => {
    const controller = abortControllers.current.get(providerId)
    if (controller) {
      controller.abort()
      useModelStore.getState().completeStreaming(providerId, 0)
      abortControllers.current.delete(providerId)
    }
  }, [])

  return { sendQuery, abortAll, abortOne, anyStreaming }
}
