"use client";

import { useState } from "react";
import { ChatPanel, ChatToggleButton } from "@/components/chat-panel";

export function DashboardChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {children}
      <ChatPanel open={isChatOpen} onOpenChange={setIsChatOpen} />
    </>
  );
}

export function ChatToggle() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <ChatToggleButton
        onClick={() => setIsChatOpen(!isChatOpen)}
        isOpen={isChatOpen}
      />
      <ChatPanel open={isChatOpen} onOpenChange={setIsChatOpen} />
    </>
  );
}
