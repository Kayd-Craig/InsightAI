import { TypingAnimation } from './typing-animation'

export function TypingIndicator() {
  return (
    <div className="flex justify-start py-2">
      <div className="rounded-lg bg-muted/80 border border-border/50 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <TypingAnimation variant="dots" className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">
            AI is thinking...
          </span>
        </div>
      </div>
    </div>
  )
}
