export type ProviderId = 'openai' | 'anthropic' | 'gemini'

export interface StreamCallbacks {
  onToken: (token: string) => void
  onComplete: (fullText: string) => void
  onError: (error: Error) => void
}

export interface ModelResponseState {
  text: string
  streaming: boolean
  error: string | null
  latencyMs: number | null
}
