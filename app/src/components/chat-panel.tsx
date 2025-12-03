"use client";

import { MessageCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { OpenAIChatComponent } from "@/app/components/OpenAiChat";

interface ChatPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatPanel({ open, onOpenChange }: ChatPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg flex flex-col p-0"
      >
        <SheetHeader className="px-4 py-3 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <SheetTitle>AI Assistant</SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Chat with InsightAI to get insights about your social media
            analytics
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          <OpenAIChatComponent />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ChatToggleButton({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center text-white px-2"
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      <MessageCircle className="h-4 w-4" />
    </button>
  );
}
