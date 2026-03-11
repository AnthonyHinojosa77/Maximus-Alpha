import { create } from 'zustand'
import type { ModelResponseState } from '@/types/models'

interface ModelStoreState {
  /** Per-model response state */
  responses: Record<string, ModelResponseState>

  /** Whether any model is currently streaming */
  anyStreaming: boolean

  /** Initialize a model slot to loading state */
  startStreaming: (providerId: string) => void

  /** Append a token to a model's response */
  appendToken: (providerId: string, token: string) => void

  /** Mark a model as done streaming */
  completeStreaming: (providerId: string, latencyMs: number) => void

  /** Set error for a model */
  setError: (providerId: string, error: string) => void

  /** Clear all responses (new query) */
  clearAll: () => void
}

function getDefault(): ModelResponseState {
  return { text: '', streaming: false, error: null, latencyMs: null }
}

export const useModelStore = create<ModelStoreState>((set) => ({
  responses: {},
  anyStreaming: false,

  startStreaming: (providerId) => {
    set((state) => ({
      responses: {
        ...state.responses,
        [providerId]: { text: '', streaming: true, error: null, latencyMs: null },
      },
      anyStreaming: true,
    }))
  },

  appendToken: (providerId, token) => {
    set((state) => {
      const prev = state.responses[providerId] || getDefault()
      return {
        responses: {
          ...state.responses,
          [providerId]: { ...prev, text: prev.text + token },
        },
      }
    })
  },

  completeStreaming: (providerId, latencyMs) => {
    set((state) => {
      const prev = state.responses[providerId] || getDefault()
      const next = {
        ...state.responses,
        [providerId]: { ...prev, streaming: false, latencyMs },
      }
      const stillStreaming = Object.values(next).some((r) => r.streaming)
      return { responses: next, anyStreaming: stillStreaming }
    })
  },

  setError: (providerId, error) => {
    set((state) => {
      const next = {
        ...state.responses,
        [providerId]: { text: '', streaming: false, error, latencyMs: null },
      }
      const stillStreaming = Object.values(next).some((r) => r.streaming)
      return { responses: next, anyStreaming: stillStreaming }
    })
  },

  clearAll: () => {
    set({ responses: {}, anyStreaming: false })
  },
}))
