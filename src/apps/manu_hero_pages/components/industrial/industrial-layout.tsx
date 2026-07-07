"use client"

import { ReactNode, useState } from "react"
import {
  Bot,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileCode,
  FolderOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type SidebarTab = "resources" | "validation"
export type WorkspaceView = "cad" | "validation" | "task-edit" | "task-run"

interface ResourceItem {
  name: string
  status: "active" | "standby" | "running"
}

interface ResourceSection {
  id: string
  title: string
  items: ResourceItem[]
  children?: ResourceSection[]
}

export interface WorkspaceTab {
  id: string
  label: string
  view: WorkspaceView
  taskName?: string
}

interface WorkspaceOpenPayload {
  itemName: string
  sectionId: string
  view: WorkspaceView
}

interface IndustrialLayoutProps {
  children: ReactNode
  rightPanelContent?: ReactNode
  projectName?: string
  activeSection?: string
  activeItem?: string
  initialExpandedSections?: string[]
  hideRightPanel?: boolean
  sidebarTab: SidebarTab
  onSidebarTabChange: (tab: SidebarTab) => void
  isLeftPanelCollapsed: boolean
  onToggleLeftPanel: () => void
  onWorkspaceOpen: (payload: WorkspaceOpenPayload) => void
  tabs: WorkspaceTab[]
  activeTabId: string
  onTabSelect: (tabId: string) => void
  onTabClose: (tabId: string) => void
}

const resourceSections: ResourceSection[] = [
  {
    id: "environments",
    title: "环境",
    items: [
      { name: "未命名场景.env", status: "active" },
      { name: "3号工位_测试环境.env", status: "standby" },
    ],
  },
  {
    id: "tasks",
    title: "任务",
    items: [
      { name: "3号工位_柔性打包.task", status: "standby" },
      { name: "质量检测.task", status: "standby" },
    ],
  },
  {
    id: "assets",
    title: "Assets",
    items: [],
    children: [
      {
        id: "scenes",
        title: "scenes",
        items: [
          { name: "未命名场景.env", status: "active" },
          { name: "3号工位_测试环境.env", status: "standby" },
        ],
      },
      {
        id: "objects",
        title: "objects",
        items: [
          { name: "工业传送带.obj", status: "standby" },
          { name: "礼盒包装盒.obj", status: "standby" },
        ],
      },
      {
        id: "robots",
        title: "robots",
        items: [
          { name: "Sudo 灵巧手", status: "active" },
          { name: "UR10e 机械臂", status: "active" },
        ],
      },
    ],
  },
]

const validationTaskSections: ResourceSection[] = [
  {
    id: "validation-service",
    title: "并行验证服务",
    items: [
      { name: "柔性打包基准验证.task", status: "running" },
      { name: "末端执行器稳定性检查.task", status: "standby" },
      { name: "尺寸扰动回归验证.task", status: "standby" },
    ],
  },
]

const iconNavItems = [
  { id: "resources" as const, icon: FolderOpen, label: "资源管理" },
  { id: "validation" as const, icon: ClipboardList, label: "并行验证" },
]

export function IndustrialLayout({
  children,
  rightPanelContent,
  projectName = "Project Sudo柔性生产线",
  activeSection,
  activeItem,
  initialExpandedSections = [
    "environments",
    "tasks",
    "assets",
    "scenes",
    "objects",
    "robots",
    "validation-service",
  ],
  hideRightPanel = false,
  sidebarTab,
  onSidebarTabChange,
  isLeftPanelCollapsed,
  onToggleLeftPanel,
  onWorkspaceOpen,
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
}: IndustrialLayoutProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(initialExpandedSections)

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const currentSections = sidebarTab === "resources" ? resourceSections : validationTaskSections
  const panelLabel = sidebarTab === "resources" ? "资源管理" : "并行验证"
  const SearchIcon = sidebarTab === "resources" ? Search : ClipboardList
  const PanelAccentIcon = sidebarTab === "resources" ? FileCode : ClipboardList

  const handleItemClick = (sectionId: string, item: ResourceItem) => {
    if (sidebarTab === "validation" && item.name.endsWith(".task")) {
      onWorkspaceOpen({ itemName: item.name, sectionId, view: "validation" })
      return
    }

    if (sidebarTab === "resources" && sectionId === "tasks" && item.name.endsWith(".task")) {
      onWorkspaceOpen({ itemName: item.name, sectionId, view: "task-edit" })
      return
    }

    if (sectionId === "environments" || sectionId === "scenes") {
      onWorkspaceOpen({ itemName: item.name, sectionId, view: "cad" })
    }
  }

  const renderItems = (sectionId: string, items: ResourceItem[]) => (
    <div className="ml-3 border-l border-[#E5E7EB]">
      {items.map((item, index) => {
        const isActive = activeItem === item.name
        return (
          <button
            key={index}
            onClick={() => handleItemClick(sectionId, item)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-1.5 text-[11px] rounded-r transition-colors",
              isActive ? "bg-[#262626] text-white" : "text-[#374151] hover:bg-[#F3F4F6]"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full flex-shrink-0",
                item.status === "running" && "bg-green-500 animate-pulse",
                item.status === "active" && (isActive ? "bg-white" : "bg-green-500"),
                item.status === "standby" && (isActive ? "bg-white/60" : "bg-amber-400")
              )}
            />
            <span className="truncate">{item.name}</span>
            {item.status === "running" && !isActive && (
              <span className="ml-auto rounded bg-green-500 px-1.5 py-0.5 text-[9px] text-white">
                运行中
              </span>
            )}
          </button>
        )
      })}
    </div>
  )

  const renderSection = (section: ResourceSection, level = 0) => {
    const isExpanded = expandedSections.includes(section.id)
    const hasChildren = Boolean(section.children?.length)

    return (
      <div key={section.id} className={cn("mb-1", level > 0 && "ml-3")}>
        <button
          onClick={() => toggleSection(section.id)}
          className={cn(
            "w-full flex items-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded transition-colors",
            activeSection === section.id
              ? "bg-[#F3F4F6] text-[#262626]"
              : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#374151]"
          )}
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
          {section.title}
          <span className="ml-auto text-[10px] text-[#9CA3AF]">
            {hasChildren
              ? section.children?.reduce((count, child) => count + child.items.length, 0)
              : section.items.length}
          </span>
        </button>

        {isExpanded && (
          <div>
            {section.items.length > 0 && renderItems(section.id, section.items)}
            {hasChildren && (
              <div className="ml-1">
                {section.children?.map((child) => renderSection(child, level + 1))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      <div className="w-[50px] border-r border-[#E5E7EB] bg-[#F8FAFC] py-3 flex flex-col items-center gap-1">
        <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-[#262626]">
          <Bot className="h-4 w-4 text-white" />
        </div>

        {iconNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSidebarTabChange(item.id)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              sidebarTab === item.id
                ? "bg-[#262626] text-white"
                : "text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#374151]"
            )}
            title={item.label}
          >
            <item.icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div
        className={cn(
          "bg-white border-r border-[#E5E7EB] flex flex-col transition-all duration-200",
          isLeftPanelCollapsed ? "w-0 overflow-hidden border-r-0" : "w-[250px]"
        )}
      >
        <div className="border-b border-[#E5E7EB] px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#262626]">
              <PanelAccentIcon className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[12px] font-medium text-[#374151]">{projectName}</h2>
              <p className="truncate text-[10px] text-[#6B7280]">{panelLabel}</p>
            </div>
            <button
              onClick={onToggleLeftPanel}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]"
              title="收起资源栏"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder={sidebarTab === "resources" ? "搜索资源..." : "搜索任务..."}
              className="h-7 w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] pl-8 pr-3 text-[11px] focus:border-[#262626] focus:outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-1 py-1">
          {currentSections.map((section) => renderSection(section))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col bg-[#F9FAFB]">
        <div className="flex h-10 items-center border-b border-[#E5E7EB] bg-white pl-2 pr-3">
          {isLeftPanelCollapsed && (
            <button
              onClick={onToggleLeftPanel}
              className="mr-2 flex h-7 w-7 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]"
              title="展开资源栏"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}

          <div className="flex min-w-0 flex-1 items-end gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId
              const canClose = tabs.length > 1

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabSelect(tab.id)}
                  className={cn(
                    "group flex h-9 items-center gap-2 rounded-t-xl border border-b-0 px-3 text-[11px] transition-colors",
                    isActive
                      ? "border-[#D1D5DB] bg-[#F9FAFB] text-[#111827]"
                      : "border-transparent bg-transparent text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]"
                  )}
                >
                  <span className="truncate">{tab.label}</span>
                  {canClose && (
                    <span
                      onClick={(event) => {
                        event.stopPropagation()
                        onTabClose(tab.id)
                      }}
                      className="flex h-4 w-4 items-center justify-center rounded text-[#9CA3AF] hover:bg-[#E5E7EB] hover:text-[#374151]"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="min-h-0 flex-1">{children}</div>
      </div>

      {!hideRightPanel && (
        <div className="flex w-[300px] flex-col border-l border-[#E5E7EB] bg-white">
          <div className="flex-1 overflow-hidden">{rightPanelContent}</div>
        </div>
      )}
    </div>
  )
}
