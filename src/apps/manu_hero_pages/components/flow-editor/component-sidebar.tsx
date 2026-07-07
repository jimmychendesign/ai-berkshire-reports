"use client"

import { useState } from "react"
import { Search, ChevronDown, ChevronRight, GripVertical } from "lucide-react"
import { 
  MessageSquare, 
  FileOutput, 
  Database, 
  Globe, 
  Bot, 
  Cpu, 
  GitBranch, 
  Timer,
  Eye,
  Hand,
  Navigation,
  Box,
  Coffee,
  CupSoda,
  Milk,
  Sparkles,
  Zap,
  Settings,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ComponentItem {
  id: string
  label: string
  icon: React.ReactNode
  color: string
}

interface ComponentCategory {
  id: string
  label: string
  icon: React.ReactNode
  expanded: boolean
  items: ComponentItem[]
}

const initialCategories: ComponentCategory[] = [
  {
    id: "input-output",
    label: "输入与输出",
    icon: <MessageSquare className="w-4 h-4" />,
    expanded: true,
    items: [
      { id: "order-input", label: "订单输入", icon: <MessageSquare className="w-4 h-4" />, color: "bg-blue-100 text-blue-600" },
      { id: "voice-input", label: "语音指令", icon: <MessageSquare className="w-4 h-4" />, color: "bg-blue-100 text-blue-600" },
      { id: "result-output", label: "结果输出", icon: <FileOutput className="w-4 h-4" />, color: "bg-green-100 text-green-600" },
      { id: "notification", label: "通知推送", icon: <AlertCircle className="w-4 h-4" />, color: "bg-yellow-100 text-yellow-600" },
    ]
  },
  {
    id: "perception",
    label: "感知模块",
    icon: <Eye className="w-4 h-4" />,
    expanded: true,
    items: [
      { id: "cup-detection", label: "杯具识别", icon: <CupSoda className="w-4 h-4" />, color: "bg-purple-100 text-purple-600" },
      { id: "liquid-detection", label: "液位检测", icon: <Milk className="w-4 h-4" />, color: "bg-cyan-100 text-cyan-600" },
      { id: "ingredient-recognition", label: "原料识别", icon: <Coffee className="w-4 h-4" />, color: "bg-orange-100 text-orange-600" },
      { id: "position-detection", label: "位置检测", icon: <Navigation className="w-4 h-4" />, color: "bg-indigo-100 text-indigo-600" },
    ]
  },
  {
    id: "planning",
    label: "规划模块",
    icon: <GitBranch className="w-4 h-4" />,
    expanded: true,
    items: [
      { id: "path-planning", label: "路径规划", icon: <Navigation className="w-4 h-4" />, color: "bg-blue-100 text-blue-600" },
      { id: "task-scheduler", label: "任务调度", icon: <Timer className="w-4 h-4" />, color: "bg-green-100 text-green-600" },
      { id: "collision-avoid", label: "碰撞避免", icon: <AlertCircle className="w-4 h-4" />, color: "bg-red-100 text-red-600" },
    ]
  },
  {
    id: "execution",
    label: "执行模块",
    icon: <Hand className="w-4 h-4" />,
    expanded: true,
    items: [
      { id: "gripper-control", label: "夹爪控制", icon: <Hand className="w-4 h-4" />, color: "bg-orange-100 text-orange-600" },
      { id: "arm-movement", label: "机械臂移动", icon: <Zap className="w-4 h-4" />, color: "bg-yellow-100 text-yellow-600" },
      { id: "pour-action", label: "倾倒动作", icon: <Milk className="w-4 h-4" />, color: "bg-cyan-100 text-cyan-600" },
      { id: "stir-action", label: "搅拌动作", icon: <Coffee className="w-4 h-4" />, color: "bg-purple-100 text-purple-600" },
    ]
  },
  {
    id: "ai-models",
    label: "智能模型",
    icon: <Bot className="w-4 h-4" />,
    expanded: false,
    items: [
      { id: "llm-reasoning", label: "大模型推理", icon: <Sparkles className="w-4 h-4" />, color: "bg-purple-100 text-purple-600" },
      { id: "recipe-generator", label: "配方生成", icon: <Coffee className="w-4 h-4" />, color: "bg-pink-100 text-pink-600" },
      { id: "quality-checker", label: "质量检测", icon: <Eye className="w-4 h-4" />, color: "bg-green-100 text-green-600" },
    ]
  },
  {
    id: "data-sources",
    label: "数据源",
    icon: <Database className="w-4 h-4" />,
    expanded: false,
    items: [
      { id: "recipe-db", label: "配方数据库", icon: <Database className="w-4 h-4" />, color: "bg-blue-100 text-blue-600" },
      { id: "inventory", label: "库存系统", icon: <Box className="w-4 h-4" />, color: "bg-green-100 text-green-600" },
      { id: "order-queue", label: "订单队列", icon: <Timer className="w-4 h-4" />, color: "bg-orange-100 text-orange-600" },
    ]
  },
]

interface ComponentSidebarProps {
  onDragStart?: (item: ComponentItem) => void
}

export function ComponentSidebar({ onDragStart }: ComponentSidebarProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
    ))
  }

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => searchQuery === "" || cat.items.length > 0)

  return (
    <div className="w-[220px] bg-card border-r border-border flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索组件..."
            className="w-full text-[12px] pl-8 pr-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Component Categories */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center justify-between px-2 py-1 mb-2">
          <span className="text-[11px] font-medium text-muted-foreground">组件库</span>
          <Settings className="w-3.5 h-3.5 text-muted-foreground" />
        </div>

        {filteredCategories.map((category) => (
          <div key={category.id} className="mb-1">
            <button
              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md transition-colors"
              onClick={() => toggleCategory(category.id)}
            >
              <span className="text-muted-foreground">{category.icon}</span>
              <span className="text-[12px] font-medium text-foreground flex-1 text-left">{category.label}</span>
              {category.expanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
            
            {category.expanded && (
              <div className="ml-2 mt-1 space-y-0.5">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => onDragStart?.(item)}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-grab active:cursor-grabbing transition-colors group"
                  >
                    <div className={cn("w-5 h-5 rounded flex items-center justify-center", item.color)}>
                      {item.icon}
                    </div>
                    <span className="text-[11px] text-foreground flex-1">{item.label}</span>
                    <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[11px] text-primary bg-primary/5 hover:bg-primary/10 rounded-md transition-colors">
          <Sparkles className="w-3.5 h-3.5" />
          新建自定义组件
        </button>
      </div>
    </div>
  )
}
