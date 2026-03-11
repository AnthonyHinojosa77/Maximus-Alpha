import { MODELS } from '@/constants/models'
import { useModelStore } from '@/store/modelStore'
import { isProviderSupported } from '@/services/adapters/index'
import { ResponseCard } from './ResponseCard'

interface ResponseGridProps {
  onAbortOne?: (providerId: string) => void
}

export function ResponseGrid({ onAbortOne }: ResponseGridProps) {
  const responses = useModelStore((s) => s.responses)

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        {MODELS.map((model) => {
          const state = responses[model.providerId]
          const supported = isProviderSupported(model.providerId)
          return (
            <ResponseCard
              key={model.id}
              providerId={model.providerId}
              modelName={model.displayName}
              modelColor={model.color}
              response={state?.text}
              isStreaming={state?.streaming ?? false}
              error={state?.error ?? null}
              latencyMs={state?.latencyMs ?? null}
              supported={supported}
              onAbort={onAbortOne ? () => onAbortOne(model.providerId) : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
