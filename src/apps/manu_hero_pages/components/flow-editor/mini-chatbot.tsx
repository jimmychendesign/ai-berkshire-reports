"use client"

import { useState } from "react"
import { Send, Bot, X, Minus, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "您好！我是任务流程助手。我可以帮您优化工作流、解答配置问题，或者建议新的节点组合。"
  }
]

interface MiniChatbotProps {
  className?: string
}

export function MiniChatbot({ className }: MiniChatbotProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    }

    setMessages([...messages, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input)
      }
      setMessages(prev => [...prev, aiResponse])
    }, 800)
  }

  const getAIResponse = (query: string): string => {
    if (query.includes("优化") || query.includes("改进")) {
      return "根据当前工作流分析，建议在「杯具识别」和「路径规划」之间添加「液位检测」节点，可以提高倾倒精度约15%。是否为您添加？"
    }
    if (query.includes("错误") || query.includes("问题")) {
      return "检测到「夹爪控制」节点的速度系数设置较高(0.8)，在抓取易碎杯具时可能存在风险。建议调整为0.5-0.6。"
    }
    if (query.includes("配方") || query.includes("拿铁")) {
      return "冰拿铁配方已加载：浓缩咖啡60ml + 冰块适量 + 牛奶200ml。需要我调整配方数据库节点的参数吗？"
    }
    return "我可以帮您：\n1. 优化节点连接\n2. 检查配置错误\n3. 推荐最佳实践\n请告诉我您需要什么帮助？"
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className={cn(
          "absolute bottom-4 right-4 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors",
          className
        )}
      >
        <Bot className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className={cn(
      "absolute bottom-4 right-4 w-[320px] bg-card rounded-lg border border-border shadow-xl flex flex-col overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4" />
          <span className="text-[12px] font-medium">流程助手</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            className="p-1 hover:bg-white/20 rounded transition-colors"
            onClick={() => setIsMinimized(true)}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 h-[240px] overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] px-3 py-2 rounded-lg text-[11px] leading-relaxed whitespace-pre-wrap",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-2 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="输入消息..."
            className="flex-1 text-[12px] px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
