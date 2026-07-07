"use client"

import { useState } from "react"
import { 
  Play, 
  Save, 
  Share2, 
  Settings, 
  ChevronDown,
  History,
  Undo2,
  Redo2,
  AlignLeft,
  Grid3X3,
  Layers
} from "lucide-react"
import { ComponentSidebar } from "./component-sidebar"
import { FlowCanvas } from "./flow-canvas"
import { MiniChatbot } from "./mini-chatbot"

export function TaskFlowEditor() {
  const [flowName, setFlowName] = useState("制作冰拿铁.flow")

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Top Header Bar */}
      <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4 flex-shrink-0">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-[13px] font-semibold text-foreground">任务流编辑器</span>
          </div>
          
          {/* Divider */}
          <div className="h-5 w-px bg-border" />
          
          {/* Project / Flow name */}
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-muted-foreground">饮品店机器人项目</span>
            <span className="text-muted-foreground">/</span>
            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
              <span className="text-foreground font-medium">{flowName}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Center section - Toolbar */}
        <div className="flex items-center gap-1 bg-muted rounded-md p-1">
          <button className="p-1.5 hover:bg-card rounded transition-colors" title="撤销">
            <Undo2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-card rounded transition-colors" title="重做">
            <Redo2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button className="p-1.5 hover:bg-card rounded transition-colors" title="自动对齐">
            <AlignLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-card rounded transition-colors" title="网格">
            <Grid3X3 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Version indicator */}
          <button className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
            <History className="w-3.5 h-3.5" />
            版本 1.2.3
          </button>
          
          <div className="h-5 w-px bg-border" />
          
          {/* Action buttons */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors">
            <Save className="w-3.5 h-3.5" />
            保存
          </button>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-foreground bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors">
            <Play className="w-3.5 h-3.5" />
            运行
          </button>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            发布
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Library */}
        <ComponentSidebar />

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <FlowCanvas />
          
          {/* Mini Chatbot - positioned in bottom right */}
          <MiniChatbot />
        </div>
      </div>
    </div>
  )
}
