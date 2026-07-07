"use client"

import { useMemo, useState } from "react"
import {
  IndustrialLayout,
  SidebarTab,
  WorkspaceTab,
  WorkspaceView,
} from "@/components/industrial/industrial-layout"
import { CADImportContent, CADImportCopilotPanel } from "@/components/industrial/page-cad-import"
import { PageNodeOrchestration } from "@/components/industrial/page-node-orchestration"
import { PageParallelValidation } from "@/components/industrial/page-parallel-validation"

const initialTabs: WorkspaceTab[] = [
  { id: "env:未命名场景.env", label: "未命名场景.env", view: "cad" },
]

const customTaskFileName = "定制充电宝柔性产线.task"

function createTabId(view: WorkspaceView, label: string) {
  return `${view}:${label}`
}

export default function IndustrialPage() {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("resources")
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false)
  const [tabs, setTabs] = useState<WorkspaceTab[]>(initialTabs)
  const [activeTabId, setActiveTabId] = useState(initialTabs[0].id)

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0]

  const activeSection = useMemo(() => {
    if (!activeTab) {
      return "environments"
    }

    if (activeTab.view === "validation") {
      return "validation-service"
    }

    if (activeTab.view === "task-edit" || activeTab.view === "task-run") {
      return "tasks"
    }

    return activeTab.label.endsWith(".env") ? "environments" : "scenes"
  }, [activeTab])

  const openWorkspace = (view: WorkspaceView, label: string) => {
    const isTaskView = view === "task-edit" || view === "task-run"
    const normalizedLabel = isTaskView
      ? view === "task-run"
        ? `运行 - ${customTaskFileName}`
        : `编辑 - ${customTaskFileName}`
      : label
    const id = createTabId(view, normalizedLabel)
    const taskName = isTaskView
      ? customTaskFileName.replace(/\.task$/, "")
      : label.endsWith(".task")
        ? label.replace(/\.task$/, "")
        : label.replace(/（编辑）|（运行）/g, "")

    setTabs((current) => {
      if (current.some((tab) => tab.id === id)) {
        return current
      }

      return [...current, { id, label: normalizedLabel, view, taskName }]
    })

    setActiveTabId(id)

    if (view === "task-edit") {
      setIsLeftPanelCollapsed(true)
    }
  }

  const openTaskRunTab = (taskName: string) => {
    openWorkspace("task-run", taskName)
  }

  const closeTab = (tabId: string) => {
    setTabs((current) => {
      if (current.length === 1) {
        return current
      }

      const nextTabs = current.filter((tab) => tab.id !== tabId)

      if (activeTabId === tabId) {
        const fallback = nextTabs[nextTabs.length - 1]
        if (fallback) {
          setActiveTabId(fallback.id)
        }
      }

      return nextTabs
    })
  }

  const content = (() => {
    if (!activeTab) {
      return <CADImportContent />
    }

    if (activeTab.view === "validation") {
      return <PageParallelValidation />
    }

    if (activeTab.view === "task-edit") {
      return (
        <PageNodeOrchestration
          mode="edit"
          taskName={activeTab.taskName ?? activeTab.label}
          onRunTask={openTaskRunTab}
        />
      )
    }

    if (activeTab.view === "task-run") {
      return (
        <PageNodeOrchestration
          mode="run"
          taskName={activeTab.taskName ?? activeTab.label}
        />
      )
    }

    return <CADImportContent />
  })()

  return (
    <IndustrialLayout
      rightPanelContent={
        <CADImportCopilotPanel
          variant={
            activeTab?.view === "task-edit" || activeTab?.view === "task-run"
              ? "task"
              : "environment"
          }
        />
      }
      activeSection={activeSection}
      activeItem={
        activeTab?.view === "task-run"
          ? `${activeTab.taskName}.task`
          : activeTab?.label
      }
      sidebarTab={sidebarTab}
      onSidebarTabChange={(tab) => {
        setSidebarTab(tab)
        setIsLeftPanelCollapsed(false)
      }}
      isLeftPanelCollapsed={isLeftPanelCollapsed}
      onToggleLeftPanel={() => setIsLeftPanelCollapsed((prev) => !prev)}
      onWorkspaceOpen={({ itemName, view }) => openWorkspace(view, itemName)}
      tabs={tabs}
      activeTabId={activeTabId}
      onTabSelect={setActiveTabId}
      onTabClose={closeTab}
    >
      {content}
    </IndustrialLayout>
  )
}
