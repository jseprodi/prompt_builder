export const AIKO_BEST_PRACTICES = `
Aiko / Main Agent prompt best practices:
- Every effective prompt states three things explicitly: the action, the content scope, and the intent (suggest changes vs. take direct action).
- Aiko fits repetitive, pattern-based work across multiple items (bulk tagging, auditing, translating).
- Aiko drafts for human approval; it does not replace judgment.
- Prefer specific, concrete scope language over vague references.
`.trim();

export const EXPERT_BEST_PRACTICES = `
Expert Agent prompt best practices:
- Keep the goal statement short and focused on the overall purpose — one sentence, one job.
- One goal per agent.
- Do not embed item-specific details directly in the goal.
- Avoid technical jargon in the goal — describe outcomes, not mechanics.
- Define trigger, guardrails, and fallback for ambiguous or missing data.
- Reinforce human-in-the-loop: agents operate within existing permissions and approvals.
`.trim();

export const GENERAL_STRUCTURE = `
General prompt structure:
- Role/persona (where relevant)
- Goal/action
- Context/scope
- Constraints/guardrails
- Output format or expected result
- Fallback for ambiguity or missing data
`.trim();
