import {
  PROVIDERS,
  getDefaultModelId,
  getModelVariant,
} from '@/constants/models'
import { useModelStore } from '@/store/modelStore'
import { useSettingsStore } from '@/store/settingsStore'
import { isProviderSupported } from '@/services/adapters/index'
import { ResponseCard } from './ResponseCard'

interface ResponseGridProps {
  onAbortOne?: (providerId: string) => void
}

export function ResponseGrid({ onAbortOne }: ResponseGridProps) {
  const responses = useModelStore((s) => s.responses)
  const selectedModels = useSettingsStore((s) => s.selectedModels)

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        {PROVIDERS.map((provider) => {
          const state = responses[provider.providerId]
          const supported = isProviderSupported(provider.providerId)
          const selectedModelId =
            selectedModels[provider.providerId] ||
            getDefaultModelId(provider)
          const variant = getModelVariant(provider, selectedModelId)
          return (
            <ResponseCard
              key={provider.id}
              providerId={provider.providerId}
              modelName={provider.displayName}
              modelVariantLabel={variant?.label}
              modelColor={provider.color}
              response={state?.text}
              isStreaming={state?.streaming ?? false}
              error={state?.error ?? null}
              latencyMs={state?.latencyMs ?? null}
              supported={supported}
              onAbort={
                onAbortOne
                  ? () => onAbortOne(provider.providerId)
                  : undefined
              }
            />
          )
        })}
      </div>
    </div>
  )
}
