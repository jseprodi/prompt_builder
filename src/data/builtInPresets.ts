import type { PromptPreset } from "../types/presets";

export const BUILT_IN_PRESETS: PromptPreset[] = [
  {
    id: "aiko-bulk-tag",
    label: "Bulk tag by taxonomy",
    description: "Suggest taxonomy terms for a batch of items so you can review and apply them.",
    agentType: "aiko",
    source: "built-in",
    aiko: {
      action: "Tag items with the correct taxonomy terms",
      contentScope:
        "All items in the [Content type] content type in the [Collection] collection that are missing [Taxonomy group] terms",
      intent: "suggest",
    },
  },
  {
    id: "aiko-translate",
    label: "Translate content variants",
    description: "Draft translations for multiple language variants across a defined set of items.",
    agentType: "aiko",
    source: "built-in",
    aiko: {
      action: "Translate content into the target language",
      contentScope:
        "All [Content type] items in [Collection] where the [Language] variant exists but needs translation review",
      intent: "suggest",
    },
  },
  {
    id: "aiko-audit-alt",
    label: "Audit missing alt text",
    description: "Find image elements without alt text across a content scope.",
    agentType: "aiko",
    source: "built-in",
    aiko: {
      action: "Audit items for missing or low-quality alt text on images",
      contentScope:
        "All published and draft [Content type] items in [Collection] updated in the last 30 days",
      intent: "suggest",
    },
  },
  {
    id: "aiko-rewrite-tone",
    label: "Rewrite for brand voice",
    description: "Propose rewrites so a batch of content matches your tone and style guidelines.",
    agentType: "aiko",
    source: "built-in",
    aiko: {
      action: "Rewrite body copy to match our brand voice and style guidelines",
      contentScope: "All [Content type] items in [Collection] in the Review workflow step",
      intent: "suggest",
    },
  },
  {
    id: "expert-alt-text",
    label: "Flag missing alt text",
    description: "Persistent agent that flags image elements before content reaches publish.",
    agentType: "expert",
    source: "built-in",
    expert: {
      goal: "Flag content with missing or inadequate alt text before it is ready to publish",
      trigger: "When an item moves to the Review workflow step",
      guardrails:
        "Only inspect Image elements; do not publish, unpublish, or change workflow steps; operate within the editor's permissions",
      escalation:
        "Add a comment on the item describing the issue and tag the item owner; do not modify content automatically",
    },
  },
  {
    id: "expert-metadata",
    label: "Check required metadata",
    description: "Ensures required SEO and metadata fields are filled before approval.",
    agentType: "expert",
    source: "built-in",
    expert: {
      goal: "Ensure required metadata and SEO fields are complete before content is approved",
      trigger: "When an item moves to the Ready to publish workflow step",
      guardrails:
        "Only review configured metadata elements on approved content types; never publish content or bypass approval",
      escalation:
        "List missing fields in a comment and return the item to the previous step if critical metadata is absent",
    },
  },
  {
    id: "expert-taxonomy",
    label: "Taxonomy consistency",
    description: "Checks that taxonomy assignments match content type and topic rules.",
    agentType: "expert",
    source: "built-in",
    expert: {
      goal: "Verify taxonomy assignments are consistent with content type and topic rules",
      trigger: "When an item is saved in the Draft or Review workflow step",
      guardrails:
        "Only suggest taxonomy changes; do not apply taxonomy terms without human approval; limit scope to [Taxonomy group]",
      escalation:
        "If taxonomy context is ambiguous, add a comment for the editor and take no automated action",
    },
  },
  {
    id: "expert-broken-links",
    label: "Review links on submit",
    description: "Flags broken or placeholder links when content is submitted for review.",
    agentType: "expert",
    source: "built-in",
    expert: {
      goal: "Identify broken, empty, or placeholder links before content proceeds in workflow",
      trigger: "When an item moves to the Review workflow step",
      guardrails:
        "Only analyze link and rich text elements; do not edit links directly; do not change workflow or publish",
      escalation:
        "Document each issue in a comment and notify the assigned contributor; skip items where links cannot be verified",
    },
  },
];
