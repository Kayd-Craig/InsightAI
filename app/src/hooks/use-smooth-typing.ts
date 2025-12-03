import { useState, useEffect, useRef } from 'react'

interface UseSmoothTypingProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export function useSmoothTyping({
  text,
  speed = 50,
  onComplete,
}: UseSmoothTypingProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentIndexRef = useRef(0)
  const targetTextRef = useRef('')
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    targetTextRef.current = text

    if (text.length < displayedText.length) {
      setDisplayedText(text)
      currentIndexRef.current = text.length
      setIsTyping(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    if (displayedText === text) {
      return
    }

    if (!isTyping && text.length > displayedText.length) {
      setIsTyping(true)
      currentIndexRef.current = displayedText.length
      startTypingAnimation()
    }
  }, [text, displayedText, isTyping])

  const startTypingAnimation = () => {
    const typeChunk = () => {
      const targetText = targetTextRef.current
      const currentIndex = currentIndexRef.current

      if (currentIndex >= targetText.length) {
        setIsTyping(false)
        if (onCompleteRef.current) {
          onCompleteRef.current()
        }
        return
      }

      const charsToType = Math.min(3, targetText.length - currentIndex)
      const newText = targetText.slice(0, currentIndex + charsToType)

      currentIndexRef.current = currentIndex + charsToType
      setDisplayedText(newText)

      if (currentIndex + charsToType < targetText.length) {
        timeoutRef.current = setTimeout(typeChunk, speed)
      } else {
        setIsTyping(false)
        if (onCompleteRef.current) {
          onCompleteRef.current()
        }
      }
    }

    typeChunk()
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    displayedText,
    isTyping,
  }
}
