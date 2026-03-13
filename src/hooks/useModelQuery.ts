import { useRef, useCallback } from 'react'
import { useModelStore } from '@/store/modelStore'
import { useSettingsStore } from '@/store/settingsStore'
import { createAdapter, isProviderSupported } from '@/services/adapters/index'
import {
  PROVIDERS,
  getDefaultModelId,
  getModelVariant,
} from '@/constants/models'
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
      const { getApiKey, getSelectedModel } = useSettingsStore.getState()

      // Abort any in-flight requests
      for (const [, controller] of abortControllers.current) {
        controller.abort()
      }
      abortControllers.current.clear()
      clearAll()

      // Only query providers that have an API key set AND a supported adapter
      const activeProviders = PROVIDERS.filter(
        (p) => isProviderSupported(p.providerId) && getApiKey(p.providerId),
      )

      if (activeProviders.length === 0) {
        return
      }

      for (const provider of activeProviders) {
        const apiKey = getApiKey(provider.providerId)
        if (!apiKey) continue

        // Resolve which model variant to use
        const selectedModelId =
          getSelectedModel(provider.providerId) ||
          getDefaultModelId(provider)
        const variant = getModelVariant(provider, selectedModelId)
        const modelId = variant?.modelId || getDefaultModelId(provider)

        const adapter = createAdapter(provider.providerId as ProviderId, {
          apiKey,
          systemPrompt: SCOUT_SYSTEM_PROMPT,
          modelId,
          extraBody: variant?.extraBody,
        })
        if (!adapter) continue

        const controller = new AbortController()
        abortControllers.current.set(provider.providerId, controller)
        const startTime = performance.now()

        startStreaming(provider.providerId)

        adapter
          .sendMessage(
            prompt,
            {
              onToken: (token) => {
                useModelStore
                  .getState()
                  .appendToken(provider.providerId, token)
              },
              onComplete: (_fullText) => {
                const elapsed = Math.round(performance.now() - startTime)
                useModelStore
                  .getState()
                  .completeStreaming(provider.providerId, elapsed)
                abortControllers.current.delete(provider.providerId)
              },
              onError: (err) => {
                useModelStore
                  .getState()
                  .setError(provider.providerId, err.message)
                abortControllers.current.delete(provider.providerId)
              },
            },
            controller.signal,
          )
          .catch((err: unknown) => {
            if (controller.signal.aborted) return
            const message =
              err instanceof Error ? err.message : 'Unknown error'
            useModelStore
              .getState()
              .setError(provider.providerId, message)
            abortControllers.current.delete(provider.providerId)
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
