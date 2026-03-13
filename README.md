# MAXIMUS

Multi-model AI decision console. One prompt. Multiple models. Side-by-side comparison.

## Status: Alpha (Track 1)

MAXIMUS is a localhost-only BYOK prototype. Full functionality requires running the dev server locally. The GitHub Pages deployment is a static showcase only.

### Current Phase: Phase 5 — Per-Provider Model Selection (Complete)

## What Works Right Now

- Themed shell renders locally with retro-futurist terminal aesthetic
- **Three providers streaming**: OpenAI (ChatGPT), Claude, and Gemini — all verified end-to-end
- **Per-provider model selection**: dropdown per provider with multiple model variants
- Model IDs centralized in a single registry — no hardcoded IDs inside adapter logic
- Card headers show selected variant (e.g. CHATGPT · GPT-5.4 THINKING, CLAUDE · OPUS 4.6, GEMINI · 3.1 PRO)
- Thinking/reasoning config passed via `extraBody` mechanism (Claude adaptive thinking, OpenAI reasoning_effort)
- Streaming state visible (STREAMING label, blinking cursor, token-by-token)
- Latency displayed after completion
- Abort (per-card STOP + global ABORT ALL) works mid-stream
- Error handling: invalid key, rate limit, network errors shown in red per provider
- In-memory API key entry (keys vanish on tab close)
- [COPY] button copies response to clipboard
- Ad-blocker-resistant proxy paths (`/_px/a`, `/_px/b`, etc.)
- GitHub Pages static showcase deploys

---

## What MAXIMUS Does

Send a single prompt to multiple AI models simultaneously. Compare their responses side-by-side. See where they agree, disagree, and what synthesis emerges.

This is not a chatbot wrapper. It is an operator's decision console.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 + custom terminal aesthetic (green-on-black)
- **State**: Zustand (concurrent streaming + model selection)
- **Model Registry**: Centralized `PROVIDERS` config with per-model `extraBody` passthrough
- **CORS**: Vite dev proxy for OpenAI/Gemini; direct browser CORS for Claude
- **Storage**: In-memory only (Phase 6 planned: IndexedDB + encryption)
- **TTS**: Not yet implemented (Phase 8 planned: browser-native speechSynthesis)

## Alpha Provider Set

| Provider | Models | Default | Status |
|----------|--------|---------|--------|
| OpenAI (ChatGPT) | GPT-5.4 Thinking, GPT-5 Mini | GPT-5.4 Thinking | **Working** |
| Anthropic (Claude) | Opus 4.6, Sonnet 4.6 | Opus 4.6 | **Working** |
| Google (Gemini) | 3.1 Pro (preview), 3 Flash (preview) | 3.1 Pro | **Working** |

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
Status: **Complete**
Verified: Real OpenAI streaming end-to-end on localhost

Acceptance criteria:
- [x] OpenAI adapter (SSE via Vite proxy)
- [x] Streaming text display for ChatGPT
- [x] Error handling (invalid key, rate limit)
- [x] Verified end-to-end with real OpenAI key

### Phase 4: Gemini Adapter
Status: **Complete**
Verified: Real Gemini streaming end-to-end on localhost

Acceptance criteria:
- [x] Gemini adapter (SSE via Vite proxy)
- [x] Streaming text display for Gemini
- [x] Error handling (invalid key, rate limit)
- [x] Verified end-to-end with real Gemini key
- [x] Ad-blocker-resistant proxy paths (`/_px/a`, `/_px/b`)

### Phase 5: Per-Provider Model Selection
Status: **Complete**
Verified: All three providers streaming with correct models selected via dropdown

Acceptance criteria:
- [x] Central model registry (`PROVIDERS` array with `ModelVariant[]`)
- [x] Per-provider model dropdown in API key bar
- [x] Card headers show provider + selected variant label
- [x] `extraBody` passthrough for thinking/reasoning config
- [x] Claude adaptive thinking (`thinking: {type: "adaptive"}`)
- [x] OpenAI reasoning effort (`reasoning_effort: "high"`)
- [x] OpenAI uses `max_completion_tokens` (GPT-5 family requirement)
- [x] No legacy model IDs remain (gemini-2.0-flash removed)
- [x] Model IDs fully centralized — adapters receive config only

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
