import { mkdir, readFile, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";

export type BraiserSettings = {
  deepSeekApiKey?: string;
  deepSeekBaseUrl?: string;
  deepSeekModel?: string;
};

export type RunStatus = "created" | "preparing_prompt" | "calling_llm" | "saving_result" | "completed" | "failed";

export type RunMeta = {
  id: string;
  kind: "single_qa";
  question: string;
  status: RunStatus;
  createdAt: string;
  updatedAt: string;
  error?: string;
};

export type RunEvent = {
  at: string;
  type: string;
  message: string;
  data?: Record<string, unknown>;
};

export class FileStorage {
  private readonly rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  getRootDir(): string {
    return this.rootDir;
  }

  async ensureReady(): Promise<void> {
    await mkdir(path.join(this.rootDir, "runs"), { recursive: true });
  }

  async readSettings(): Promise<BraiserSettings> {
    await this.ensureReady();
    try {
      const content = await readFile(path.join(this.rootDir, "settings.json"), "utf8");
      return JSON.parse(content) as BraiserSettings;
    } catch (error) {
      if (isNodeError(error) && error.code === "ENOENT") {
        return {};
      }
      throw error;
    }
  }

  async writeSettings(settings: BraiserSettings): Promise<void> {
    await this.ensureReady();
    await writeJson(path.join(this.rootDir, "settings.json"), settings);
  }

  async createRun(meta: RunMeta): Promise<string> {
    const runDir = this.getRunDir(meta.id);
    await mkdir(runDir, { recursive: true });
    await writeJson(path.join(runDir, "meta.json"), meta);
    return runDir;
  }

  async updateRunMeta(meta: RunMeta): Promise<void> {
    await writeJson(path.join(this.getRunDir(meta.id), "meta.json"), meta);
  }

  async appendRunEvent(runId: string, event: RunEvent): Promise<void> {
    await appendFile(path.join(this.getRunDir(runId), "events.jsonl"), `${JSON.stringify(event)}\n`, "utf8");
  }

  async writeMessages(runId: string, messages: unknown): Promise<void> {
    await writeJson(path.join(this.getRunDir(runId), "messages.json"), messages);
  }

  async writeAnswer(runId: string, answer: string): Promise<void> {
    await writeFile(path.join(this.getRunDir(runId), "answer.txt"), answer, "utf8");
  }

  getRunDir(runId: string): string {
    return path.join(this.rootDir, "runs", runId);
  }
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
