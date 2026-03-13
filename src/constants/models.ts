/**
 * Central model registry.
 *
 * Every provider exposes one or more ModelVariants.
 * Adapters receive the selected modelId + extraBody at call time —
 * no model ID is hardcoded inside any adapter file.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ModelVariant {
  modelId: string // Exact API model ID, e.g. "claude-opus-4-6"
  label: string // UI label, e.g. "Opus 4.6"
  isDefault: boolean
  status: 'current' | 'deprecated' | 'preview'
  /** Extra params merged into the adapter's request body (thinking, reasoning, etc.) */
  extraBody?: Record<string, unknown>
}

export interface ProviderConfig {
  id: string
  providerId: string
  displayName: string
  apiEndpoint: string
  proxyPath: string | null // null = direct CORS call (Anthropic)
  color: string
  models: ModelVariant[]
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const PROVIDERS: ProviderConfig[] = [
  {
    id: 'openai',
    providerId: 'openai',
    displayName: 'ChatGPT',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    proxyPath: '/_px/a/v1/chat/completions',
    color: '#10a37f',
    models: [
      {
        modelId: 'gpt-5.4',
        label: 'GPT-5.4 Thinking',
        isDefault: true,
        status: 'current',
        extraBody: { reasoning_effort: 'high' },
      },
      {
        modelId: 'gpt-5-mini',
        label: 'GPT-5 Mini',
        isDefault: false,
        status: 'current',
      },
    ],
  },
  {
    id: 'anthropic',
    providerId: 'anthropic',
    displayName: 'Claude',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    proxyPath: null, // Direct CORS supported
    color: '#d97706',
    models: [
      {
        modelId: 'claude-opus-4-6',
        label: 'Opus 4.6',
        isDefault: true,
        status: 'current',
        extraBody: { thinking: { type: 'adaptive' }, max_tokens: 16000 },
      },
      {
        modelId: 'claude-sonnet-4-6',
        label: 'Sonnet 4.6',
        isDefault: false,
        status: 'current',
        extraBody: { thinking: { type: 'adaptive' } },
      },
    ],
  },
  {
    id: 'gemini',
    providerId: 'gemini',
    displayName: 'Gemini',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    proxyPath: '/_px/b/v1beta/models',
    color: '#4285f4',
    models: [
      {
        modelId: 'gemini-3.1-pro-preview',
        label: '3.1 Pro',
        isDefault: true,
        status: 'preview',
      },
      {
        modelId: 'gemini-3-flash-preview',
        label: '3 Flash',
        isDefault: false,
        status: 'preview',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return the default model ID for a provider (first isDefault, else first). */
export function getDefaultModelId(provider: ProviderConfig): string {
  const def = provider.models.find((m) => m.isDefault)
  return def ? def.modelId : provider.models[0].modelId
}

/** Look up a specific variant by modelId. */
export function getModelVariant(
  provider: ProviderConfig,
  modelId: string,
): ModelVariant | undefined {
  return provider.models.find((m) => m.modelId === modelId)
}

export type ProviderId = (typeof PROVIDERS)[number]['providerId']
