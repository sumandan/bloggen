interface AIModel {
  id: string;
  developer: string;
  contextWindow?: number;
  maxOutputTokens?: number;
  maxFileSize?: string;
  deprecated?: boolean;
}

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'distil-whisper-large-v3-en',
    developer: 'HuggingFace',
    maxFileSize: '25 MB'
  },
  {
    id: 'gemma2-9b-it',
    developer: 'Google',
    contextWindow: 8192
  },
  {
    id: 'gemma-7b-it',
    developer: 'Google',
    contextWindow: 8192,
    deprecated: true
  },
  {
    id: 'llama-3.3-70b-versatile',
    developer: 'Meta',
    contextWindow: 128000,
    maxOutputTokens: 32768
  },
  {
    id: 'llama-3.1-70b-versatile',
    developer: 'Meta',
    contextWindow: 128000,
    maxOutputTokens: 32768,
    deprecated: true
  },
  {
    id: 'llama-3.1-8b-instant',
    developer: 'Meta',
    contextWindow: 128000,
    maxOutputTokens: 8192
  },
  {
    id: 'llama-guard-3-8b',
    developer: 'Meta',
    contextWindow: 8192
  },
  {
    id: 'llama3-70b-8192',
    developer: 'Meta',
    contextWindow: 8192
  },
  {
    id: 'llama3-8b-8192',
    developer: 'Meta',
    contextWindow: 8192
  },
  {
    id: 'mixtral-8x7b-32768',
    developer: 'Mistral',
    contextWindow: 32768
  },
  {
    id: 'whisper-large-v3',
    developer: 'OpenAI',
    maxFileSize: '25 MB'
  },
  {
    id: 'whisper-large-v3-turbo',
    developer: 'OpenAI',
    maxFileSize: '25 MB'
  }
];