import { MODELS } from '@/constants/models'
import { ResponseCard } from './ResponseCard'

export function ResponseGrid() {
  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        {MODELS.map((model) => (
          <ResponseCard
            key={model.id}
            modelName={model.displayName}
            modelColor={model.color}
          />
        ))}
      </div>
    </div>
  )
}
