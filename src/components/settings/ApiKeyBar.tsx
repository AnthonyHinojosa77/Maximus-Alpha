import { useState } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { MODELS } from '@/constants/models'
import { isProviderSupported } from '@/services/adapters/index'

/**
 * Minimal inline API key entry.
 * Shows a row per supported provider with a password input.
 * Keys stored in memory only — lost on tab close.
 * This is a temporary UI until Phase 5 (PIN + encryption).
 */
export function ApiKeyBar() {
  const apiKeys = useSettingsStore((s) => s.apiKeys)
  const setApiKey = useSettingsStore((s) => s.setApiKey)
  const [expanded, setExpanded] = useState(false)

  const supportedModels = MODELS.filter((m) => isProviderSupported(m.providerId))
  const configuredCount = supportedModels.filter(
    (m) => apiKeys[m.providerId],
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
            API KEYS ({configuredCount}/{supportedModels.length} configured)
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
            {supportedModels.map((model) => (
              <KeyInput
                key={model.providerId}
                providerId={model.providerId}
                label={model.displayName}
                color={model.color}
                value={apiKeys[model.providerId] || ''}
                onChange={(val) => setApiKey(model.providerId, val)}
              />
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
