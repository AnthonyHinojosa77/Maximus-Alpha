export interface ModelConfig {
  id: string
  providerId: string
  displayName: string
  modelId: string
  apiEndpoint: string
  proxyPath: string | null // null = direct CORS call
  color: string
}

export const MODELS: ModelConfig[] = [
  {
    id: 'openai',
    providerId: 'openai',
    displayName: 'ChatGPT',
    modelId: 'gpt-4o',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    proxyPath: '/api/openai/v1/chat/completions',
    color: '#10a37f',
  },
  {
    id: 'anthropic',
    providerId: 'anthropic',
    displayName: 'Claude',
    modelId: 'claude-sonnet-4-20250514',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    proxyPath: null, // Direct CORS supported
    color: '#d97706',
  },
  {
    id: 'gemini',
    providerId: 'gemini',
    displayName: 'Gemini',
    modelId: 'gemini-2.0-flash',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    proxyPath: '/api/gemini/v1beta/models',
    color: '#4285f4',
  },
]

export type ProviderId = typeof MODELS[number]['providerId']
