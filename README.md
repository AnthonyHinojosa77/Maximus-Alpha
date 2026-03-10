# MAXIMUS

Multi-model AI decision console. One prompt. Multiple models. Side-by-side comparison.

## Status: Alpha (Track 1)

MAXIMUS is a localhost-only BYOK prototype. Full functionality requires running the dev server locally. The GitHub Pages deployment is a static showcase only.

### Current Phase: Phase 1 - Scaffold + Themed Shell

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
| Anthropic (Claude) | claude-sonnet-4 | Planned |
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
# Open http://localhost:5173
```

## Work Log

### Phase 1: Scaffold + Themed Shell
- [x] Vite + React + TypeScript scaffolded
- [x] Tailwind CSS configured with terminal theme
- [x] AppShell, Header, PromptComposer, ResponseGrid built
- [x] GitHub Actions deploy workflow set up
- [x] GitHub repo created and first push

### Phase 2: API Adapters (Next)
- [ ] BaseModelAdapter abstract class
- [ ] Anthropic adapter (direct CORS)
- [ ] OpenAI adapter (Vite proxy)
- [ ] Gemini adapter (Vite proxy)
- [ ] Streaming text display

### Phase 3: Multi-Model Orchestration
- [ ] Parallel model queries
- [ ] Zustand model store
- [ ] Response grid with live streaming

### Phase 4: Error Handling + Abort
### Phase 5: BYOK Key Storage + PIN Lock
### Phase 6: Disagreement Detection + Synthesis
### Phase 7: Browser TTS Read-Aloud
### Phase 8: Session History

---

## License

Private project. All rights reserved.
