"use client"

import { IDELayout } from "@/components/ide/ide-layout"
import { WorkspaceHeader } from "@/components/ide/workspace-header"
import { Viewport3D } from "@/components/ide/viewport-3d"
import { Bot, User, Sparkles } from "lucide-react"

export function Page3SceneExpansion() {
  return (
    <IDELayout
      rightPanelContent={<SceneExpansionChat />}
    >
      <WorkspaceHeader 
        activeTab="办公室饮品角.env" 
        showExpandButton={true}
      />
      
      {/* Main Viewport Area */}
      <div className="flex-1 p-2">
        <Viewport3D className="w-full h-full" />
      </div>
    </IDELayout>
  )
}

function SceneExpansionChat() {
  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* System notification about expansion trigger */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-[10px]">
            <Sparkles className="w-3 h-3" />
            <span>用户点击了「场景拓展」按钮</span>
          </div>
        </div>

        {/* AI Response */}
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[12px] leading-relaxed text-foreground mb-3">
              正在分析当前场景... 
            </p>
            <p className="text-[12px] leading-relaxed text-foreground mb-3">
              建议进行以下泛化拓展以测试机器人的鲁棒性：
            </p>
            
            {/* Expansion Details */}
            <div className="p-3 bg-muted rounded-lg border border-border mb-3">
              <ul className="space-y-2 text-[12px] text-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>替换现有的杯子种类（马克杯 → 纸杯、保温杯）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>改变场景环境光线（早晨 / 傍晚模式）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>随机调整物体位置（±10厘米范围）</span>
                </li>
              </ul>
            </div>

            {/* Confirmation Buttons */}
            <div className="flex items-center gap-2">
              <button className="flex-1 py-2.5 text-[12px] font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                确认并拓展
              </button>
              <button className="flex-1 py-2.5 text-[12px] font-medium border border-border text-foreground rounded-md hover:bg-muted transition-colors">
                编辑参数
              </button>
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
