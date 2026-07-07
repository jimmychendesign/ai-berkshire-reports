"use client"

import { IDELayout } from "@/components/ide/ide-layout"
import { WorkspaceHeader } from "@/components/ide/workspace-header"
import { Viewport3D } from "@/components/ide/viewport-3d"
import { TaskFlow } from "@/components/ide/task-flow"
import { Play, Pause, RotateCcw } from "lucide-react"

export function Page4ParallelSimulation() {
  const viewports = [
    { label: "环境1：早晨光线", status: "运行中" },
    { label: "环境2：傍晚光线 + 纸杯", status: "运行中" },
    { label: "环境3：随机位置", status: "运行中" },
    { label: "环境4：混合变量", status: "运行中" },
  ]

  return (
    <IDELayout
      showRightPanel={false}
      leftPanelHighlight="制作咖啡"
    >
      {/* Custom header with simulation controls */}
      <div className="h-9 bg-card border-b border-border flex items-center px-2 justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-t text-[12px] text-foreground border-b-2 border-primary">
            <span>办公室饮品角.env</span>
          </div>
        </div>
        
        {/* Simulation Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded text-[11px]">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            4个环境并行运行中
          </div>
          <div className="h-4 w-px bg-border" />
          <button className="p-1.5 hover:bg-muted rounded transition-colors" title="暂停">
            <Pause className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded transition-colors" title="重置">
            <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
      
      {/* Main Content Area - Split into viewport grid and task flow */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Section: 2x2 Viewport Grid (70%) */}
        <div className="flex-[7] p-2 min-h-0">
          <div className="grid grid-cols-2 gap-2 h-full">
            {viewports.map((viewport, index) => (
              <Viewport3D 
                key={index}
                label={viewport.label}
                showStatus={true}
                statusText={viewport.status}
                compact={true}
                className="h-full"
              />
            ))}
          </div>
        </div>
        
        {/* Bottom Section: Task Flow (30%) */}
        <div className="flex-[3] min-h-0">
          <TaskFlow />
        </div>
      </div>
    </IDELayout>
  )
}
