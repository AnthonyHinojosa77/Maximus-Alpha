import { create } from 'zustand'

/**
 * Minimal in-memory API key store.
 * Keys live only in JavaScript memory — lost on tab close.
 * No localStorage, no encryption. Phase 5 replaces this.
 */

interface SettingsState {
  apiKeys: Record<string, string> // providerId -> key
  setApiKey: (providerId: string, key: string) => void
  getApiKey: (providerId: string) => string | null
  clearApiKey: (providerId: string) => void
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  apiKeys: {},

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
}))
