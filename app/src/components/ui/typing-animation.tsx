'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TypingAnimationProps {
  className?: string
  variant?: 'dots' | 'text'
  text?: string
  duration?: number
  delay?: number
}

export function TypingAnimation({
  className,
  variant = 'dots',
  text = 'AI is thinking',
  duration = 100,
  delay = 0,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (variant === 'text') {
      let timeoutId: NodeJS.Timeout
      let currentIndex = 0
      const fullText = text

      const typeNextChar = () => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1))
          currentIndex++
          timeoutId = setTimeout(typeNextChar, duration)
        } else {
          // Reset and repeat
          setTimeout(() => {
            setDisplayedText('')
            currentIndex = 0
            typeNextChar()
          }, 1000)
        }
      }

      const startTimeout = setTimeout(() => {
        typeNextChar()
      }, delay)

      return () => {
        clearTimeout(startTimeout)
        if (timeoutId) clearTimeout(timeoutId)
      }
    }
  }, [variant, text, duration, delay])

  // Cursor blinking animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)

    return () => clearInterval(interval)
  }, [])

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <div className='flex items-center gap-1'>
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className='h-2 w-2 rounded-full bg-current'
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('inline-flex items-center', className)}>
      <span>{displayedText}</span>
      <AnimatePresence>
        {showCursor && (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0, 1] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className='ml-0.5 inline-block h-4 w-0.5 bg-current'
          />
        )}
      </AnimatePresence>
    </div>
  )
}
