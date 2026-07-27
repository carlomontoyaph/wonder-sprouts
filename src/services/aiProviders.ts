import { AiProvider } from '../types'

export interface AiProviderMeta {
  label: string
  defaultModel: string
  models: string[]
  keyPlaceholder: string
  keyPattern: RegExp
  keyHint: string
  keyUrl: string
  keyUrlLabel: string
  keySteps: string[]
  keyCost: string
}

export const AI_PROVIDER_META: Record<AiProvider, AiProviderMeta> = {
  anthropic: {
    label: 'Anthropic',
    defaultModel: 'claude-haiku-4-5-20251001',
    models: ['claude-haiku-4-5-20251001', 'claude-sonnet-4-6'],
    keyPlaceholder: 'sk-ant-...',
    keyPattern: /^sk-ant-[A-Za-z0-9_-]{20,}$/,
    keyHint: 'Get one at console.anthropic.com',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    keyUrlLabel: 'Open Anthropic Console',
    keySteps: [
      'Go to console.anthropic.com and sign in or create an account.',
      'Under Billing, add a payment method and a small credit ($5 is plenty).',
      'Open Settings, then API keys, and tap Create Key.',
      'Copy the key that starts with sk-ant- and paste it below.',
    ],
    keyCost: 'Pay-as-you-go, about 1¢ per quiz.',
  },
  openai: {
    label: 'OpenAI',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o'],
    keyPlaceholder: 'sk-...',
    keyPattern: /^sk-[A-Za-z0-9_-]{20,}$/,
    keyHint: 'Get one at platform.openai.com',
    keyUrl: 'https://platform.openai.com/api-keys',
    keyUrlLabel: 'Open OpenAI Platform',
    keySteps: [
      'Go to platform.openai.com and sign in.',
      'Under Billing, add prepaid credits ($5 is plenty).',
      'Open API keys and tap Create new secret key.',
      'Copy the key that starts with sk- and paste it below.',
    ],
    keyCost: 'Prepaid credits, about 1¢ per quiz.',
  },
  gemini: {
    label: 'Gemini',
    defaultModel: 'gemini-3.1-flash-lite',
    models: ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.6-flash'],
    keyPlaceholder: 'AIza...',
    keyPattern: /^(AIza[A-Za-z0-9_-]{30,}|AQ\.[A-Za-z0-9._-]{30,})$/,
    keyHint: 'Get one at aistudio.google.com',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    keyUrlLabel: 'Open Google AI Studio',
    keySteps: [
      'Go to aistudio.google.com/app/apikey and sign in with a Google account.',
      'Tap Create API key and pick a project (or let Google make one).',
      'Copy the key (usually starts with AIza or AQ.) and paste it below.',
    ],
    keyCost: 'Free tier available — no billing required for light use.',
  },
}
