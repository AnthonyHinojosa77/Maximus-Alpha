interface ResponseCardProps {
  modelName: string
  modelColor: string
  response?: string
  isStreaming?: boolean
  error?: string | null
}

export function ResponseCard({
  modelName,
  modelColor,
  response,
  isStreaming = false,
  error = null,
}: ResponseCardProps) {
  return (
    <div className="box-glow animate-fade-in flex flex-col rounded border border-terminal-gray bg-terminal-darker">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-terminal-gray px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: modelColor }}
          />
          <span className="text-xs font-semibold tracking-wider text-terminal-light">
            {modelName.toUpperCase()}
          </span>
        </div>
        {isStreaming && (
          <span className="pulse-glow text-[10px] text-terminal-green">
            STREAMING
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="min-h-[120px] flex-1 p-3 text-sm leading-relaxed md:min-h-[200px]">
        {error ? (
          <p className="text-terminal-red">{error}</p>
        ) : response ? (
          <p className="whitespace-pre-wrap text-terminal-light">
            {response}
            {isStreaming && <span className="cursor-blink text-terminal-green">_</span>}
          </p>
        ) : (
          <p className="text-terminal-muted">
            Awaiting query...
          </p>
        )}
      </div>

      {/* Card footer */}
      <div className="flex items-center gap-2 border-t border-terminal-gray px-3 py-1.5">
        <button
          className="text-[10px] text-terminal-muted transition-colors hover:text-terminal-green disabled:cursor-not-allowed"
          disabled={!response}
        >
          [COPY]
        </button>
        <button
          className="text-[10px] text-terminal-muted transition-colors hover:text-terminal-green disabled:cursor-not-allowed"
          disabled={!response}
        >
          [READ]
        </button>
      </div>
    </div>
  )
}
