import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, FileDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { generateTravelPDF, extractDestination } from "@/utils/pdfGenerator";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const quickQuestions = [
  "What are the best beaches to visit?",
  "Plan a 5-day trip to Paris for me",
  "What should I pack for a tropical vacation?",
  "Best budget-friendly destinations in Europe?",
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! 👋 I'm your AI travel assistant. How can I help you plan your perfect adventure today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare messages for API (exclude welcome message and format for API)
      const apiMessages = [...messages, userMessage]
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages: apiMessages },
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to get response");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get response";
      
      if (errorMessage.includes("Rate limit")) {
        toast.error("Too many requests. Please wait a moment and try again.");
      } else if (errorMessage.includes("credits")) {
        toast.error("AI credits exhausted. Please add credits to continue.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      // Add error message to chat
      const errorAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I couldn't process your request right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate and download PDF from conversation
   */
  const handleGeneratePdf = async () => {
    if (messages.length <= 1) {
      toast.error("Please have a conversation first before generating a PDF.");
      return;
    }

    setIsGeneratingPdf(true);
    toast.info("Generating your travel plan PDF...");

    try {
      // Prepare messages for API (exclude welcome message)
      const apiMessages = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages: apiMessages, generatePdf: true },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || "Failed to generate PDF content");
      }

      // Extract destination from conversation for PDF title
      const destination = extractDestination(apiMessages);

      // Generate PDF
      generateTravelPDF(data.message, {
        title: destination ? `Travel Plan: ${destination}` : "Your Travel Plan",
        destination: destination || undefined,
      });

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full btn-gradient flex items-center justify-center shadow-2xl pulse-glow transition-transform hover:scale-110",
          isOpen && "hidden"
        )}
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7 text-primary-foreground" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">Travel Assistant</h3>
              <p className="text-xs text-primary-foreground/70 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Powered by AI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* PDF Export Button */}
            <button
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf || messages.length <= 1}
              className={cn(
                "p-2 rounded-full transition-colors",
                messages.length > 1
                  ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  : "text-primary-foreground/30 cursor-not-allowed"
              )}
              title="Download travel plan as PDF"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileDown className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  message.role === "user" ? "bg-primary" : "bg-secondary"
                )}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Sparkles className="w-4 h-4 text-secondary-foreground" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted text-foreground rounded-tl-none"
                )}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_ul]:my-1 [&_li]:my-0.5 [&_p]:my-1">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSend(question)}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-left"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PDF Download Hint */}
        {messages.length > 3 && (
          <div className="px-4 pb-2">
            <button
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf}
              className="w-full flex items-center justify-center gap-2 text-xs py-2 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <FileDown className="w-3 h-3" />
                  Download your travel plan as PDF
                </>
              )}
            </button>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about travel..."
              className="flex-1 px-4 py-3 rounded-xl bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="px-4 btn-gradient rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
