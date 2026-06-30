export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type DeepSeekThinkingMode = {
  type: "enabled" | "disabled";
};

export type DeepSeekChatOptions = {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  timeoutMs?: number;
  thinking?: DeepSeekThinkingMode;
};

type DeepSeekChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

export class DeepSeekClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly temperature: number;
  private readonly timeoutMs: number;
  private readonly thinking: DeepSeekThinkingMode;

  constructor(options: DeepSeekChatOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? "https://api.deepseek.com";
    this.model = options.model ?? "deepseek-v4-flash";
    this.temperature = options.temperature ?? 0.2;
    this.timeoutMs = options.timeoutMs ?? 60000;
    this.thinking = options.thinking ?? { type: "disabled" };
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: this.temperature,
          thinking: this.thinking,
          stream: false
        }),
        signal: controller.signal
      });

      const payload = (await response.json().catch(() => ({}))) as DeepSeekChatResponse;
      if (!response.ok) {
        throw new Error(payload.error?.message ?? `DeepSeek API request failed with HTTP ${response.status}`);
      }

      const answer = payload.choices?.[0]?.message?.content?.trim();
      if (!answer) {
        throw new Error("DeepSeek API returned an empty answer.");
      }

      return answer;
    } finally {
      clearTimeout(timeout);
    }
  }
}

