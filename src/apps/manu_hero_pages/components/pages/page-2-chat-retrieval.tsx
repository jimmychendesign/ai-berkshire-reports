"use client"

import { IDELayout } from "@/components/ide/ide-layout"
import { WorkspaceHeader } from "@/components/ide/workspace-header"
import { Viewport3D } from "@/components/ide/viewport-3d"
import { Bot, User, Plus } from "lucide-react"

export function Page2ChatRetrieval() {
  return (
    <IDELayout
      rightPanelContent={<ChatRetrievalContent />}
    >
      <WorkspaceHeader activeTab="办公室饮品角.env" />
      
      {/* Main Viewport Area */}
      <div className="flex-1 p-2">
        <Viewport3D className="w-full h-full" />
      </div>
    </IDELayout>
  )
}

function ChatRetrievalContent() {
  const assets = [
    { name: "标准马克杯", description: "陶瓷材质" },
    { name: "奶茶塑料杯", description: "透明材质" },
    { name: "保温咖啡杯", description: "不锈钢材质" },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* User Message */}
        <div className="flex items-start gap-2.5 flex-row-reverse">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 max-w-[85%] flex justify-end">
            <div className="rounded-lg px-3 py-2 bg-muted text-foreground">
              <p className="text-[12px] leading-relaxed">我现在需要一些新的奶茶和咖啡杯子模型。</p>
            </div>
          </div>
        </div>

        {/* AI Response */}
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[12px] leading-relaxed text-foreground mb-3">
              为您在资产库中找到以下杯具模型，您可以直接点击导入场景：
            </p>
            
            {/* Asset Cards */}
            <div className="space-y-2">
              {assets.map((asset, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-2.5 bg-muted rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-md flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 bg-slate-300 rounded" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-foreground">{asset.name}</p>
                    <p className="text-[10px] text-muted-foreground">{asset.description}</p>
                  </div>
                  
                  {/* Import Button */}
                  <button className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    <Plus className="w-3 h-3" />
                    导入
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Input Area */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="输入消息..."
            className="flex-1 h-8 px-3 text-[12px] bg-muted border border-transparent rounded-md focus:border-primary focus:outline-none placeholder:text-muted-foreground"
          />
          <button className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
