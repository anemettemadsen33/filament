/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

declare global {
  interface Window {
    spark: {
      llmPrompt: (strings: any, ...values: any[]) => string
      llm(prompt: string, modelName?: string, jsonMode?: boolean): Promise<string>
      user(): Promise<{
        id: number
        login: string
        email: string
        avatarUrl: string
        isOwner: boolean
      }>
      kv: {
        keys(): Promise<string[]>
        get<T>(key: string): Promise<T | undefined>
        set<T>(key: string, value: T): Promise<void>
        delete(key: string): Promise<void>
      }
    }
  }
}