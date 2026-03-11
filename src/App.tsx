import { AppShell } from '@/components/layout/AppShell'
import { ApiKeyBar } from '@/components/settings/ApiKeyBar'
import { PromptComposer } from '@/components/prompt/PromptComposer'
import { ResponseGrid } from '@/components/response/ResponseGrid'
import { useModelQuery } from '@/hooks/useModelQuery'

function App() {
  const { sendQuery, abortAll, abortOne, anyStreaming } = useModelQuery()

  return (
    <AppShell>
      <ApiKeyBar />
      <PromptComposer
        onSubmit={sendQuery}
        disabled={anyStreaming}
        onAbort={anyStreaming ? abortAll : undefined}
      />
      <ResponseGrid onAbortOne={abortOne} />
    </AppShell>
  )
}

export default App
