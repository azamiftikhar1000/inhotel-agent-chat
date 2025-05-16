export const MODEL_OPTIONS = {
  openai: ['gpt-4', 'gpt-4.1', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-7-sonnet-20250219', 'claude-3-5-haiku-20241022'],
  google: ['gemini-pro', 'gemini-2.5-flash-preview', 'gemini-2.5-flash-preview-04-17'],
  cerebras: ['qwen-3-32b', 'llama-3.3-70b']
} as const;

export type ModelProvider = keyof typeof MODEL_OPTIONS;
export type ModelVersion<T extends ModelProvider> = typeof MODEL_OPTIONS[T][number]; 