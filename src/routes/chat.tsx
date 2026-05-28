import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Loader2, Send, Square, Bot, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({
    meta: [
      { title: "AI Chat — WorkSmart AI Assistant" },
      {
        name: "description",
        content:
          "Chat with WorkSmart AI for workplace productivity assistance.",
      },
    ],
  }),
});

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function useSimpleChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: text,
    };
    const assistantMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: "",
    };

    const updatedMessages = [...messages, userMsg];
    setMessages([...updatedMessages, assistantMsg]);
    setInput("");
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.text().catch(() => "Request failed");
        throw new Error(err);
      }

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, content: accumulated } : m,
          ),
        );
      }

      accumulated += decoder.decode();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id ? { ...m, content: accumulated } : m,
        ),
      );
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        // User stopped the stream
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? {
                  ...m,
                  content: `Error: ${(e as Error).message || "Something went wrong."}`,
                }
              : m,
          ),
        );
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const stop = () => {
    abortRef.current?.abort();
  };

  return { messages, input, setInput, sendMessage, isLoading, stop };
}

function ChatPage() {
  const { messages, input, setInput, sendMessage, isLoading, stop } =
    useSimpleChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -mx-6 -my-6">
      <div className="px-6 pt-6 pb-2 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">AI Chatbot</h1>
        <p className="text-muted-foreground">
          Ask WorkSmart AI anything about workplace productivity.
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">WorkSmart AI</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Your workplace productivity assistant. Ask about emails,
                meetings, tasks, research, writing, or any work challenge.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {[
                "Help me write a project update email",
                "Summarize these meeting notes",
                "Plan my day with these tasks",
                "Research the latest AI trends",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="px-3 py-1.5 rounded-full border bg-card text-sm hover:bg-accent transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {msg.role === "assistant" && (
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-xl px-4 py-3 text-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted",
              )}
            >
              {msg.content || (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
            {msg.role === "user" && (
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-1">
                <User className="h-4 w-4 text-accent-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t px-6 py-4 shrink-0">
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 max-w-3xl mx-auto"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask WorkSmart AI anything…"
            className="min-h-[52px] max-h-40 resize-none flex-1"
            rows={1}
          />
          {isLoading ? (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={stop}
              className="h-[52px] w-[52px] shrink-0"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim()}
              className="h-[52px] w-[52px] shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </form>
        <p className="text-center text-xs text-muted-foreground mt-2">
          AI-generated responses should be reviewed before use. Results may
          vary.
        </p>
      </div>
    </div>
  );
}
