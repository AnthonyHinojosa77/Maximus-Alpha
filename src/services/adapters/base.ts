import type { StreamCallbacks } from '@/types/models'

export interface AdapterConfig {
  apiKey: string
  systemPrompt: string
  modelId: string
}

export abstract class BaseModelAdapter {
  protected config: AdapterConfig

  constructor(config: AdapterConfig) {
    this.config = config
  }

  /**
   * Send a message and stream the response.
   * Calls onToken for each chunk, onComplete with the full text when done,
   * onError if something fails. Pass an AbortSignal to cancel mid-stream.
   */
  abstract sendMessage(
    userMessage: string,
    callbacks: StreamCallbacks,
    signal?: AbortSignal,
  ): Promise<void>

  abstract get providerId(): string
  abstract get displayName(): string
}
