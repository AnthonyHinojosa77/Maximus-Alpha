import { useState } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import {
  PROVIDERS,
  getDefaultModelId,
  type ModelVariant,
} from '@/constants/models'
import { isProviderSupported } from '@/services/adapters/index'

/**
 * Minimal inline API key entry + per-provider model selector.
 * Keys and selections stored in memory only — lost on tab close.
 * This is a temporary UI until Phase 5 (PIN + encryption).
 */
export function ApiKeyBar() {
  const apiKeys = useSettingsStore((s) => s.apiKeys)
  const selectedModels = useSettingsStore((s) => s.selectedModels)
  const setApiKey = useSettingsStore((s) => s.setApiKey)
  const setSelectedModel = useSettingsStore((s) => s.setSelectedModel)
  const [expanded, setExpanded] = useState(false)

  const supportedProviders = PROVIDERS.filter((p) =>
    isProviderSupported(p.providerId),
  )
  const configuredCount = supportedProviders.filter(
    (p) => apiKeys[p.providerId],
  ).length

  // Auto-expand if no keys are configured
  const shouldShow = expanded || configuredCount === 0

  return (
    <div className="border-b border-terminal-gray bg-terminal-dark">
      <div className="mx-auto max-w-5xl px-4 py-2 md:px-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between text-[10px] tracking-widest"
        >
          <span className="text-terminal-muted">
            API KEYS ({configuredCount}/{supportedProviders.length} configured)
            {configuredCount === 0 && (
              <span className="ml-2 text-terminal-amber">
                — enter at least one key to begin
              </span>
            )}
          </span>
          <span className="text-terminal-muted">
            {shouldShow ? '▲ HIDE' : '▼ SHOW'}
          </span>
        </button>

        {shouldShow && (
          <div className="mt-2 space-y-2 pb-1">
            {supportedProviders.map((provider) => (
              <div key={provider.providerId} className="space-y-1">
                <KeyInput
                  providerId={provider.providerId}
                  label={provider.displayName}
                  color={provider.color}
                  value={apiKeys[provider.providerId] || ''}
                  onChange={(val) => setApiKey(provider.providerId, val)}
                />
                {provider.models.length > 1 && (
                  <ModelSelect
                    models={provider.models}
                    selectedModelId={
                      selectedModels[provider.providerId] ||
                      getDefaultModelId(provider)
                    }
                    onChange={(modelId) =>
                      setSelectedModel(provider.providerId, modelId)
                    }
                  />
                )}
              </div>
            ))}
            <p className="text-[10px] text-terminal-muted">
              Keys are held in memory only. They are gone when you close this
              tab.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function KeyInput({
  label,
  color,
  value,
  onChange,
}: {
  providerId: string
  label: string
  color: string
  value: string
  onChange: (val: string) => void
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex items-center gap-3">
      <div className="flex w-20 items-center gap-1.5 shrink-0">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-[10px] text-terminal-light">{label}</span>
      </div>
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${label} API key...`}
        className="flex-1 rounded border border-terminal-gray bg-terminal-black px-2 py-1 text-xs text-terminal-light placeholder-terminal-muted outline-none focus:border-terminal-green"
      />
      <button
        onClick={() => setVisible(!visible)}
        className="text-[10px] text-terminal-muted hover:text-terminal-light"
      >
        {visible ? 'HIDE' : 'SHOW'}
      </button>
      {value && (
        <span className="text-[10px] text-terminal-green">✓</span>
      )}
    </div>
  )
}

function ModelSelect({
  models,
  selectedModelId,
  onChange,
}: {
  models: ModelVariant[]
  selectedModelId: string
  onChange: (modelId: string) => void
}) {
  return (
    <div className="flex items-center gap-3 pl-[86px]">
      <span className="text-[10px] text-terminal-muted shrink-0">MODEL</span>
      <select
        value={selectedModelId}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded border border-terminal-gray bg-terminal-black px-2 py-1 text-xs text-terminal-light outline-none focus:border-terminal-green appearance-none cursor-pointer"
      >
        {models.map((m) => (
          <option key={m.modelId} value={m.modelId}>
            {m.label}
            {m.status === 'deprecated' ? ' (deprecated)' : ''}
            {m.status === 'preview' ? ' (preview)' : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
