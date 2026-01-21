import OpenAI from "openai"

// Option 1: OpenRouter (Current - requires credits)
export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
})

// Option 2: Groq (Free tier - 14,400 requests/day)
export const groqClient = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})