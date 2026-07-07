"use client"

import { X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface WorkspaceHeaderProps {
  activeTab?: string
  showExpandButton?: boolean
  onExpand?: () => void
}

export function WorkspaceHeader({ 
  activeTab = "办公室饮品角.env",
  showExpandButton = false,
  onExpand
}: WorkspaceHeaderProps) {
  return (
    <div className="h-9 bg-card border-b border-border flex items-center px-2">
      {/* File Tabs */}
      <div className="flex items-center gap-0.5">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-t text-[12px] text-foreground border-b-2 border-primary">
          <span>{activeTab}</span>
          <button className="hover:bg-muted-foreground/10 rounded p-0.5 transition-colors">
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 text-[12px] text-muted-foreground hover:bg-muted rounded-t transition-colors cursor-pointer">
          <span>仓库场景A.env</span>
        </div>
      </div>
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Expand Scene Button */}
      {showExpandButton && (
        <button
          onClick={onExpand}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-md transition-all",
            "bg-gradient-to-r from-primary to-blue-500 text-white",
            "hover:shadow-md hover:shadow-primary/20",
            "border border-primary/20"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          场景拓展
        </button>
      )}
    </div>
  )
}
