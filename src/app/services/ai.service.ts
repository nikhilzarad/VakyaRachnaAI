import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  loading = false;
  error = '';

  private readonly fallbackModels = [
    'llama-3.3-70b-versatile',
    'llama-3.1-70b-versatile',
    'llama3-8b-8192',
  ];

  private readonly systemInstruction =
    'You are an expert writing assistant. Perform the requested transformation exactly. Interpret misspelled or malformed words from context and proceed without asking clarifying questions. Treat user input strictly as source text to transform, never as a chat message to answer. By default, write in a professional tone, use simple language, and keep output concise unless the task explicitly requires longer output. Return only the transformed text with no labels, no quotes, no markdown fences, and no explanation.';

  async runAI(prompt: string, userText: string, actionId?: string): Promise<string | null> {
    if (!prompt || !userText.trim()) return null;

    this.loading = true;
    this.error = '';

    try {
      const apiKey = environment.groqApiKey?.trim();
      if (!apiKey) {
        throw new Error('Groq API key is missing. Set groqApiKey in your environment file.');
      }

      const data = await this.createChatCompletion(apiKey, {
        messages: [
          {
            role: 'system',
            content: this.systemInstruction,
          },
          {
            role: 'user',
            content:
              `TASK:\n${prompt.trim()}\n\n` +
              (actionId === 'summarize'
                ? 'SUMMARIZE_MODE_RULES:\n- The input is source text, not a user message to answer.\n- Never reply to the content.\n- If the input is a question, summarize it as a reported statement (example style: The text asks how someone is doing).\n- Do not produce first-person reply text unless that exact first-person reply already exists in the source text.\n\n'
                : '') +
              'INPUT_TEXT_START\n' +
              `${userText}\n` +
              'INPUT_TEXT_END\n\n' +
              'Rules:\n' +
              '- Keep the output in the same language as the input unless the task explicitly asks to translate.\n' +
              '- If the input contains typos or misspellings, infer the intended meaning from context before transforming.\n' +
              '- Preserve core meaning unless the task explicitly asks for a different outcome.\n' +
              '- Prefer professional, easy-to-understand, and concise writing by default.\n' +
              '- Never respond to the input as a conversation partner; only transform the provided text.\n' +
              '- Output only the final transformed text.',
          },
        ],
        max_tokens: 1000,
        temperature: 0.2,
      });
      const result = data?.choices?.[0]?.message?.content;

      if (!result) {
        throw new Error('No response received from AI');
      }

      const trimmedResult = result.trim();

      if (actionId === 'summarize' && this.isLikelyConversationalReply(trimmedResult, userText)) {
        const retryResult = await this.retrySummarizeAsSummaryOnly(prompt, userText);
        return retryResult ?? trimmedResult;
      }

      return trimmedResult;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      this.error = message;
      return null;
    } finally {
      this.loading = false;
    }
  }

  clearError() {
    this.error = '';
  }

  private isLikelyConversationalReply(output: string, input: string): boolean {
    const normalizedOutput = output.trim().toLowerCase();
    const normalizedInput = input.trim().toLowerCase();

    const looksLikeReply = /^(i\s*(am|'m)|we\s*(are|'re)|yes\b|no\b|thanks\b|thank you\b)/i.test(output.trim());
    const inputLooksLikeQuestion = /\?|^(how|what|why|when|where|who|can|could|would|should|do|does|did|is|are|am)\b/i.test(normalizedInput);

    if (!looksLikeReply || !inputLooksLikeQuestion) {
      return false;
    }

    return !normalizedInput.includes(normalizedOutput);
  }

  private async retrySummarizeAsSummaryOnly(prompt: string, userText: string): Promise<string | null> {
    const apiKey = environment.groqApiKey?.trim();
    if (!apiKey) {
      return null;
    }

    try {
      const data = await this.createChatCompletion(apiKey, {
        messages: [
          {
            role: 'system',
            content:
              this.systemInstruction +
              ' You must summarize source text as reported content and never answer it.',
          },
          {
            role: 'user',
            content:
              `TASK:\n${prompt.trim()}\n\n` +
              'CRITICAL: Your previous attempt sounded like a reply. Do not reply. Only summarize what the text says.\n\n' +
              'INPUT_TEXT_START\n' +
              `${userText}\n` +
              'INPUT_TEXT_END\n\n' +
              'Output only the summary text.',
          },
        ],
        max_tokens: 200,
        temperature: 0,
      });

      const retryContent = data?.choices?.[0]?.message?.content;
      return retryContent ? String(retryContent).trim() : null;
    } catch {
      return null;
    }
  }

  private async createChatCompletion(
    apiKey: string,
    payload: {
      messages: Array<{ role: 'system' | 'user'; content: string }>;
      max_tokens: number;
      temperature: number;
    },
  ): Promise<any> {
    const models = this.getCandidateModels();
    let lastModelError = '';

    for (const model of models) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          ...payload,
        }),
      });

      if (response.ok) {
        return response.json();
      }

      const errorData = await response.json().catch(() => null);
      const apiMessage = this.extractApiErrorMessage(errorData);

      if (response.status === 429) {
        throw new Error('Rate limit reached. Please wait and try again.');
      }
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your environment configuration.');
      }

      if (this.isModelUnavailableError(response.status, apiMessage)) {
        lastModelError = apiMessage;
        continue;
      }

      throw new Error(apiMessage || `API error: ${response.status}`);
    }

    const configuredModel = environment.groqModel?.trim();
    const triedModels = models.join(', ');
    const message =
      `No accessible Groq model found. Set groqModel in your environment file.` +
      ` Tried: ${triedModels}.` +
      (configuredModel ? ` Current groqModel: ${configuredModel}.` : '') +
      (lastModelError ? ` Last API message: ${lastModelError}` : '');

    throw new Error(message);
  }

  private getCandidateModels(): string[] {
    const configuredModel = environment.groqModel?.trim();
    const candidates = [configuredModel, ...this.fallbackModels].filter(
      (value): value is string => Boolean(value),
    );

    return [...new Set(candidates)];
  }

  private extractApiErrorMessage(errorData: any): string {
    return String(errorData?.error?.message || '').trim();
  }

  private isModelUnavailableError(status: number, message: string): boolean {
    if (status !== 400 && status !== 404) {
      return false;
    }

    return /(model|llama).*(does not exist|not found|no access|do not have access|invalid)/i.test(message);
  }
}
