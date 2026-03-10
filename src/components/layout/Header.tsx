import { APP_NAME } from '@/constants/theme'

interface HeaderProps {
  onSettingsClick: () => void
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="border-b border-terminal-gray bg-terminal-dark">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <h1 className="text-glow text-xl font-bold tracking-[0.2em] text-terminal-green md:text-2xl">
            {APP_NAME}
          </h1>
          <span className="hidden text-xs text-terminal-muted md:inline">
            MULTI-MODEL AI CONSOLE
          </span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Scout mode badge */}
          <div className="flex items-center gap-1.5 rounded border border-terminal-gray bg-terminal-darker px-2 py-1 text-xs">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-terminal-green pulse-glow" />
            <span className="text-terminal-green-dim">SCOUT</span>
          </div>

          {/* Settings button */}
          <button
            onClick={onSettingsClick}
            className="rounded border border-terminal-gray bg-terminal-darker px-3 py-1.5 text-xs text-terminal-light transition-colors hover:border-terminal-green hover:text-terminal-green"
          >
            SETTINGS
          </button>
        </div>
      </div>
    </header>
  )
}
