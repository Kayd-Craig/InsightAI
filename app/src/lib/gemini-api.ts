import { useState } from 'react'
import { GoogleGenAI } from '@google/genai'

interface GeminiMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface StreamResponse {
  text: string
  isComplete: boolean
  error?: string
}

export class GeminiAPI {
  private client: GoogleGenAI

  constructor() {
    const key = process.env.NEXT_PUBLIC_GEMINI_KEY
    if (!key) {
      throw new Error('Gemini API key is required')
    }
    this.client = new GoogleGenAI({ apiKey: key })
  }

  private formatMessagesAsText(messages: GeminiMessage[]): string {
    if (messages.length === 1) {
      return messages[0].content
    }

    return messages
      .map((msg) => {
        const role = msg.role === 'assistant' ? 'Assistant' : 'User'
        return `${role}: ${msg.content}`
      })
      .join('\n\n')
  }

  async generateContent(
    messages: GeminiMessage[],
    options?: {
      temperature?: number
      topP?: number
      topK?: number
      maxOutputTokens?: number
    }
  ): Promise<string> {
    try {
      const conversationText = this.formatMessagesAsText(messages)

      const response = await this.client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: conversationText }],
          },
        ],
        config: {
          temperature: options?.temperature,
          topP: options?.topP,
          topK: options?.topK,
          maxOutputTokens: 1000,
        },
      })

      if (!response || !response.text) {
        throw new Error('No response generated from Gemini API')
      }

      return response.text
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      throw error
    }
  }

  async *generateContentStream(
    messages: GeminiMessage[],
    options?: {
      temperature?: number
      topP?: number
      topK?: number
      maxOutputTokens?: number
    }
  ): AsyncGenerator<StreamResponse> {
    try {
      const conversationText = this.formatMessagesAsText(messages)

      const stream = await this.client.models.generateContentStream({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: conversationText }],
          },
        ],
        config: {
          temperature: options?.temperature,
          topP: options?.topP,
          topK: options?.topK,
          maxOutputTokens: options?.maxOutputTokens,
        },
      })

      for await (const chunk of stream) {
        if (chunk.text) {
          yield {
            text: chunk.text,
            isComplete: false,
          }
        }
      }

      yield { text: '', isComplete: true }
    } catch (error) {
      console.error('Error in streaming:', error)
      yield {
        text: '',
        isComplete: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

export const geminiApi = new GeminiAPI()

export function useGeminiChat() {
  const [messages, setMessages] = useState<GeminiMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (content: string, useStreaming = false) => {
    const userMessage: GeminiMessage = { role: 'user', content }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      if (useStreaming) {
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

        let assistantContent = ''
        for await (const chunk of geminiApi.generateContentStream([
          ...messages,
          userMessage,
        ])) {
          if (chunk.error) {
            setError(chunk.error)
            break
          }

          if (chunk.text) {
            assistantContent += chunk.text
            setMessages((prev) => {
              const newMessages = [...prev]
              newMessages[newMessages.length - 1].content = assistantContent
              return newMessages
            })
          }

          if (chunk.isComplete) {
            break
          }
        }
      } else {
        const response = await geminiApi.generateContent([
          ...messages,
          userMessage,
        ])
        const assistantMessage: GeminiMessage = {
          role: 'assistant',
          content: response,
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
    setError(null)
  }

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}
