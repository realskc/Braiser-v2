import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Settings = Awaited<ReturnType<typeof window.braiser.getSettings>>;
type AskResult = Awaited<ReturnType<typeof window.braiser.askQuestion>>;

type Status = "idle" | "loading" | "saving" | "asking" | "error";

function App(): React.ReactElement {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://api.deepseek.com");
  const [model, setModel] = useState("deepseek-v4-flash");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResult | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadSettings();
  }, []);

  const keyLabel = useMemo(() => {
    if (!settings?.deepSeekApiKeySet) {
      return "No key configured";
    }
    return settings.apiKeySource === "environment" ? "Using DEEPSEEK_API_KEY" : "Using saved key";
  }, [settings]);

  async function loadSettings(): Promise<void> {
    try {
      setStatus("loading");
      const next = await window.braiser.getSettings();
      setSettings(next);
      setBaseUrl(next.deepSeekBaseUrl);
      setModel(next.deepSeekModel);
      setError(null);
      setStatus("idle");
    } catch (cause) {
      setError(formatError(cause));
      setStatus("error");
    }
  }

  async function handleSaveSettings(event: FormEvent): Promise<void> {
    event.preventDefault();
    try {
      setStatus("saving");
      const next = await window.braiser.saveSettings({
        deepSeekApiKey: apiKey,
        deepSeekBaseUrl: baseUrl,
        deepSeekModel: model
      });
      setSettings(next);
      setApiKey("");
      setError(null);
      setStatus("idle");
    } catch (cause) {
      setError(formatError(cause));
      setStatus("error");
    }
  }

  async function handleAsk(event: FormEvent): Promise<void> {
    event.preventDefault();
    try {
      setStatus("asking");
      setError(null);
      setResult(null);
      const answer = await window.braiser.askQuestion(question);
      setResult(answer);
      setStatus("idle");
    } catch (cause) {
      setError(formatError(cause));
      setStatus("error");
    }
  }

  const busy = status === "loading" || status === "saving" || status === "asking";

  return (
    <main className="shell">
      <section className="topbar" aria-label="Braiser status">
        <div>
          <p className="eyebrow">Braiser v0.1.0</p>
          <h1>Local DeepSeek Q&A</h1>
        </div>
        <div className="statusPill" data-ready={settings?.deepSeekApiKeySet ? "true" : "false"}>
          <span aria-hidden="true" />
          {keyLabel}
        </div>
      </section>

      <section className="workspace">
        <form className="settingsPane" onSubmit={(event) => void handleSaveSettings(event)}>
          <div className="paneHeader">
            <h2>Settings</h2>
            <p>{settings?.dataDir ?? "Loading data directory..."}</p>
          </div>

          <label>
            <span>DeepSeek API key</span>
            <input
              type="password"
              value={apiKey}
              placeholder={settings?.deepSeekApiKeySet ? "Leave blank to keep current key" : "sk-..."}
              onChange={(event) => setApiKey(event.target.value)}
              autoComplete="off"
            />
          </label>

          <label>
            <span>Base URL</span>
            <input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} />
          </label>

          <label>
            <span>Model</span>
            <input value={model} onChange={(event) => setModel(event.target.value)} />
          </label>

          <button type="submit" disabled={busy}>
            {status === "saving" ? "Saving..." : "Save settings"}
          </button>
        </form>

        <section className="qaPane">
          <form className="questionForm" onSubmit={(event) => void handleAsk(event)}>
            <label>
              <span>Question</span>
              <textarea
                value={question}
                placeholder="Ask a single ordinary question..."
                onChange={(event) => setQuestion(event.target.value)}
                disabled={busy}
              />
            </label>
            <button type="submit" disabled={busy || !question.trim()}>
              {status === "asking" ? "Asking..." : "Ask DeepSeek"}
            </button>
          </form>

          {error ? <div className="errorBox">{error}</div> : null}

          <div className="answerBox" aria-live="polite">
            {result ? (
              <>
                <div className="answerMeta">
                  <span>{result.runId}</span>
                  <span>{result.runDir}</span>
                </div>
                <article>{result.answer}</article>
              </>
            ) : (
              <div className="emptyState">Your answer will appear here after one DeepSeek call.</div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function formatError(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message;
  }
  return String(cause);
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);


