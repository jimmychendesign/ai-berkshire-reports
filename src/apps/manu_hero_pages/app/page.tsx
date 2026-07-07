"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Page1AssetBrowser } from "@/components/pages/page-1-asset-browser"
import { Page2ChatRetrieval } from "@/components/pages/page-2-chat-retrieval"
import { Page3SceneExpansion } from "@/components/pages/page-3-scene-expansion"
import { Page4ParallelSimulation } from "@/components/pages/page-4-parallel-simulation"
import { cn } from "@/lib/utils"

const pages = [
  { id: 1, label: "页面1", subtitle: "资源抽屉" },
  { id: 2, label: "页面2", subtitle: "对话检索" },
  { id: 3, label: "页面3", subtitle: "场景拓展" },
  { id: 4, label: "页面4", subtitle: "并行仿真" },
]

export default function Home() {
  const [activePage, setActivePage] = useState(1)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Page Selector */}
      <div className="bg-card border-b border-border px-4 py-2 flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground mr-2">演示页面：</span>
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={cn(
              "px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors",
              activePage === page.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
          >
            {page.label}：{page.subtitle}
          </button>
        ))}
        
        {/* Separator */}
        <div className="h-5 w-px bg-border mx-2" />
        
        {/* Flow Editor Link */}
        <Link
          href="/flow-editor"
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
        >
          任务流编辑器
          <ExternalLink className="w-3 h-3" />
        </Link>
        
        {/* Industrial Pages Link */}
        <Link
          href="/industrial"
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
        >
          工业场景
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-hidden">
        {activePage === 1 && <Page1AssetBrowser />}
        {activePage === 2 && <Page2ChatRetrieval />}
        {activePage === 3 && <Page3SceneExpansion />}
        {activePage === 4 && <Page4ParallelSimulation />}
      </div>
    </div>
  )
}
