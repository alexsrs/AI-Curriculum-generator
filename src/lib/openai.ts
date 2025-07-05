import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required but not defined in environment variables')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const AI_MODELS = {
  GPT_4: 'gpt-4',
  GPT_4_TURBO: 'gpt-4-turbo-preview',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
} as const

export const AI_CONFIG = {
  maxTokens: 1000,
  temperature: 0.7,
  defaultModel: AI_MODELS.GPT_3_5_TURBO,
} as const
