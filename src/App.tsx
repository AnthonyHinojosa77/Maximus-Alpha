import { AppShell } from '@/components/layout/AppShell'
import { PromptComposer } from '@/components/prompt/PromptComposer'
import { ResponseGrid } from '@/components/response/ResponseGrid'

function App() {
  const handleSubmit = (prompt: string) => {
    console.log('Prompt submitted:', prompt)
    // Phase 2: Wire to model adapters
  }

  return (
    <AppShell>
      <PromptComposer onSubmit={handleSubmit} />
      <ResponseGrid />
    </AppShell>
  )
}

export default App
