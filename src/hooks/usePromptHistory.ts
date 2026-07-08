import { useCallback, useEffect, useState } from "react";
import type { AgentType, PromptHistoryEntry } from "../types";

const STORAGE_KEY = "kontent-prompt-builder-history";
const MAX_ENTRIES = 10;

function loadHistory(): PromptHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as PromptHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: PromptHistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

export function usePromptHistory() {
  const [entries, setEntries] = useState<PromptHistoryEntry[]>([]);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const addEntry = useCallback(
    (agentType: AgentType, refinedPrompt: string, label: string) => {
      const entry: PromptHistoryEntry = {
        id: crypto.randomUUID(),
        agentType,
        refinedPrompt,
        createdAt: new Date().toISOString(),
        label,
      };

      setEntries((current) => {
        const next = [entry, ...current].slice(0, MAX_ENTRIES);
        saveHistory(next);
        return next;
      });
    },
    [],
  );

  const removeEntry = useCallback((id: string) => {
    setEntries((current) => {
      const next = current.filter((entry) => entry.id !== id);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setEntries([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { entries, addEntry, removeEntry, clearHistory };
}
