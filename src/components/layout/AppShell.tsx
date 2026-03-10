import type { ReactNode } from 'react'
import { useState } from 'react'
import { Header } from './Header'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="scanlines flex min-h-screen flex-col bg-terminal-black">
      <Header onSettingsClick={() => setSettingsOpen(!settingsOpen)} />

      <main className="flex flex-1 flex-col">
        {children}
      </main>

      {/* Status bar */}
      <footer className="border-t border-terminal-gray bg-terminal-dark px-4 py-1.5">
        <div className="flex items-center justify-between text-[10px] text-terminal-muted">
          <span>MAXIMUS v0.1.0-alpha</span>
          <span>LOCALHOST MODE</span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-terminal-green" />
            READY
          </span>
        </div>
      </footer>
    </div>
  )
}
