// Mock implementation of Spark SDK for local development
// This allows the app to run without the actual Spark/Bolt environment

interface SparkKV {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: any): Promise<void>
}

interface SparkLLM {
  (prompt: string, model: string, json?: boolean): Promise<string>
}

interface SparkLLMPrompt {
  (strings: TemplateStringsArray, ...values: any[]): string
}

interface Spark {
  kv: SparkKV
  llm: SparkLLM
  llmPrompt: SparkLLMPrompt
}

// In-memory storage for KV
const kvStorage = new Map<string, any>()

// Mock KV implementation
const mockKV: SparkKV = {
  async get<T>(key: string): Promise<T | null> {
    const value = kvStorage.get(key)
    return value !== undefined ? value : null
  },
  
  async set(key: string, value: any): Promise<void> {
    kvStorage.set(key, value)
  }
}

// Mock LLM implementation (returns generic responses)
const mockLLM: SparkLLM = async (prompt: string, model: string, json?: boolean): Promise<string> => {
  console.log('[Mock LLM] Request:', { prompt: prompt.substring(0, 100) + '...', model, json })
  
  // Return mock responses based on prompt content
  if (json) {
    return JSON.stringify({
      success: true,
      message: 'Mock LLM response (JSON mode)',
      data: {}
    })
  }
  
  return 'This is a mock LLM response. The Spark SDK is not available in local development.'
}

// Mock LLM Prompt template function
const mockLLMPrompt: SparkLLMPrompt = (strings: TemplateStringsArray, ...values: any[]): string => {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] !== undefined ? String(values[i]) : '')
  }, '')
}

// Initialize mock Spark SDK
export function initializeSparkMock() {
  if (typeof window !== 'undefined' && !window.spark) {
    (window as any).spark = {
      kv: mockKV,
      llm: mockLLM,
      llmPrompt: mockLLMPrompt
    } as Spark
    
    console.log('[Spark Mock] Initialized mock Spark SDK for local development')
  }
}

// Auto-initialize when imported
initializeSparkMock()

// DON'T define BASE_KV_SERVICE_URL - this forces the app to use our mock KV
// If needed, components should use window.spark.kv directly
