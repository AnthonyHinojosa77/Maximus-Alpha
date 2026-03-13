import { create } from 'zustand'

/**
 * Minimal in-memory settings store.
 * Keys + model selections live only in JavaScript memory — lost on tab close.
 * No localStorage, no encryption. Phase 5 replaces this.
 */

interface SettingsState {
  apiKeys: Record<string, string> // providerId -> key
  selectedModels: Record<string, string> // providerId -> modelId

  setApiKey: (providerId: string, key: string) => void
  getApiKey: (providerId: string) => string | null
  clearApiKey: (providerId: string) => void

  setSelectedModel: (providerId: string, modelId: string) => void
  getSelectedModel: (providerId: string) => string | null
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  apiKeys: {},
  selectedModels: {},

  setApiKey: (providerId, key) => {
    set((state) => ({
      apiKeys: { ...state.apiKeys, [providerId]: key },
    }))
  },

  getApiKey: (providerId) => {
    return get().apiKeys[providerId] || null
  },

  clearApiKey: (providerId) => {
    set((state) => {
      const next = { ...state.apiKeys }
      delete next[providerId]
      return { apiKeys: next }
    })
  },

  setSelectedModel: (providerId, modelId) => {
    set((state) => ({
      selectedModels: { ...state.selectedModels, [providerId]: modelId },
    }))
  },

  getSelectedModel: (providerId) => {
    return get().selectedModels[providerId] || null
  },
}))
