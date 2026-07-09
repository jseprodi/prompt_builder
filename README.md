# Prompt Builder for Kontent.ai

A [Kontent.ai custom app](https://kontent.ai/learn/docs/custom-apps) that helps content teams write and refine prompts for **Aiko / the Main Agent** and **Expert Agents**. Fill in guided fields (or paste a draft), get a best-practice-compliant Markdown prompt, review what changed, then export or copy it into Kontent.ai.

No external API or LLM is required — refinement runs entirely in the browser.

## What it does

- **Two modes** — Aiko (ad-hoc commands) and Expert Agent (persistent, trigger-based agents), each with its own guided form and validation rules.
- **Template library** — start from built-in presets (bulk tagging, alt-text audit, metadata checks, and more) or add custom templates via the custom app Config JSON. Templates can declare which content types they apply to; matching ones are boosted in the picker when the app knows your project's content model.
- **Rule-based refinement** — structures your input into Markdown and shows a grouped checklist of what was added, inferred from a draft, or flagged for review. Each item names the best-practice rule it maps to, explains why it matters, and links to relevant Kontent.ai documentation when available.
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

No configuration JSON is required. Optionally, add custom templates via Config JSON (see below). For content-model-aware template suggestions in full-screen mode, set a Delivery API key at deploy time (see [Content-model-aware templates](#content-model-aware-templates)).

## Content-model-aware templates

When the app loads inside Kontent.ai, it tries to learn which content types exist in your project. Templates that declare a match are **re-ranked** (listed first) and **badged** — but nothing is hidden. Generic templates without content-type tags stay available for every project.

### What you see in the picker

- **Matches your content model** — optgroup at the top when any template's `contentTypes` or `contentTypeIds` overlap with your project.
- **Other templates** — everything else, including templates that don't declare content types.
- **Matches your project** badge — shown on the selected template when it matches (stylekit status pill, separate from the **(custom)** label on config templates).

Built-in presets for bulk tagging, alt-text audit, and metadata checks already include common codenames (`article`, `blog_post`, `page`, etc.). They badge automatically when your project has matching types.

### How content types are loaded

The [Custom App SDK](https://github.com/kontent-ai/custom-app-sdk-js) provides `environmentId` and, in some dialog contexts, content-type IDs (e.g. when opened from content inventory with a type filter). It does **not** expose a full content-type catalog.

The app therefore loads types in two ways:

1. **Delivery API (recommended for full-screen)** — on load, fetches `GET https://deliver.kontent.ai/{environmentId}/types` using the SDK's `environmentId`. Requires a read-only Delivery API key at **deploy time** (see below).
2. **SDK context fallback** — when opened as a contextual dialog, merges any content-type IDs from the current page (content type editor, filtered item listing, content type listing selection).

If neither source yields types, the picker works as before: flat list, no badges, no re-ranking.

### Delivery API key setup

For full-screen use (Custom apps menu), set `VITE_DELIVERY_API_KEY` in your hosting environment before building:

```bash
# .env.local (do not commit)
VITE_DELIVERY_API_KEY=your-read-only-delivery-api-key
```

Then build and deploy as usual:

```bash
npm run build
```

On Netlify/Vercel, add `VITE_DELIVERY_API_KEY` under environment variables for the build step.

Use a **read-only** Delivery API key scoped to this environment. Do **not** put API keys in the custom app Config JSON — Kontent.ai advises against storing secrets there.

### Verifying in Kontent.ai

1. Deploy with `VITE_DELIVERY_API_KEY` set (or open the app as a dialog from content inventory with a content-type filter).
2. Open Prompt Builder and pick **Aiko** or **Expert Agent**.
3. If your project has e.g. an `article` content type, templates like **Bulk tag by taxonomy** should appear under **Matches your content model**.
4. Select one — confirm the **Matches your project** badge appears below the dropdown.
5. Templates without `contentTypes` / `contentTypeIds` (e.g. **Translate content variants**) should remain visible, unbadged.

## Custom templates (optional)

Admins can add environment-specific templates in **Environment settings → Custom apps → Config**:

```json
{
  "templates": [
    {
      "id": "our-seo-audit",
      "label": "SEO audit on review",
      "description": "Flags missing meta descriptions when articles reach review.",
      "agentType": "expert",
      "contentTypes": ["article", "blog_post"],
      "useCases": ["seo", "metadata"],
      "expert": {
        "goal": "Flag articles missing meta descriptions before they reach Ready to publish",
        "trigger": "When an item moves to the Review workflow step",
        "guardrails": "Only review SEO elements on Article content types; do not publish",
        "escalation": "Add a comment listing missing fields; do not change content"
      }
    }
  ]
}
```

Optional template fields for content-model-aware suggestions:

| Field | Type | Description |
| --- | --- | --- |
| `contentTypes` | `string[]` | Content type codenames this template targets (e.g. `"article"`). When your project includes a matching type, the template is boosted in the picker and shows a **Matches your project** badge. |
| `contentTypeIds` | `string[]` | Content type UUIDs for explicit matching when codenames are not enough. |
| `useCases` | `string[]` | Descriptive tags for admins (e.g. `"seo"`, `"taxonomy"`). Informational only — not used for matching. |

Templates without `contentTypes` or `contentTypeIds` behave as they do today: they remain visible and are not badged or boosted.

Use `agentType: "aiko"` with an `aiko` object (`action`, `contentScope`, `intent`, optional `draft`) for Aiko templates. Built-in templates are always available; config templates are merged in and labeled "(custom)" in the picker.

## Local development

```bash
npm install
npm run dev
```

The dev server runs at `https://localhost:5173` with a self-signed certificate (required for embedding). Your browser will warn on first visit — that is expected.

Without embedding in Kontent.ai, the SDK context will not load and the app shows a context error. For full testing, deploy to a tunnel URL or use Netlify dev with a live URL, then add that URL as the custom app source in a Kontent.ai environment.

To test content-model matching locally, add `VITE_DELIVERY_API_KEY` to `.env.local` and embed the app in Kontent.ai (local dev alone cannot load the SDK context).

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/     UI (forms, export, history, preset picker)
  contexts/       Kontent.ai SDK context hook
  data/           Built-in prompt templates
  hooks/          Browser localStorage history; project content-type loading
  services/
    contentModel/ Content-type fetch (Delivery API + SDK context)
    presets/      Template loading, matching, and form pre-fill
    refinement/   Validation, prompt building, rule registry, best-practice checks
  types/          Shared TypeScript types (including refinement rule IDs)
  utils/          Export helpers
```

Styling uses [`@kontent-ai/stylekit`](https://github.com/kontent-ai/stylesheet-generator) for buttons, inputs, sections, radios, and status pills that match the Kontent.ai UI. A small `index.css` layer handles dialog layout only (sticky footer, scrollable body).

## How refinement works

The app validates your input against Kontent.ai best-practice rules, then assembles a structured Markdown prompt with the right sections for each agent type.

### Refinement checklist

After you click **Refine prompt**, the **What changed** panel groups feedback by category (Action, Scope, Intent, Goal, Trigger, Guardrails, and more). Each checklist item shows:

- **Change kind** — **Added** (structured into the prompt), **Inferred from draft** (parsed heuristically — confirm before use), or **Flagged for review** (needs your attention).
- **Rule name** — a stable ID-backed label such as *Declare suggest vs. act intent* or *Define a workflow trigger*.
- **Why it matters** — a one-sentence explanation of the underlying best practice.
- **Detail** — what changed in this specific run (same specificity as before).
- **Learn more** link — when a Kontent.ai learn article applies (e.g. [write clear prompts](https://kontent.ai/learn/set-up/ai-prompting/write-clear-prompts), [expert agents](https://kontent.ai/learn/docs/innovation-lab/expert-agents)).

Rule metadata lives in `src/services/refinement/ruleRegistry.ts` (`ruleId` → name, explanation, category, optional doc URL). Validation and refinement logic reference those IDs; no external API calls are involved.

When you paste a draft without filling in the structured fields, the app uses lightweight heuristics to infer action, scope, intent, and other details — always flagging inferred values so you can confirm them.

## Known limitations

- **Draft parsing is heuristic** — complex drafts may need manual editing after refinement.
- **History is local** — `localStorage` only, per browser; not shared across users or devices.
- **Content-type matching needs project data** — full-screen mode requires `VITE_DELIVERY_API_KEY` at deploy time; without it (and without a contextual dialog), templates are not re-ranked or badged. The picker still lists every template.

## License

MIT
