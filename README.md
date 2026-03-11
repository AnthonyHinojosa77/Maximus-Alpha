# MAXIMUS

Multi-model AI decision console. One prompt. Multiple models. Side-by-side comparison.

## Status: Alpha (Track 1)

MAXIMUS is a localhost-only BYOK prototype. Full functionality requires running the dev server locally. The GitHub Pages deployment is a static showcase only.

### Current Phase: Phase 3 — OpenAI Adapter

## What Works Right Now

- Themed shell renders locally with retro-futurist terminal aesthetic
- Claude adapter: real SSE streaming via direct browser CORS
- Streaming state visible (STREAMING label, blinking cursor, token-by-token)
- Latency displayed after completion
- Abort (per-card STOP + global ABORT ALL) works mid-stream
- Error handling: invalid key, rate limit, network errors shown in red
- In-memory API key entry (keys vanish on tab close)
- [COPY] button copies response to clipboard
- GitHub Pages static showcase deploys

---

## What MAXIMUS Does

Send a single prompt to multiple AI models simultaneously. Compare their responses side-by-side. See where they agree, disagree, and what synthesis emerges.

This is not a chatbot wrapper. It is an operator's decision console.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 + custom terminal aesthetic (green-on-black)
- **State**: Zustand (concurrent streaming)
- **Storage**: IndexedDB (encrypted API keys, session history)
- **CORS**: Vite dev proxy (localhost only)
- **TTS**: Browser-native speechSynthesis

## Alpha Provider Set

| Provider | Model | Status |
|----------|-------|--------|
| OpenAI (ChatGPT) | gpt-4o | Planned |
| Anthropic (Claude) | claude-sonnet-4 | **Working** |
| Google (Gemini) | gemini-2.0-flash | Planned |

## Getting Started

```bash
# Clone
git clone https://github.com/AnthonyHinojosa77/Maximus-Alpha.git
cd Maximus-Alpha

# Install
npm install

# Run
npm run dev
# Open http://localhost:5173/Maximus-Alpha/
```

## Work Log

### Phase 1: Scaffold + Themed Shell
Status: Complete  
Verified: Localhost + GitHub Pages shell

Acceptance criteria:
- [x] Vite + React + TypeScript scaffolded
- [x] Tailwind CSS configured with terminal theme
- [x] AppShell, Header, PromptComposer, ResponseGrid built
- [x] GitHub Actions deploy workflow set up
- [x] GitHub repo created and first push

### Phase 2: Claude Adapter + Core Loop
Status: **Complete**
Verified: Real Claude streaming end-to-end on localhost

Acceptance criteria:
- [x] BaseModelAdapter abstract class
- [x] Anthropic adapter (direct browser CORS, SSE streaming)
- [x] Zustand modelStore for per-model streaming state
- [x] In-memory API key store (settingsStore)
- [x] useModelQuery orchestrator hook with abort support
- [x] ApiKeyBar component with collapsible key entry
- [x] ResponseCard: streaming, error, latency, abort, copy states
- [x] PromptComposer: SEND + ABORT ALL toggle
- [x] Zero console errors, TypeScript clean, build passes

### Phase 3: OpenAI Adapter
Status: In Progress

Acceptance criteria:
- [ ] OpenAI adapter (SSE via Vite proxy)
- [ ] Streaming text display for ChatGPT
- [ ] Error handling (invalid key, rate limit)
- [ ] Verified end-to-end with real OpenAI key

### Phase 4: Gemini Adapter
Status: Not Started

Acceptance criteria:
- [ ] Gemini adapter (SSE via Vite proxy)
- [ ] Streaming text display for Gemini
- [ ] Verified end-to-end with real Gemini key

### Phase 5: Error Handling + Abort Polish
Status: Not Started

### Phase 6: BYOK Key Storage + PIN Lock
Status: Not Started

### Phase 7: Disagreement Detection + Synthesis
Status: Not Started

### Phase 8: Browser TTS Read-Aloud
Status: Not Started

### Phase 9: Session History
Status: Not Started

---

## License

Private project. All rights reserved.
