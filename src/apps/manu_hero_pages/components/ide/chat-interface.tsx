"use client"

import { useState, ReactNode } from "react"
import { Bot, Send, User, Plus, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  component?: ReactNode
}

interface ChatInterfaceProps {
  messages?: Message[]
  welcomeMessage?: string
  inputPlaceholder?: string
}

export function ChatInterface({ 
  messages = [],
  welcomeMessage = "您好！我可以帮助您编排任务和配置环境。",
  inputPlaceholder = "输入消息..."
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <WelcomeMessage message={welcomeMessage} />
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            className="flex-1 h-8 px-3 text-[12px] bg-muted border border-transparent rounded-md focus:border-primary focus:outline-none placeholder:text-muted-foreground"
          />
          <button className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function WelcomeMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 pt-1">
        <p className="text-[12px] text-foreground leading-relaxed">{message}</p>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  
  return (
    <div className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}>
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
        isUser ? "bg-muted" : "bg-primary/10"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>
      <div className={cn(
        "flex-1 max-w-[85%]",
        isUser && "flex justify-end"
      )}>
        <div className={cn(
          "rounded-lg px-3 py-2",
          isUser ? "bg-muted text-foreground" : "bg-transparent"
        )}>
          <p className="text-[12px] leading-relaxed">{message.content}</p>
          {message.component && (
            <div className="mt-2">
              {message.component}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Asset Card for embedding in chat
export function AssetCard({ 
  name, 
  onImport 
}: { 
  name: string
  onImport?: () => void 
}) {
  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-md border border-border">
      <div className="w-10 h-10 bg-slate-200 rounded flex items-center justify-center">
        <div className="w-5 h-5 bg-slate-400 rounded" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-foreground truncate">{name}</p>
      </div>
      <button 
        onClick={onImport}
        className="flex items-center gap-1 px-2 py-1 text-[10px] bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-3 h-3" />
        导入
      </button>
    </div>
  )
}

// Asset List for chat
export function AssetList({ assets }: { assets: string[] }) {
  return (
    <div className="space-y-2">
      {assets.map((asset, index) => (
        <AssetCard key={index} name={asset} />
      ))}
    </div>
  )
}

// Confirmation Component
export function ConfirmationButtons({ 
  onConfirm, 
  onEdit 
}: { 
  onConfirm?: () => void
  onEdit?: () => void 
}) {
  return (
    <div className="flex items-center gap-2 mt-3">
      <button 
        onClick={onConfirm}
        className="flex-1 py-2 text-[11px] font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        确认并拓展
      </button>
      <button 
        onClick={onEdit}
        className="flex-1 py-2 text-[11px] font-medium border border-border text-foreground rounded-md hover:bg-muted transition-colors"
      >
        编辑参数
      </button>
    </div>
  )
}
