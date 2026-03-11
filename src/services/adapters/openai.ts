import type { StreamCallbacks } from '@/types/models'
import { BaseModelAdapter } from './base'

export class OpenAIAdapter extends BaseModelAdapter {
  get providerId() {
    return 'openai' as const
  }

  get displayName() {
    return 'ChatGPT'
  }

  async sendMessage(
    userMessage: string,
    callbacks: StreamCallbacks,
    signal?: AbortSignal,
  ): Promise<void> {
    let response: Response

    try {
      response = await fetch('/api/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.modelId,
          max_tokens: 4096,
          stream: true,
          messages: [
            { role: 'system', content: this.config.systemPrompt },
            { role: 'user', content: userMessage },
          ],
        }),
        signal,
      })
    } catch (err) {
      if (signal?.aborted) return
      callbacks.onError(
        err instanceof Error ? err : new Error('Network request failed'),
      )
      return
    }

    if (!response.ok) {
      let errorMessage: string
      try {
        const errorBody = await response.json()
        errorMessage =
          errorBody?.error?.message || `HTTP ${response.status}: ${response.statusText}`
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }

      if (response.status === 401) {
        callbacks.onError(new Error('Invalid API key. Check your OpenAI key.'))
      } else if (response.status === 429) {
        callbacks.onError(new Error('Rate limited. Try again in a moment.'))
      } else {
        callbacks.onError(new Error(errorMessage))
      }
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      callbacks.onError(new Error('No response body to read'))
      return
    }

    const decoder = new TextDecoder()
    let fullText = ''
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue

          const data = line.slice(6).trim()
          if (!data || data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const token = parsed.choices?.[0]?.delta?.content
            if (token) {
              fullText += token
              callbacks.onToken(token)
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    } catch (err) {
      if (signal?.aborted) {
        if (fullText) callbacks.onComplete(fullText)
        return
      }
      callbacks.onError(
        err instanceof Error ? err : new Error('Stream reading failed'),
      )
      return
    }

    callbacks.onComplete(fullText)
  }
}
