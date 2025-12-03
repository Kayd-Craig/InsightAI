'use client'

import { useEffect } from 'react'
import { openaiApi, type ChatMessage } from '@/lib/openai-api'
import { Chat } from '@/components/ui/chat'
import { useSmoothTyping } from '@/hooks/use-smooth-typing'
import { UserSocialAnalytics } from '@/lib/userStats'
import { useChatStore, type Message } from '@/stores/chatStore'

export function OpenAIChatComponent() {
  const {
    messages,
    input,
    isGenerating,
    error,
    currentStreamingText,
    addMessage,
    updateLastMessage,
    setInput,
    setIsGenerating,
    setError,
    setCurrentStreamingText,
  } = useChatStore()

  const analytics = new UserSocialAnalytics('user123')

  const { displayedText } = useSmoothTyping({
    text: currentStreamingText,
    speed: 15,
  })

  useEffect(() => {
    if (isGenerating || displayedText) {
      updateLastMessage(displayedText)
    }
  }, [displayedText, isGenerating, updateLastMessage])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.()

    if (!input.trim() || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    addMessage(userMessage)
    setInput('')
    setIsGenerating(true)
    setError(null)

    try {
      const systemMessage: ChatMessage = {
        role: 'system',
        content: `You are InsightAI, a social media analytics assistant. Help users grow their social media presence with actionable insights.
        
Current user analytics:
${analytics.buildAPIMessage('')}

Focus on providing specific, actionable advice based on their data.`,
      }

      const chatMessages: ChatMessage[] = [
        systemMessage,
        ...messages.concat(userMessage).map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      ]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      }

      addMessage(assistantMessage)

      let fullResponse = ''
      setCurrentStreamingText('')

      // ← Updated to use OpenAI streaming
      for await (const chunk of openaiApi.generateContentStream(chatMessages, {
        maxTokens: 500,
        temperature: 0.7,
        model: 'gpt-4o-mini', // or 'gpt-4o' for better quality
      })) {
        if (chunk.error) {
          setError(chunk.error)
          break
        }

        if (chunk.text) {
          fullResponse += chunk.text
          setCurrentStreamingText(fullResponse)
        }

        if (chunk.isComplete) {
          updateLastMessage(fullResponse)
          break
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get response'
      setError(errorMessage)

      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Error: ${errorMessage}`,
      }
      addMessage(errorMsg)
    } finally {
      setIsGenerating(false)
    }
  }

  const stop = () => {
    setIsGenerating(false)
  }

  const append = async (message: { content: string }) => {
    setInput(message.content)
    await handleSubmit()
  }

  const chatMessages = messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    createdAt: new Date(),
  }))

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex-shrink-0'>
          <p className='text-sm'>{error}</p>
          <button
            onClick={() => setError(null)}
            className='text-red-500 hover:text-red-700 text-xs underline mt-1'
          >
            Dismiss
          </button>
        </div>
      )}

      <Chat
        messages={chatMessages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isGenerating={isGenerating}
        stop={stop}
        append={append}
        suggestions={[
          'Analyze my Instagram engagement patterns',
          'How can I improve my Twitter reach?',
          'What content performs best for my audience?',
          'Give me 5 content ideas based on my analytics',
        ]}
        className='flex-1 min-h-0 p-3'
      />
    </div>
  )
}
