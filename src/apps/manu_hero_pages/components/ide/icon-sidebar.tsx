"use client"

import { 
  Layers, 
  Box, 
  Play, 
  Settings, 
  FolderOpen,
  Cpu,
  LayoutGrid
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: FolderOpen, label: "项目", active: true },
  { icon: Layers, label: "场景" },
  { icon: Box, label: "资源" },
  { icon: Cpu, label: "机器人" },
  { icon: Play, label: "运行" },
  { icon: LayoutGrid, label: "视图" },
  { icon: Settings, label: "设置" },
]

export function IconSidebar() {
  return (
    <div className="w-[50px] bg-[#F1F5F9] border-r border-border flex flex-col items-center py-3 gap-1">
      {/* Logo */}
      <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mb-4">
        <Box className="w-4 h-4 text-primary-foreground" />
      </div>
      
      {/* Navigation Icons */}
      {menuItems.map((item, index) => (
        <button
          key={index}
          className={cn(
            "w-9 h-9 rounded-md flex items-center justify-center transition-colors",
            item.active 
              ? "bg-white text-primary shadow-sm" 
              : "text-muted-foreground hover:bg-white/60 hover:text-foreground"
          )}
          title={item.label}
        >
          <item.icon className="w-[18px] h-[18px]" />
        </button>
      ))}
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Bottom icon */}
      <button 
        className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:bg-white/60 hover:text-foreground transition-colors"
        title="帮助"
      >
        <Settings className="w-[18px] h-[18px]" />
      </button>
    </div>
  )
}
