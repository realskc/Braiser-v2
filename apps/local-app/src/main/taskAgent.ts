import { randomUUID } from "node:crypto";
import { DeepSeekClient, type ChatMessage } from "@braiser/llm";
import { FileStorage, type BraiserSettings, type RunMeta, type RunStatus } from "@braiser/storage";

export type AskQuestionResult = {
  runId: string;
  runDir: string;
  answer: string;
};

type ChatClient = {
  chat(messages: ChatMessage[]): Promise<string>;
};

type CreateChatClient = (options: {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}) => ChatClient;

export class TaskAgent {
  private readonly storage: FileStorage;
  private readonly createChatClient: CreateChatClient;

  constructor(storage: FileStorage, createChatClient: CreateChatClient = (options) => new DeepSeekClient(options)) {
    this.storage = storage;
    this.createChatClient = createChatClient;
  }

  async askSingleQuestion(question: string): Promise<AskQuestionResult> {
    const normalizedQuestion = question.trim();
    if (!normalizedQuestion) {
      throw new Error("Please enter a question first.");
    }

    const now = new Date().toISOString();
    const meta: RunMeta = {
      id: createRunId(),
      kind: "single_qa",
      question: normalizedQuestion,
      status: "created",
      createdAt: now,
      updatedAt: now
    };

    const runDir = await this.storage.createRun(meta);
    await this.event(meta.id, "run_created", "Single-question run created.", {
      questionLength: normalizedQuestion.length
    });

    try {
      const settings = await this.storage.readSettings();
      const apiKey = resolveApiKey(settings);
      if (!apiKey) {
        throw new Error("DeepSeek API key is missing. Set DEEPSEEK_API_KEY or save one in settings.");
      }

      const messages = buildSingleQuestionMessages(normalizedQuestion);
      await this.updateStatus(meta, "preparing_prompt");
      await this.event(meta.id, "prompt_prepared", "Single-turn prompt prepared.", {
        messageCount: messages.length
      });

      await this.updateStatus(meta, "calling_llm");
      await this.event(meta.id, "llm_call_started", "Calling DeepSeek API.", {
        model: settings.deepSeekModel || "deepseek-v4-flash",
        baseUrl: settings.deepSeekBaseUrl || "https://api.deepseek.com"
      });

      const client = this.createChatClient({
        apiKey,
        baseUrl: settings.deepSeekBaseUrl,
        model: settings.deepSeekModel
      });
      const answer = await client.chat(messages);

      await this.updateStatus(meta, "saving_result");
      await this.storage.writeAnswer(meta.id, answer);
      await this.storage.writeMessages(meta.id, [...messages, { role: "assistant", content: answer }]);
      await this.event(meta.id, "answer_saved", "Answer and message record saved.", {
        answerLength: answer.length
      });

      await this.updateStatus(meta, "completed");
      await this.event(meta.id, "run_completed", "Single-question run completed.");

      return { runId: meta.id, runDir, answer };
    } catch (error) {
      const message = sanitizeErrorMessage(error);
      meta.error = message;
      await this.updateStatus(meta, "failed");
      await this.event(meta.id, "run_failed", "Single-question run failed.", { error: message });
      throw new Error(message);
    }
  }

  private async updateStatus(meta: RunMeta, status: RunStatus): Promise<void> {
    meta.status = status;
    meta.updatedAt = new Date().toISOString();
    await this.storage.updateRunMeta(meta);
  }

  private async event(runId: string, type: string, message: string, data?: Record<string, unknown>): Promise<void> {
    await this.storage.appendRunEvent(runId, {
      at: new Date().toISOString(),
      type,
      message,
      data
    });
  }
}

function buildSingleQuestionMessages(question: string): ChatMessage[] {
  return [
    {
      role: "system",
      content: "You are Braiser v0.1.0, a concise local assistant. Answer the user's single question directly. Do not assume browser access, tools, or conversation history."
    },
    {
      role: "user",
      content: question
    }
  ];
}

function resolveApiKey(settings: BraiserSettings): string | undefined {
  return process.env.DEEPSEEK_API_KEY?.trim() || settings.deepSeekApiKey?.trim() || undefined;
}

function sanitizeErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/Bearer\s+[A-Za-z0-9._\-]+/gi, "Bearer [redacted]");
}

function createRunId(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${stamp}-${randomUUID().slice(0, 8)}`;
}




