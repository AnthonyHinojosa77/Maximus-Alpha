interface ResponseCardProps {
  providerId: string
  modelName: string
  modelVariantLabel?: string
  modelColor: string
  response?: string
  isStreaming?: boolean
  error?: string | null
  latencyMs?: number | null
  supported?: boolean
  onAbort?: () => void
}

export function ResponseCard({
  modelName,
  modelVariantLabel,
  modelColor,
  response,
  isStreaming = false,
  error = null,
  latencyMs = null,
  supported = true,
  onAbort,
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
            {modelVariantLabel && (
              <span className="font-normal text-terminal-muted">
                {' · '}
                {modelVariantLabel.toUpperCase()}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isStreaming && (
            <>
              <span className="pulse-glow text-[10px] text-terminal-green">
                STREAMING
              </span>
              {onAbort && (
                <button
                  onClick={onAbort}
                  className="text-[10px] text-terminal-red transition-colors hover:text-terminal-amber"
                >
                  [STOP]
                </button>
              )}
            </>
          )}
          {!isStreaming && latencyMs != null && latencyMs > 0 && (
            <span className="text-[10px] text-terminal-muted">
              {(latencyMs / 1000).toFixed(1)}s
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="min-h-[120px] flex-1 overflow-y-auto p-3 text-sm leading-relaxed md:min-h-[200px]">
        {!supported ? (
          <p className="text-terminal-muted">
            Adapter not yet implemented.
          </p>
        ) : error ? (
          <p className="text-terminal-red">{error}</p>
        ) : response ? (
          <p className="whitespace-pre-wrap text-terminal-light">
            {response}
            {isStreaming && (
              <span className="cursor-blink text-terminal-green">_</span>
            )}
          </p>
        ) : isStreaming ? (
          <p className="text-terminal-muted pulse-glow">
            Waiting for response...
          </p>
        ) : (
          <p className="text-terminal-muted">Awaiting query...</p>
        )}
      </div>

      {/* Card footer */}
      <div className="flex items-center gap-2 border-t border-terminal-gray px-3 py-1.5">
        <button
          className="text-[10px] text-terminal-muted transition-colors hover:text-terminal-green disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!response || isStreaming}
          onClick={() => {
            if (response) navigator.clipboard.writeText(response)
          }}
        >
          [COPY]
        </button>
        <button
          className="text-[10px] text-terminal-muted transition-colors hover:text-terminal-green disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!response || isStreaming}
        >
          [READ]
        </button>
      </div>
    </div>
  )
}
