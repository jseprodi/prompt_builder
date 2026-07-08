# Prompt Builder for Kontent.ai

A [Kontent.ai custom app](https://kontent.ai/learn/docs/custom-apps) that helps content teams write and refine prompts for **Aiko / the Main Agent** and **Expert Agents**. Fill in guided fields (or paste a draft), get a best-practice-compliant Markdown prompt, review what changed, then export or copy it into Kontent.ai.

No external API or LLM is required — refinement runs entirely in the browser.

## What it does

- **Two modes** — Aiko (ad-hoc commands) and Expert Agent (persistent, trigger-based agents), each with its own guided form and validation rules.
- **Rule-based refinement** — structures your input into Markdown and shows a checklist of what was missing, inferred, or improved.
- **Export** — download `{agent-type}-prompt-{yyyy-mm-dd}.md` or copy to clipboard.
- **Local history** — keeps the last 10 refined prompts in browser storage (not synced).

## Quick deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_ORG/prompt-builder)

After deploying, add the hosted URL under **Environment settings → Custom apps** in Kontent.ai.

## Add the app in Kontent.ai

1. Deploy the `dist` folder to Netlify, Vercel, GitHub Pages, or similar (HTTPS required).
2. In Kontent.ai: **Environment settings → Custom apps → Create new**.
3. Set **Name** to `Prompt Builder` (or your preference).
4. Set **Hosted code URL** to your deployment URL.
5. Choose **Full screen** or **Dialog** display mode.
6. Save and open the app from the left-hand custom apps menu.

No configuration JSON or API keys are needed.

## Local development

```bash
npm install
npm run dev
```

The dev server runs at `https://localhost:5173` with a self-signed certificate (required for embedding). Your browser will warn on first visit — that is expected.

Without embedding in Kontent.ai, the SDK context will not load and the app shows a context error. For full testing, deploy to a tunnel URL or use Netlify dev with a live URL, then add that URL as the custom app source in a Kontent.ai environment.

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/     UI (forms, export, history)
  contexts/       Kontent.ai SDK context hook
  hooks/          Browser localStorage history
  services/
    refinement/   Validation, prompt building, best-practice checks
  types/          Shared TypeScript types
  utils/          Export helpers
```

Styling uses [`@kontent-ai/stylekit`](https://github.com/kontent-ai/stylesheet-generator) for buttons, inputs, sections, radios, and status pills that match the Kontent.ai UI. A small `index.css` layer handles dialog layout only (sticky footer, scrollable body).

## How refinement works

The app validates your input against Kontent.ai best-practice rules, then assembles a structured Markdown prompt with the right sections for each agent type. A change checklist shows what was added, inferred from a draft, or flagged for review.

When you paste a draft without filling in the structured fields, the app uses lightweight heuristics to infer action, scope, intent, and other details — always flagging inferred values so you can confirm them.

## Known limitations

- **Draft parsing is heuristic** — complex drafts may need manual editing after refinement.
- **History is local** — `localStorage` only, per browser; not shared across users or devices.

## License

MIT
