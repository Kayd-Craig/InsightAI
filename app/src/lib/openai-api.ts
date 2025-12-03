export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface StreamChunk {
  text?: string
  error?: string
  isComplete?: boolean
}

export class OpenAIChatAPI {
  async *generateContentStream(
    messages: ChatMessage[],
    options: {
      maxTokens?: number
      model?: string
      temperature?: number
    } = {}
  ): AsyncGenerator<StreamChunk, void, unknown> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          options,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim() !== '')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              yield data as StreamChunk
              
              if (data.isComplete) {
                return
              }
            } catch (e) {
              console.error('Error parsing chunk:', e)
            }
          }
        }
      }
    } catch (error) {
      yield {
        error: error instanceof Error ? error.message : 'Network error',
        isComplete: true,
      }
    }
  }

  // Non-streaming version
  async generateContent(
    messages: ChatMessage[],
    options: {
      maxTokens?: number
      model?: string
      temperature?: number
    } = {}
  ): Promise<string> {
    let fullResponse = ''
    
    for await (const chunk of this.generateContentStream(messages, options)) {
      if (chunk.error) {
        throw new Error(chunk.error)
      }
      if (chunk.text) {
        fullResponse += chunk.text
      }
      if (chunk.isComplete) {
        break
      }
    }
    
    return fullResponse
  }
}

export const openaiApi = new OpenAIChatAPI()