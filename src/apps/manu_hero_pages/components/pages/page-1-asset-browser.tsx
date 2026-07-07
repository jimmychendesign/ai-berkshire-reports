"use client"

import { IDELayout } from "@/components/ide/ide-layout"
import { WorkspaceHeader } from "@/components/ide/workspace-header"
import { Viewport3D } from "@/components/ide/viewport-3d"
import { AssetDrawer } from "@/components/ide/asset-drawer"
import { ChatInterface } from "@/components/ide/chat-interface"

export function Page1AssetBrowser() {
  return (
    <IDELayout
      rightPanelContent={
        <ChatInterface 
          welcomeMessage="您好！我可以帮助您编排任务和配置环境。请告诉我您需要什么帮助？"
        />
      }
    >
      <WorkspaceHeader activeTab="办公室饮品角.env" />
      
      {/* Main Viewport Area with Drawer */}
      <div className="flex-1 relative p-2">
        {/* 3D Viewport (background) */}
        <Viewport3D className="w-full h-full" />
        
        {/* Asset Drawer (overlay at bottom) */}
        <AssetDrawer />
      </div>
    </IDELayout>
  )
}
