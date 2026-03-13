import type { StreamCallbacks } from '@/types/models'
import { BaseModelAdapter } from './base'

export class GeminiAdapter extends BaseModelAdapter {
  get providerId() {
    return 'gemini' as const
  }

  get displayName() {
    return 'Gemini'
  }

  async sendMessage(
    userMessage: string,
    callbacks: StreamCallbacks,
    signal?: AbortSignal,
  ): Promise<void> {
    // Gemini uses API key as query param, not Authorization header
    const url = `/_px/b/v1beta/models/${this.config.modelId}:streamGenerateContent?alt=sse&key=${this.config.apiKey}`

    let response: Response

    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: this.config.systemPrompt }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userMessage }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 4096,
          },
          ...this.config.extraBody,
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
          errorBody?.error?.message ||
          `HTTP ${response.status}: ${response.statusText}`
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }

      // Gemini returns 400 for invalid API keys with "API key not valid" message
      if (
        response.status === 400 &&
        errorMessage.toLowerCase().includes('api key')
      ) {
        callbacks.onError(new Error('Invalid API key. Check your Gemini key.'))
      } else if (response.status === 403) {
        callbacks.onError(new Error('Invalid API key. Check your Gemini key.'))
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
            // Gemini SSE format: candidates[0].content.parts[0].text
            const parts = parsed.candidates?.[0]?.content?.parts
            if (parts) {
              for (const part of parts) {
                if (part.text) {
                  fullText += part.text
                  callbacks.onToken(part.text)
                }
              }
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
