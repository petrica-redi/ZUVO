# Voice — multilingual mic with Deepgram + Claude

Redi Health supports voice input in **30+ languages**, including languages where the browser's WebSpeech engine is unreliable (Albanian, Romani, Bulgarian, Macedonian…). The transport is:

```
browser MediaRecorder → POST /api/voice/transcribe → Deepgram nova-3 (multilingual STT) → /api/chat → Claude/OpenAI streaming reply → optional text-to-speech via the browser
```

If the operator has not configured Deepgram, the mic falls back to the browser's WebSpeech recogniser automatically (only languages Chrome/Edge support).

## Setup

1. Create a Deepgram project at [console.deepgram.com](https://console.deepgram.com), generate an API key with **Member** scope.
2. In your host's environment (Vercel → Project → Settings → Environment Variables):

   ```
   DEEPGRAM_API_KEY=<your key>
   ```

   Set the same value for **Production** and **Preview**. Do **not** commit the key.
3. Redeploy. `/api/voice/transcribe` will respond 200 with transcripts; if the key is missing it returns `503 voice_unavailable` and the client transparently degrades to WebSpeech.

## Behaviour

| Capability                  | Source                                                    |
|-----------------------------|-----------------------------------------------------------|
| Speech-to-text              | Deepgram `nova-3` with `detect_language=true`             |
| Language detection          | Returned by Deepgram (`results.channels[0].detected_language`) |
| Translation (optional)      | Deepgram `translate=` query param, or Claude in the reply |
| LLM reply                   | Claude (Anthropic) when `ANTHROPIC_API_KEY` is set, OpenAI otherwise |
| Reply language              | Locale-aware — `/api/chat` instructs the model to answer in the user's locale |
| Text-to-speech (read aloud) | Browser `speechSynthesis` (already wired in `ChatAdvisor`) |

## Permissions

The site sends `Permissions-Policy: microphone=(self)` so embedded iframes can't claim the mic. The first time a user taps the mic button, the browser will request mic permission.

## Rate limiting

`/api/voice/transcribe` is capped at **20 requests/min/IP** (`namespace=voice-transcribe` in `rate-limit.ts`). Bump or move to Upstash Redis for multi-instance deploys.

## Cost protection

Deepgram is billed per audio minute. The route enforces a **10 MB / clip** ceiling and rejects empty / non-audio uploads. If you want a per-user daily cap, mirror the `checkAiBudget` pattern from `/api/chat`.

## Key rotation

If a key was leaked (e.g. pasted in chat), rotate it in the Deepgram console — old keys can be revoked instantly. The Cloud Agent environment in this repo never persists the key in source.
