import type { StreamCallbacks } from '@/types/models'
import { BaseModelAdapter } from './base'

export class AnthropicAdapter extends BaseModelAdapter {
  get providerId() {
    return 'anthropic' as const
  }

  get displayName() {
    return 'Claude'
  }

  async sendMessage(
    userMessage: string,
    callbacks: StreamCallbacks,
    signal?: AbortSignal,
  ): Promise<void> {
    let response: Response

    try {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: this.config.modelId,
          max_tokens: 4096,
          system: this.config.systemPrompt,
          stream: true,
          messages: [{ role: 'user', content: userMessage }],
        }),
        signal,
      })
    } catch (err) {
      if (signal?.aborted) {
        return // Abort is not an error — just stop silently
      }
      callbacks.onError(
        err instanceof Error ? err : new Error('Network request failed'),
      )
      return
    }

    // Handle HTTP error responses
    if (!response.ok) {
      let errorMessage: string
      try {
        const errorBody = await response.json()
        errorMessage =
          errorBody?.error?.message || `HTTP ${response.status}: ${response.statusText}`
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }

      if (response.status === 401 || response.status === 403) {
        callbacks.onError(new Error('Invalid API key. Check your Anthropic key.'))
      } else if (response.status === 429) {
        callbacks.onError(new Error('Rate limited. Try again in a moment.'))
      } else {
        callbacks.onError(new Error(errorMessage))
      }
      return
    }

    // Parse SSE stream
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

        // Process complete lines from the buffer
        const lines = buffer.split('\n')
        // Keep the last (potentially incomplete) line in the buffer
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue

          const data = line.slice(6).trim()
          if (!data || data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)

            if (parsed.type === 'content_block_delta') {
              const token = parsed.delta?.text
              if (token) {
                fullText += token
                callbacks.onToken(token)
              }
            } else if (parsed.type === 'error') {
              callbacks.onError(
                new Error(parsed.error?.message || 'Stream error from Anthropic'),
              )
              return
            }
            // Ignore other event types (message_start, content_block_start, message_delta, message_stop)
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    } catch (err) {
      if (signal?.aborted) {
        // Abort mid-stream: preserve whatever text we got
        if (fullText) {
          callbacks.onComplete(fullText)
        }
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
