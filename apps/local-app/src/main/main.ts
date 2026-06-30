import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { FileStorage, type BraiserSettings } from "@braiser/storage";
import { TaskAgent } from "./taskAgent.js";

const require = createRequire(import.meta.url);
const { app, BrowserWindow, ipcMain } = require("electron") as typeof import("electron");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = findWorkspaceRoot(process.cwd());
const electronProfileDir = path.join(workspaceRoot, ".braiser-electron-user-data");

configureElectronRuntime();

const storage = new FileStorage(resolveDataDir());
const taskAgent = new TaskAgent(storage);

function configureElectronRuntime(): void {
  mkdirSync(electronProfileDir, { recursive: true });
  logMain("configure electron runtime");

  app.setPath("userData", electronProfileDir);
  app.setPath("sessionData", electronProfileDir);
  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch("disable-gpu");
  app.commandLine.appendSwitch("disable-gpu-compositing");
  app.commandLine.appendSwitch("disable-gpu-sandbox");
  app.commandLine.appendSwitch("in-process-gpu");
}

async function createWindow(): Promise<void> {
  logMain("createWindow: ensure storage");
  await storage.ensureReady();
  logMain("createWindow: creating BrowserWindow");

  const mainWindow = new BrowserWindow({
    width: 1040,
    height: 760,
    minWidth: 860,
    minHeight: 620,
    title: "Braiser v0.1.0",
    backgroundColor: "#f6f4ef",
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.on("ready-to-show", () => {
    logMain("window ready-to-show");
    mainWindow.show();
    mainWindow.focus();
  });
  mainWindow.webContents.on("did-finish-load", () => logMain("window did-finish-load"));
  mainWindow.webContents.on("did-fail-load", (_event, code, description, url) => {
    logMain(`window did-fail-load code=${code} description=${description} url=${url}`);
  });
  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    logMain(`render-process-gone ${JSON.stringify(details)}`);
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    logMain(`loadURL ${process.env.VITE_DEV_SERVER_URL}`);
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else if (!app.isPackaged && process.env.NODE_ENV !== "production") {
    logMain("loadURL http://127.0.0.1:5173");
    await mainWindow.loadURL("http://127.0.0.1:5173");
  } else {
    const rendererFile = path.join(__dirname, "../renderer/index.html");
    logMain(`loadFile ${rendererFile}`);
    await mainWindow.loadFile(rendererFile);
  }
}

app.whenReady().then(async () => {
  logMain("app ready");
  registerIpcHandlers();
  await createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  logMain("window-all-closed");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function logMain(message: string): void {
  try {
    mkdirSync(electronProfileDir, { recursive: true });
    appendFileSync(path.join(electronProfileDir, "main.log"), `${new Date().toISOString()} ${message}\n`, "utf8");
  } catch {
    // Logging must never prevent app startup.
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle("settings:get", async () => getPublicSettings());
  ipcMain.handle("settings:save", async (_event, input: SaveSettingsInput) => saveSettings(input));
  ipcMain.handle("qa:ask", async (_event, question: string) => taskAgent.askSingleQuestion(question));
}

type SaveSettingsInput = {
  deepSeekApiKey?: string;
  deepSeekBaseUrl?: string;
  deepSeekModel?: string;
};

async function getPublicSettings(): Promise<PublicSettings> {
  const settings = await storage.readSettings();
  const envHasKey = Boolean(process.env.DEEPSEEK_API_KEY?.trim());
  return {
    deepSeekApiKeySet: envHasKey || Boolean(settings.deepSeekApiKey?.trim()),
    apiKeySource: envHasKey ? "environment" : settings.deepSeekApiKey?.trim() ? "settings" : "none",
    deepSeekBaseUrl: settings.deepSeekBaseUrl || "https://api.deepseek.com",
    deepSeekModel: settings.deepSeekModel || "deepseek-v4-flash",
    dataDir: storage.getRootDir()
  };
}

async function saveSettings(input: SaveSettingsInput): Promise<PublicSettings> {
  const current = await storage.readSettings();
  const next: BraiserSettings = {
    ...current,
    deepSeekBaseUrl: normalizeOptional(input.deepSeekBaseUrl) || "https://api.deepseek.com",
    deepSeekModel: normalizeOptional(input.deepSeekModel) || "deepseek-v4-flash"
  };

  const apiKey = normalizeOptional(input.deepSeekApiKey);
  if (apiKey) {
    next.deepSeekApiKey = apiKey;
  }

  await storage.writeSettings(next);
  return getPublicSettings();
}

function normalizeOptional(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

type PublicSettings = {
  deepSeekApiKeySet: boolean;
  apiKeySource: "environment" | "settings" | "none";
  deepSeekBaseUrl: string;
  deepSeekModel: string;
  dataDir: string;
};

function resolveDataDir(): string {
  if (process.env.BRAISER_DATA_DIR?.trim()) {
    return path.resolve(process.env.BRAISER_DATA_DIR.trim());
  }

  if (app.isPackaged) {
    return path.join(app.getPath("userData"), "braiser-data");
  }

  return path.join(workspaceRoot, "braiser-data");
}

function findWorkspaceRoot(startDir: string): string {
  let current = startDir;
  while (true) {
    const packageJson = path.join(current, "package.json");
    if (existsSync(packageJson) && packageName(packageJson) === "braiser-v2") {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return startDir;
    }
    current = parent;
  }
}

function packageName(packageJsonPath: string): string | undefined {
  try {
    const content = readFileSync(packageJsonPath, "utf8");
    const parsed = JSON.parse(content) as { name?: string };
    return parsed.name;
  } catch {
    return undefined;
  }
}










