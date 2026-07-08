import {
  type CustomAppContext,
  observeCustomAppContext,
} from "@kontent-ai/custom-app-sdk";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

interface UseCustomAppContextResult {
  readonly context: CustomAppContext | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

const useCustomAppContext = (): UseCustomAppContextResult => {
  const [context, setContext] = useState<CustomAppContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => Promise<void>) | null = null;

    const subscribe = async () => {
      const response = await observeCustomAppContext((updatedContext) => {
        setContext(updatedContext);
        setIsLoading(false);
      });

      if (response.isError) {
        setError(`${response.code}: ${response.description}`);
        setIsLoading(false);
        return;
      }

      setContext(response.context);
      setIsLoading(false);
      unsubscribe = response.unsubscribe;
    };

    void subscribe();

    return () => {
      if (unsubscribe !== null) {
        void unsubscribe();
      }
    };
  }, []);

  return { context, isLoading, error };
};

const AppContext = createContext<CustomAppContext | undefined>(undefined);

export function AppContextProvider(props: { readonly children: ReactNode }) {
  const { context, isLoading, error } = useCustomAppContext();

  if (isLoading) {
    return (
      <div className="center-screen" role="status" aria-live="polite">
        <div className="loader purple" aria-hidden="true" />
        <p>Loading Prompt Builder…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-screen section section-compact info red" role="alert">
        <h1 style={{ margin: 0, fontSize: "0.95rem" }}>Unable to load app context</h1>
        <p className="muted">{error}</p>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="center-screen section section-compact info red" role="alert">
        <h1 style={{ margin: 0, fontSize: "0.95rem" }}>Context unavailable</h1>
        <p className="muted">This app must run inside Kontent.ai.</p>
      </div>
    );
  }

  return <AppContext.Provider value={context}>{props.children}</AppContext.Provider>;
}

export function useAppContext(): CustomAppContext {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }

  return context;
}

export function useAppConfig() {
  return useAppContext().appConfig;
}
