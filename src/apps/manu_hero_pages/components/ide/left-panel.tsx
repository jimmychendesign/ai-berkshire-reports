"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface TreeItem {
  name: string
  status?: "active" | "standby" | "running"
  children?: TreeItem[]
}

interface Section {
  title: string
  items: TreeItem[]
}

const sections: Section[] = [
  {
    title: "环境",
    items: [
      { name: "办公室饮品角", status: "active" },
      { name: "仓库场景A", status: "standby" },
      { name: "工厂产线", status: "standby" },
    ]
  },
  {
    title: "任务",
    items: [
      { name: "制作咖啡.task", status: "standby" },
      { name: "搬运物品.task", status: "standby" },
      { name: "巡检任务.task", status: "standby" },
    ]
  },
  {
    title: "物体",
    items: [
      { name: "咖啡机", status: "active" },
      { name: "饮水机", status: "active" },
      { name: "纸杯堆", status: "active" },
      { name: "马克杯", status: "standby" },
    ]
  },
  {
    title: "机器人",
    items: [
      { name: "UR5e 机械臂", status: "active" },
      { name: "AGV 移动底盘", status: "standby" },
    ]
  },
]

interface LeftPanelProps {
  highlightItem?: string
}

export function LeftPanel({ highlightItem }: LeftPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["环境", "任务", "物体", "机器人"])

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  const getStatusColor = (status?: string, isHighlighted?: boolean) => {
    if (isHighlighted) return "bg-green-500"
    switch (status) {
      case "active": return "bg-green-500"
      case "running": return "bg-green-500 animate-pulse"
      case "standby": return "bg-amber-400"
      default: return "bg-gray-300"
    }
  }

  return (
    <div className="w-[250px] bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border">
        <h2 className="text-[13px] font-medium text-foreground">资源库</h2>
      </div>
      
      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索资源..."
            className="w-full h-7 pl-8 pr-3 text-xs bg-muted border border-transparent rounded-md focus:border-primary focus:outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      
      {/* Tree View */}
      <div className="flex-1 overflow-y-auto px-1 py-1">
        {sections.map((section) => (
          <div key={section.title} className="mb-1">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center gap-1 px-2 py-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
            >
              {expandedSections.includes(section.title) ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
              {section.title}
              <span className="ml-auto text-[10px] text-muted-foreground/60">
                {section.items.length}
              </span>
            </button>
            
            {/* Section Items */}
            {expandedSections.includes(section.title) && (
              <div className="ml-3 border-l border-border/50">
                {section.items.map((item, index) => {
                  const isHighlighted = highlightItem && item.name.includes(highlightItem)
                  return (
                    <button
                      key={index}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-foreground hover:bg-muted rounded-r transition-colors",
                        isHighlighted && "bg-accent text-accent-foreground"
                      )}
                    >
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full flex-shrink-0",
                        getStatusColor(item.status, isHighlighted)
                      )} />
                      <span className="truncate">{item.name}</span>
                      {isHighlighted && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-green-500 text-white rounded">
                          运行中
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
