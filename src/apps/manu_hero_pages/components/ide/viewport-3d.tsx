"use client"

import { Box, Move3D, RotateCcw, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"

interface Viewport3DProps {
  label?: string
  showStatus?: boolean
  statusText?: string
  className?: string
  compact?: boolean
}

export function Viewport3D({ 
  label,
  showStatus = false, 
  statusText = "运行中",
  className,
  compact = false
}: Viewport3DProps) {
  return (
    <div className={cn(
      "relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-md overflow-hidden border border-border",
      className
    )}>
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, #CBD5E1 1px, transparent 1px),
            linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)
          `,
          backgroundSize: compact ? '20px 20px' : '40px 40px'
        }}
      />
      
      {/* 3D Scene Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          {/* Desk Representation */}
          <div className="relative">
            <div className={cn(
              "bg-amber-200 rounded shadow-md",
              compact ? "w-16 h-8" : "w-32 h-16"
            )} />
            {/* Objects on desk */}
            <div className={cn(
              "absolute bg-gray-400 rounded",
              compact ? "-top-2 left-1 w-3 h-4" : "-top-4 left-2 w-6 h-8"
            )} />
            <div className={cn(
              "absolute bg-blue-400 rounded",
              compact ? "-top-1.5 left-6 w-2 h-3" : "-top-3 left-12 w-4 h-6"
            )} />
            <div className={cn(
              "absolute bg-green-400 rounded",
              compact ? "-top-1 right-2 w-2 h-2" : "-top-2 right-4 w-4 h-4"
            )} />
          </div>
          {!compact && (
            <span className="text-[11px] mt-2">3D 视口</span>
          )}
        </div>
      </div>
      
      {/* Label */}
      {label && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] rounded">
          {label}
        </div>
      )}
      
      {/* Status Indicator */}
      {showStatus && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-green-500/90 text-white text-[10px] rounded">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          {statusText}
        </div>
      )}
      
      {/* Toolbar (only for non-compact) */}
      {!compact && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-md shadow-sm border border-border">
          <button className="p-1.5 hover:bg-muted rounded transition-colors" title="移动">
            <Move3D className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded transition-colors" title="旋转">
            <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded transition-colors" title="缩放">
            <ZoomIn className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button className="p-1.5 hover:bg-muted rounded transition-colors" title="物体">
            <Box className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  )
}
