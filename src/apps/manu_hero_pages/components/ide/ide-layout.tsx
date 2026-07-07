"use client"

import { ReactNode } from "react"
import { IconSidebar } from "./icon-sidebar"
import { LeftPanel } from "./left-panel"
import { RightPanel } from "./right-panel"

interface IDELayoutProps {
  children: ReactNode
  rightPanelContent?: ReactNode
  showRightPanel?: boolean
  leftPanelHighlight?: string
}

export function IDELayout({ 
  children, 
  rightPanelContent,
  showRightPanel = true,
  leftPanelHighlight
}: IDELayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Extreme Left Sidebar - Icon Navigation */}
      <IconSidebar />
      
      {/* Left Panel - Resource Library */}
      <LeftPanel highlightItem={leftPanelHighlight} />
      
      {/* Center Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-muted">
        {children}
      </div>
      
      {/* Right Panel - Console/Chat */}
      {showRightPanel && (
        <RightPanel>
          {rightPanelContent}
        </RightPanel>
      )}
    </div>
  )
}
