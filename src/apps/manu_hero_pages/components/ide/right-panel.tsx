"use client"

import { ReactNode, useState } from "react"
import { cn } from "@/lib/utils"

interface RightPanelProps {
  children?: ReactNode
}

export function RightPanel({ children }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<"config" | "chat">("chat")

  return (
    <div className="w-[300px] bg-card border-l border-border flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("config")}
          className={cn(
            "flex-1 px-4 py-2.5 text-[12px] font-medium transition-colors border-b-2",
            activeTab === "config"
              ? "text-primary border-primary bg-accent/30"
              : "text-muted-foreground border-transparent hover:text-foreground"
          )}
        >
          属性配置
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={cn(
            "flex-1 px-4 py-2.5 text-[12px] font-medium transition-colors border-b-2",
            activeTab === "chat"
              ? "text-primary border-primary bg-accent/30"
              : "text-muted-foreground border-transparent hover:text-foreground"
          )}
        >
          智能助手
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
