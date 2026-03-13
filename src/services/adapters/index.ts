import type { ProviderId } from '@/types/models'
import type { AdapterConfig } from './base'
import { BaseModelAdapter } from './base'
import { AnthropicAdapter } from './anthropic'
import { OpenAIAdapter } from './openai'
import { GeminiAdapter } from './gemini'

const ADAPTER_MAP: Record<string, new (config: AdapterConfig) => BaseModelAdapter> = {
  anthropic: AnthropicAdapter,
  openai: OpenAIAdapter,
  gemini: GeminiAdapter,
}

export function createAdapter(
  providerId: ProviderId,
  config: AdapterConfig,
): BaseModelAdapter | null {
  const AdapterClass = ADAPTER_MAP[providerId]
  if (!AdapterClass) return null
  return new AdapterClass(config)
}

export function isProviderSupported(providerId: string): boolean {
  return providerId in ADAPTER_MAP
}
