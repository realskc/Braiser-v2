import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { contextBridge, ipcRenderer } = require("electron") as typeof import("electron");

export type PublicSettings = {
  deepSeekApiKeySet: boolean;
  apiKeySource: "environment" | "settings" | "none";
  deepSeekBaseUrl: string;
  deepSeekModel: string;
  dataDir: string;
};

export type SaveSettingsInput = {
  deepSeekApiKey?: string;
  deepSeekBaseUrl?: string;
  deepSeekModel?: string;
};

export type AskQuestionResult = {
  runId: string;
  runDir: string;
  answer: string;
};

export type BraiserApi = {
  getSettings(): Promise<PublicSettings>;
  saveSettings(input: SaveSettingsInput): Promise<PublicSettings>;
  askQuestion(question: string): Promise<AskQuestionResult>;
};

const api: BraiserApi = {
  getSettings: () => ipcRenderer.invoke("settings:get") as Promise<PublicSettings>,
  saveSettings: (input) => ipcRenderer.invoke("settings:save", input) as Promise<PublicSettings>,
  askQuestion: (question) => ipcRenderer.invoke("qa:ask", question) as Promise<AskQuestionResult>
};

contextBridge.exposeInMainWorld("braiser", api);


