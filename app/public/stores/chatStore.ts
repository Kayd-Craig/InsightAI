import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatState {
  messages: Message[]
  input: string
  isGenerating: boolean
  error: string | null
  currentStreamingText: string

  // Actions
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  updateLastMessage: (content: string) => void
  setInput: (input: string) => void
  setIsGenerating: (isGenerating: boolean) => void
  setError: (error: string | null) => void
  setCurrentStreamingText: (text: string) => void
  clearMessages: () => void
  reset: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  input: '',
  isGenerating: false,
  error: null,
  currentStreamingText: '',

  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (content) =>
    set((state) => {
      const newMessages = [...state.messages]
      const lastMessage = newMessages[newMessages.length - 1]
      if (lastMessage && lastMessage.role === 'assistant') {
        newMessages[newMessages.length - 1] = {
          ...lastMessage,
          content,
        }
      }
      return { messages: newMessages }
    }),
  setInput: (input) => set({ input }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  setCurrentStreamingText: (text) => set({ currentStreamingText: text }),
  clearMessages: () => set({ messages: [] }),
  reset: () =>
    set({
      messages: [],
      input: '',
      isGenerating: false,
      error: null,
      currentStreamingText: '',
    }),
}))
