import { setPopupSize } from "@kontent-ai/custom-app-sdk";
import { useEffect, useMemo, useState } from "react";
import { AgentTypeSelector } from "./components/AgentTypeSelector";
import { AikoForm } from "./components/AikoForm";
import { ExpertAgentForm } from "./components/ExpertAgentForm";
import { ExportActions } from "./components/ExportActions";
import { HowItWorks } from "./components/HowItWorks";
import { PresetPicker } from "./components/PresetPicker";
import { PromptHistory } from "./components/PromptHistory";
import { RefinementResults } from "./components/RefinementResults";
import { useAppConfig } from "./contexts/AppContext";
import { useProjectContentTypes } from "./hooks/useProjectContentTypes";
import { usePromptHistory } from "./hooks/usePromptHistory";
import { applyPreset, createEmptyFormData, getPresets } from "./services/presets/getPresets";
import { refinePrompt } from "./services/refinement/refinePrompt";
import type {
  AgentType,
  AikoFormData,
  ExpertAgentFormData,
  PromptHistoryEntry,
  RefinementChange,
} from "./types";

const FORM_ID = "prompt-builder-form";

function historyLabel(agentType: AgentType, data: AikoFormData | ExpertAgentFormData): string {
  if (agentType === "aiko") {
    const aiko = data as AikoFormData;
    return aiko.action || aiko.draft.slice(0, 60) || "Aiko prompt";
  }
  const expert = data as ExpertAgentFormData;
  return expert.goal || expert.draft.slice(0, 60) || "Expert Agent prompt";
}

export default function App() {
  const appConfig = useAppConfig();
  const { contentTypes: projectContentTypes } = useProjectContentTypes();
  const presets = useMemo(() => getPresets(appConfig), [appConfig]);
  const { entries, addEntry, removeEntry, clearHistory } = usePromptHistory();

  const [agentType, setAgentType] = useState<AgentType>("aiko");
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [aikoData, setAikoData] = useState<AikoFormData>(() => createEmptyFormData("aiko") as AikoFormData);
  const [expertData, setExpertData] = useState<ExpertAgentFormData>(
    () => createEmptyFormData("expert") as ExpertAgentFormData,
  );
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [changes, setChanges] = useState<RefinementChange[]>([]);
  const [hasResult, setHasResult] = useState(false);

  useEffect(() => {
    void setPopupSize({ unit: "px", value: 480 }, { unit: "px", value: 560 });
  }, []);

  const currentData = agentType === "aiko" ? aikoData : expertData;

  const resetForm = (nextAgentType: AgentType) => {
    setAikoData(createEmptyFormData("aiko") as AikoFormData);
    setExpertData(createEmptyFormData("expert") as ExpertAgentFormData);
    setSelectedPresetId("");
    setAgentType(nextAgentType);
    setHasResult(false);
    setRefinedPrompt("");
    setChanges([]);
  };

  const handleAgentTypeChange = (nextType: AgentType) => {
    if (nextType === agentType) {
      return;
    }
    resetForm(nextType);
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    setHasResult(false);
    setRefinedPrompt("");
    setChanges([]);

    if (!presetId) {
      if (agentType === "aiko") {
        setAikoData(createEmptyFormData("aiko") as AikoFormData);
      } else {
        setExpertData(createEmptyFormData("expert") as ExpertAgentFormData);
      }
      return;
    }

    const preset = presets.find((entry) => entry.id === presetId);
    if (!preset || preset.agentType !== agentType) {
      return;
    }

    const applied = applyPreset(preset);
    if (agentType === "aiko") {
      setAikoData(applied.aiko);
    } else {
      setExpertData(applied.expert);
    }
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
    setSelectedPresetId("");
    setRefinedPrompt(entry.refinedPrompt);
    setChanges([]);
    setHasResult(true);
  };

  const handleStartOver = () => {
    setHasResult(false);
    setRefinedPrompt("");
    setChanges([]);
    setSelectedPresetId("");
    if (agentType === "aiko") {
      setAikoData(createEmptyFormData("aiko") as AikoFormData);
    } else {
      setExpertData(createEmptyFormData("expert") as ExpertAgentFormData);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Prompt Builder</h1>
      </header>

      <div className="app-body">
        <HowItWorks />

        <PromptHistory
          entries={entries}
          onLoad={handleLoadHistory}
          onRemove={removeEntry}
          onClear={clearHistory}
        />

        {!hasResult ? (
          <form id={FORM_ID} className="stack" onSubmit={handleSubmit} noValidate>
            <AgentTypeSelector value={agentType} onChange={handleAgentTypeChange} />

            <PresetPicker
              agentType={agentType}
              presets={presets}
              projectContentTypes={projectContentTypes}
              selectedPresetId={selectedPresetId}
              onSelect={handlePresetSelect}
            />

            {agentType === "aiko" ? (
              <AikoForm data={aikoData} onChange={setAikoData} />
            ) : (
              <ExpertAgentForm data={expertData} onChange={setExpertData} />
            )}
          </form>
        ) : (
          <RefinementResults
            changes={changes}
            refinedPrompt={refinedPrompt}
            onPromptChange={setRefinedPrompt}
          />
        )}
      </div>

      <footer className="app-footer">
        {!hasResult ? (
          <button type="submit" form={FORM_ID} className="button green no-caps button-full">
            Refine prompt
          </button>
        ) : (
          <div className="footer-actions">
            <ExportActions
              agentType={agentType}
              content={refinedPrompt}
              disabled={refinedPrompt.trim().length === 0}
            />
            <button type="button" className="button secondary no-caps" onClick={handleStartOver}>
              New prompt
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
