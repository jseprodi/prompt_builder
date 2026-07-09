import type { CustomAppContext } from "@kontent-ai/custom-app-sdk";
import type { ProjectContentType } from "../../types/contentModel";

function collectContentTypeIds(context: CustomAppContext): string[] {
  const ids = new Set<string>();

  if ("contentTypeId" in context && context.contentTypeId) {
    ids.add(context.contentTypeId);
  }

  if ("itemListingFilter" in context) {
    for (const id of context.itemListingFilter.selectedContentTypes) {
      if (id) {
        ids.add(id);
      }
    }
  }

  if (
    context.currentPage === "contentTypeListing" &&
    "contentModelListingSelection" in context
  ) {
    for (const id of context.contentModelListingSelection.selectedIds) {
      if (id) {
        ids.add(id);
      }
    }
  }

  return [...ids];
}

export function extractContextContentTypes(context: CustomAppContext): ProjectContentType[] {
  return collectContentTypeIds(context).map((id) => ({
    id,
    codename: id,
    name: id,
  }));
}
