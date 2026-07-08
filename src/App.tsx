import { setPopupSize } from "@kontent-ai/custom-app-sdk";
import { useEffect, useState } from "react";
import { AgentTypeSelector } from "./components/AgentTypeSelector";
import { AikoForm } from "./components/AikoForm";
import { ExpertAgentForm } from "./components/ExpertAgentForm";
import { ExportActions } from "./components/ExportActions";
import { HowItWorks } from "./components/HowItWorks";
import { PromptHistory } from "./components/PromptHistory";
import { RefinementResults } from "./components/RefinementResults";
import { usePromptHistory } from "./hooks/usePromptHistory";
import { refinePrompt } from "./services/refinement/refinePrompt";
import type {
  AgentType,
  AikoFormData,
  ExpertAgentFormData,
  PromptHistoryEntry,
  RefinementChange,
} from "./types";
import "./App.css";

const EMPTY_AIKO: AikoFormData = {
  action: "",
  contentScope: "",
  intent: "",
  draft: "",
};

const EMPTY_EXPERT: ExpertAgentFormData = {
  goal: "",
  trigger: "",
  guardrails: "",
  escalation: "",
  draft: "",
};

function historyLabel(agentType: AgentType, data: AikoFormData | ExpertAgentFormData): string {
  if (agentType === "aiko") {
    const aiko = data as AikoFormData;
    return aiko.action || aiko.draft.slice(0, 60) || "Aiko prompt";
  }
  const expert = data as ExpertAgentFormData;
  return expert.goal || expert.draft.slice(0, 60) || "Expert Agent prompt";
}

export default function App() {
  const { entries, addEntry, removeEntry, clearHistory } = usePromptHistory();

  const [agentType, setAgentType] = useState<AgentType>("aiko");
  const [aikoData, setAikoData] = useState<AikoFormData>(EMPTY_AIKO);
  const [expertData, setExpertData] = useState<ExpertAgentFormData>(EMPTY_EXPERT);
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [changes, setChanges] = useState<RefinementChange[]>([]);
  const [hasResult, setHasResult] = useState(false);

  useEffect(() => {
    void setPopupSize({ unit: "px", value: 960 }, { unit: "px", value: 720 });
  }, []);

  const currentData = agentType === "aiko" ? aikoData : expertData;

  const handleAgentTypeChange = (nextType: AgentType) => {
    setAgentType(nextType);
    setHasResult(false);
    setRefinedPrompt("");
    setChanges([]);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = refinePrompt(agentType, currentData);
    setRefinedPrompt(result.refinedPrompt);
    setChanges(result.changes);
    setHasResult(true);
    addEntry(agentType, result.refinedPrompt, historyLabel(agentType, currentData));
  };

  const handleLoadHistory = (entry: PromptHistoryEntry) => {
    setAgentType(entry.agentType);
    setRefinedPrompt(entry.refinedPrompt);
    setChanges([]);
    setHasResult(true);
  };

  const handleStartOver = () => {
    setHasResult(false);
    setRefinedPrompt("");
    setChanges([]);
    if (agentType === "aiko") {
      setAikoData(EMPTY_AIKO);
    } else {
      setExpertData(EMPTY_EXPERT);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Prompt Builder</h1>
          <p className="app-subtitle">
            Write and refine prompts for Aiko and Expert Agents — then export to paste into Kontent.ai.
          </p>
        </div>
      </header>

      <HowItWorks />

      <PromptHistory
        entries={entries}
        onLoad={handleLoadHistory}
        onRemove={removeEntry}
        onClear={clearHistory}
      />

      {!hasResult ? (
        <form className="builder-form" onSubmit={handleSubmit} noValidate>
          <AgentTypeSelector value={agentType} onChange={handleAgentTypeChange} />

          {agentType === "aiko" ? (
            <AikoForm data={aikoData} onChange={setAikoData} />
          ) : (
            <ExpertAgentForm data={expertData} onChange={setExpertData} />
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Refine prompt
            </button>
          </div>
        </form>
      ) : (
        <div className="results-view">
          <RefinementResults
            changes={changes}
            refinedPrompt={refinedPrompt}
            onPromptChange={setRefinedPrompt}
          />

          <ExportActions
            agentType={agentType}
            content={refinedPrompt}
            disabled={refinedPrompt.trim().length === 0}
          />

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleStartOver}>
              Start a new prompt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
