"use client"

import { Trash2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NodePort {
  id: string
  label: string
  type: "input" | "output"
  color: "blue" | "green" | "orange" | "red" | "purple"
  required?: boolean
  connected?: boolean
}

export interface FlowNodeData {
  id: string
  type: string
  title: string
  description: string
  icon: React.ReactNode
  iconBgColor: string
  status?: {
    time: string
    success: boolean
  }
  inputs: NodePort[]
  outputs: NodePort[]
  fields?: {
    label: string
    value: string
    type: "text" | "number" | "select" | "textarea"
    options?: string[]
    required?: boolean
  }[]
  position: { x: number; y: number }
}

interface FlowNodeProps {
  node: FlowNodeData
  selected?: boolean
  onSelect?: () => void
  onDelete?: () => void
}

const portColors = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
}

export function FlowNode({ node, selected, onSelect, onDelete }: FlowNodeProps) {
  return (
    <div
      className={cn(
        "absolute bg-card rounded-lg border shadow-sm min-w-[240px] max-w-[280px] select-none transition-shadow",
        selected ? "border-primary shadow-md ring-2 ring-primary/20" : "border-border hover:shadow-md"
      )}
      style={{ left: node.position.x, top: node.position.y }}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className={cn("w-7 h-7 rounded-md flex items-center justify-center", node.iconBgColor)}>
            {node.icon}
          </div>
          <span className="text-[13px] font-medium text-foreground">{node.title}</span>
        </div>
        <div className="flex items-center gap-1">
          {node.status && (
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded",
              node.status.success ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            )}>
              {node.status.time}
            </span>
          )}
          <button 
            className="p-1 hover:bg-muted rounded transition-colors"
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
          >
            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="px-3 py-2 border-b border-border">
        <p className="text-[11px] text-muted-foreground leading-relaxed">{node.description}</p>
      </div>

      {/* Inputs Section */}
      {node.inputs.length > 0 && (
        <div className="px-3 py-2 border-b border-border">
          <div className="text-[10px] font-medium text-muted-foreground mb-2">输入</div>
          <div className="space-y-2">
            {node.inputs.map((port) => (
              <div key={port.id} className="flex items-center gap-2 relative">
                <div 
                  className={cn(
                    "w-2.5 h-2.5 rounded-full absolute -left-[17px] border-2 border-card",
                    portColors[port.color],
                    port.connected && "ring-2 ring-offset-1 ring-offset-card"
                  )}
                  style={{ ringColor: `var(--${port.color}-500)` }}
                />
                <span className="text-[11px] text-foreground">
                  {port.label}
                  {port.required && <span className="text-red-500 ml-0.5">*</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fields */}
      {node.fields && node.fields.length > 0 && (
        <div className="px-3 py-2 border-b border-border space-y-2">
          {node.fields.map((field, index) => (
            <div key={index}>
              <label className="text-[10px] text-muted-foreground block mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  className="w-full text-[11px] px-2 py-1.5 bg-muted border border-border rounded resize-none h-16"
                  defaultValue={field.value}
                  placeholder={field.value}
                />
              ) : field.type === "select" ? (
                <select className="w-full text-[11px] px-2 py-1.5 bg-muted border border-border rounded">
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="w-full text-[11px] px-2 py-1.5 bg-muted border border-border rounded"
                  defaultValue={field.value}
                  placeholder={field.value}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Outputs Section */}
      {node.outputs.length > 0 && (
        <div className="px-3 py-2">
          <div className="text-[10px] font-medium text-muted-foreground mb-2">输出</div>
          <div className="space-y-2">
            {node.outputs.map((port) => (
              <div key={port.id} className="flex items-center justify-end gap-2 relative">
                <span className="text-[11px] text-foreground">{port.label}</span>
                <div 
                  className={cn(
                    "w-2.5 h-2.5 rounded-full absolute -right-[17px] border-2 border-card",
                    portColors[port.color],
                    port.connected && "ring-2 ring-offset-1 ring-offset-card"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
