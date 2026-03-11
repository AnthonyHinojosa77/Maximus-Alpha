import { useState, useRef, useCallback } from 'react'

interface PromptComposerProps {
  onSubmit: (prompt: string) => void
  disabled?: boolean
  onAbort?: () => void
}

export function PromptComposer({ onSubmit, disabled = false, onAbort }: PromptComposerProps) {
  const [prompt, setPrompt] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(() => {
    const trimmed = prompt.trim()
    if (!trimmed || disabled) return
    onSubmit(trimmed)
    setPrompt('')
  }, [prompt, disabled, onSubmit])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  return (
    <div className="border-b border-terminal-gray bg-terminal-dark p-4 md:p-6">
      <div className="box-glow mx-auto flex max-w-5xl items-end gap-3 rounded border border-terminal-gray bg-terminal-darker p-3">
        <div className="flex-1">
          <label className="mb-1.5 block text-[10px] tracking-widest text-terminal-muted">
            PROMPT &gt;
          </label>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your query for all models..."
            disabled={disabled}
            rows={2}
            className="w-full resize-none bg-transparent text-sm text-terminal-light placeholder-terminal-muted outline-none"
          />
        </div>
        {onAbort ? (
          <button
            onClick={onAbort}
            className="shrink-0 rounded border border-terminal-red bg-terminal-red/10 px-4 py-2 text-xs font-semibold tracking-wider text-terminal-red transition-all hover:bg-terminal-red/20"
          >
            ■ ABORT ALL
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || disabled}
            className="shrink-0 rounded border border-terminal-green bg-terminal-green/10 px-4 py-2 text-xs font-semibold tracking-wider text-terminal-green transition-all hover:bg-terminal-green/20 disabled:cursor-not-allowed disabled:border-terminal-gray disabled:bg-transparent disabled:text-terminal-muted"
          >
            SEND
          </button>
        )}
      </div>
    </div>
  )
}
