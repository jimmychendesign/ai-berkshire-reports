"use client"

import { Play, Loader2, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FlowNode {
  id: string
  label: string
  status: "pending" | "running" | "completed"
}

const defaultNodes: FlowNode[] = [
  { id: "start", label: "开始", status: "completed" },
  { id: "identify", label: "识别目标杯", status: "completed" },
  { id: "plan", label: "路径规划", status: "running" },
  { id: "grasp", label: "抓取物体", status: "pending" },
]

interface TaskFlowProps {
  nodes?: FlowNode[]
}

export function TaskFlow({ nodes = defaultNodes }: TaskFlowProps) {
  return (
    <div className="h-full bg-card border-t border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[12px] font-medium text-foreground">任务流程编排</h3>
          <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-muted rounded">低代码</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-2 py-1 text-[10px] text-green-600 bg-green-50 rounded">
            <Play className="w-3 h-3" />
            运行中
          </button>
        </div>
      </div>
      
      {/* Flow Canvas */}
      <div 
        className="flex-1 p-4 overflow-x-auto flex items-center"
        style={{
          backgroundImage: `
            radial-gradient(circle, #E5E7EB 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px'
        }}
      >
        <div className="flex items-center gap-0 min-w-max mx-auto">
          {nodes.map((node, index) => (
            <div key={node.id} className="flex items-center">
              <FlowNodeCard node={node} />
              {index < nodes.length - 1 && <FlowConnector />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FlowNodeCard({ node }: { node: FlowNode }) {
  const getStatusIcon = () => {
    switch (node.status) {
      case "completed":
        return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
      case "running":
        return <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
      default:
        return <Circle className="w-3.5 h-3.5 text-muted-foreground" />
    }
  }

  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-3 bg-white rounded-lg border-2 transition-all min-w-[120px]",
      node.status === "running" 
        ? "border-primary shadow-md shadow-primary/10" 
        : node.status === "completed"
        ? "border-green-200"
        : "border-border"
    )}>
      {getStatusIcon()}
      <span className={cn(
        "text-[12px] font-medium",
        node.status === "running" ? "text-primary" : "text-foreground"
      )}>
        {node.label}
      </span>
    </div>
  )
}

function FlowConnector() {
  return (
    <div className="flex items-center px-1">
      <div className="w-8 h-0.5 bg-border" />
      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-border" />
    </div>
  )
}
