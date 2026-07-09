import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import {
  fetchDeliveryContentTypes,
  mergeContentTypes,
} from "../services/contentModel/fetchContentTypes";
import { extractContextContentTypes } from "../services/contentModel/extractContextContentTypes";
import type { ProjectContentType, ProjectContentTypesState } from "../types/contentModel";

export function useProjectContentTypes(): ProjectContentTypesState {
  const context = useAppContext();
  const environmentId = context.environmentId;
  const contextTypes = useMemo(() => extractContextContentTypes(context), [context]);

  const [deliveryTypes, setDeliveryTypes] = useState<ProjectContentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<ProjectContentTypesState["source"]>("none");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);

      if (!environmentId) {
        if (!cancelled) {
          setDeliveryTypes([]);
          setSource(contextTypes.length > 0 ? "context" : "none");
          setIsLoading(false);
        }
        return;
      }

      const deliveryApiKey = import.meta.env.VITE_DELIVERY_API_KEY;
      const fetchedTypes = await fetchDeliveryContentTypes(environmentId, deliveryApiKey);

      if (cancelled) {
        return;
      }

      setDeliveryTypes(fetchedTypes);
      setSource(
        fetchedTypes.length > 0 ? "delivery-api" : contextTypes.length > 0 ? "context" : "none",
      );
      setIsLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [environmentId]);

  const contentTypes = useMemo(
    () => mergeContentTypes(deliveryTypes, contextTypes),
    [deliveryTypes, contextTypes],
  );

  const resolvedSource = useMemo((): ProjectContentTypesState["source"] => {
    if (deliveryTypes.length > 0) {
      return "delivery-api";
    }
    if (contextTypes.length > 0) {
      return "context";
    }
    return source;
  }, [deliveryTypes.length, contextTypes.length, source]);

  return {
    contentTypes,
    isLoading,
    source: resolvedSource,
  };
}
