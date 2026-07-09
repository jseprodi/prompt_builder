import type { CustomAppContext } from "@kontent-ai/custom-app-sdk";
import type { ProjectContentType } from "../../types/contentModel";
import { extractContextContentTypes } from "./extractContextContentTypes";

interface DeliveryTypeResponse {
  readonly types?: ReadonlyArray<{
    readonly system?: {
      readonly id?: string;
      readonly codename?: string;
      readonly name?: string;
    };
  }>;
}

function parseDeliveryTypes(payload: DeliveryTypeResponse): ProjectContentType[] {
  if (!Array.isArray(payload.types)) {
    return [];
  }

  return payload.types
    .map((entry) => {
      const system = entry.system;
      if (!system?.id || !system.codename || !system.name) {
        return null;
      }

      return {
        id: system.id,
        codename: system.codename,
        name: system.name,
      };
    })
    .filter((entry): entry is ProjectContentType => entry !== null);
}

function mergeContentTypes(
  primary: ReadonlyArray<ProjectContentType>,
  secondary: ReadonlyArray<ProjectContentType>,
): ProjectContentType[] {
  const byId = new Map<string, ProjectContentType>();

  for (const entry of [...secondary, ...primary]) {
    byId.set(entry.id.toLowerCase(), entry);
  }

  return [...byId.values()].sort((left, right) => left.name.localeCompare(right.name));
}

async function fetchDeliveryContentTypes(
  environmentId: string,
  deliveryApiKey?: string,
): Promise<ProjectContentType[]> {
  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (deliveryApiKey) {
    headers.Authorization = `Bearer ${deliveryApiKey}`;
  }

  const response = await fetch(`https://deliver.kontent.ai/${environmentId}/types`, {
    headers,
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as DeliveryTypeResponse;
  return parseDeliveryTypes(payload);
}

export async function fetchProjectContentTypes(
  context: CustomAppContext,
  deliveryApiKey?: string,
): Promise<{ contentTypes: ProjectContentType[]; source: "delivery-api" | "context" | "none" }> {
  const contextTypes = extractContextContentTypes(context);
  const environmentId = context.environmentId;

  if (!environmentId) {
    return {
      contentTypes: contextTypes,
      source: contextTypes.length > 0 ? "context" : "none",
    };
  }

  try {
    const deliveryTypes = await fetchDeliveryContentTypes(environmentId, deliveryApiKey);

    if (deliveryTypes.length === 0) {
      return {
        contentTypes: contextTypes,
        source: contextTypes.length > 0 ? "context" : "none",
      };
    }

    return {
      contentTypes: mergeContentTypes(deliveryTypes, contextTypes),
      source: "delivery-api",
    };
  } catch {
    return {
      contentTypes: contextTypes,
      source: contextTypes.length > 0 ? "context" : "none",
    };
  }
}

export { mergeContentTypes, fetchDeliveryContentTypes };
