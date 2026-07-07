"use client"

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react"
import { 
  ChevronDown, 
  ChevronRight,
  Eye, 
  Hand, 
  Route, 
  Play,
  Check,
  Loader2,
  GripVertical,
  Search,
  Bot,
  Trash2,
  Cpu,
  Settings,
  MessageSquare,
  Wrench
} from "lucide-react"
import { cn } from "@/lib/utils"

// Component sidebar categories
const componentCategories = [
  {
    id: "io",
    title: "业务与信号输入",
    icon: MessageSquare,
    color: "#8B5CF6",
    items: [
      { name: "终端订单监听", icon: MessageSquare },
      { name: "订单参数解析", icon: Settings },
      { name: "工位就绪同步", icon: Cpu },
      { name: "任务完成反馈", icon: Check },
    ]
  },
  {
    id: "perception",
    title: "视觉与感知",
    icon: Eye,
    color: "#3B82F6",
    items: [
      { name: "多品类物料识别", icon: Eye },
      { name: "动态目标追踪", icon: Eye },
      { name: "高精位姿估计", icon: Bot },
      { name: "软体形变计算", icon: Hand },
      { name: "安全区检测", icon: Search },
    ]
  },
  {
    id: "planning",
    title: "认知与规划",
    icon: Route,
    color: "#10B981",
    items: [
      { name: "Agent 任务拆解", icon: Bot },
      { name: "抓取点生成", icon: Hand },
      { name: "装配轨迹规划", icon: Route },
      { name: "多指协同解算", icon: Hand },
      { name: "避障规划", icon: Route },
    ]
  },
  {
    id: "execution",
    title: "物理执行",
    icon: Play,
    color: "#F59E0B",
    items: [
      { name: "通用泛化抓取", icon: Hand },
      { name: "精密对齐压合", icon: Settings },
      { name: "灵巧手精细捏取", icon: Hand },
      { name: "柔性材料折叠力控", icon: Bot },
      { name: "纸盒封装盖合", icon: Check },
      { name: "安全人机交接", icon: MessageSquare },
      { name: "磁悬浮传送带控制", icon: Cpu },
    ]
  },
]

// Node definitions for the canvas
interface NodeField {
  label: string
  type: "input" | "dropdown" | "textarea"
  value?: string
  options?: string[]
  required?: boolean
}

interface FlowNode {
  id: string
  title: string
  description?: string
  icon: typeof Eye
  color: string
  status: "completed" | "running" | "pending"
  configText?: string
  fields?: NodeField[]
  inputs?: { id: string; label: string; color: string; data?: string }[]
  outputs?: { id: string; label: string; color: string; data?: string }[]
  isAgent?: boolean
  x: number
  y: number
}

const flowNodes: FlowNode[] = [
  {
    id: "node1",
    title: "订单参数解析",
    icon: Settings,
    color: "#262626",
    status: "completed",
    outputs: [{ id: "out1", label: "订单参数", color: "#262626", data: "sku=CB-01,qty=1,prio=A" }],
    x: 60,
    y: 180
  },
  {
    id: "node2",
    title: "1号工位: 泛化抓取与上料",
    icon: Hand,
    color: "#262626",
    status: "completed",
    configText: "目标: 充电宝组件",
    inputs: [{ id: "in1", label: "订单参数", color: "#262626", data: "sku=CB-01,qty=1" }],
    outputs: [{ id: "out2", label: "上料完成", color: "#262626", data: "feed_state=ok" }],
    x: 290,
    y: 170
  },
  {
    id: "node3",
    title: "控制磁悬浮传送带",
    icon: Cpu,
    color: "#262626",
    status: "pending",
    inputs: [{ id: "in2", label: "上料完成", color: "#262626", data: "feed_state=ok" }],
    outputs: [{ id: "out3", label: "到达2号工位", color: "#262626", data: "station=2,eta=2.3s" }],
    x: 520,
    y: 180
  },
  {
    id: "node4",
    title: "2号工位: 亚毫米级精密装配",
    icon: Settings,
    color: "#2563EB",
    status: "running",
    configText: "动作: 上下部件对齐拼接",
    inputs: [{ id: "in4", label: "到达2号工位", color: "#262626", data: "station=2,pose=ready" }],
    outputs: [{ id: "out4", label: "装配完成", color: "#2563EB", data: "assembly_pass=true" }],
    x: 760,
    y: 160
  },
  {
    id: "node5",
    title: "控制磁悬浮传送带",
    icon: Cpu,
    color: "#262626",
    status: "pending",
    inputs: [{ id: "in5", label: "装配完成", color: "#2563EB", data: "assembly_pass=true" }],
    outputs: [{ id: "out5", label: "到达3号工位", color: "#262626", data: "station=3,eta=1.9s" }],
    x: 1010,
    y: 180
  },
  {
    id: "node6",
    title: "3号工位: Agent 柔性打包",
    icon: Bot,
    color: "#262626",
    status: "pending",
    isAgent: true,
    fields: [
      { label: "语言模型", type: "dropdown", value: "Sudo-VLA-Pro", options: ["Sudo-VLA-Pro"] },
      {
        label: "Agent 指令",
        type: "textarea",
        value: "自主取用包装材料，使用灵巧手对魔术布进行折叠打包，并将纸盒盖子盖下。",
      },
      { label: "工具集", type: "input", value: "视觉感知, 灵巧手力控解算" },
    ],
    inputs: [{ id: "in6", label: "到达3号工位", color: "#262626", data: "station=3,cloth=ready" }],
    outputs: [{ id: "out6", label: "打包完成", color: "#262626", data: "pack_status=done" }],
    x: 1240,
    y: 105
  },
  {
    id: "node7",
    title: "安全人机交接",
    icon: MessageSquare,
    color: "#262626",
    status: "pending",
    configText: "动作: 递送给观众",
    inputs: [{ id: "in7", label: "打包完成", color: "#262626", data: "pack_status=done" }],
    x: 1590,
    y: 185
  },
]

function ComponentSidebar() {
  const [expanded, setExpanded] = useState<string[]>(["io", "perception", "planning", "execution"])
  const [searchQuery, setSearchQuery] = useState("")

  const toggleCategory = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <div className="w-[220px] bg-white border-r border-[#E5E7EB] flex flex-col">
      <div className="px-3 py-3 border-b border-[#E5E7EB]">
        <h3 className="text-[12px] font-medium text-[#374151] mb-2">任务节点库</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="搜索任务节点..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-7 pl-8 pr-3 text-[11px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-md focus:border-[#262626] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {componentCategories.map((category) => (
          <div key={category.id} className="mb-1">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
            >
              {expanded.includes(category.id) ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
              )}
              <category.icon className="w-3.5 h-3.5" style={{ color: category.color }} />
              <span>{category.title}</span>
            </button>

            {expanded.includes(category.id) && (
              <div className="pl-4 pr-2 space-y-0.5">
                {category.items.map((item, idx) => (
                  <div
                    key={idx}
                    draggable
                    className="flex items-center gap-2 px-2 py-1.5 text-[11px] text-[#6B7280] hover:bg-[#F3F4F6] rounded cursor-grab active:cursor-grabbing transition-colors group"
                  >
                    <GripVertical className="w-3 h-3 text-[#D1D5DB] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div 
                      className="w-1 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }} 
                    />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-[#E5E7EB]">
        <button className="w-full flex items-center justify-center gap-1.5 h-8 text-[11px] text-[#6B7280] border border-dashed border-[#E5E7EB] rounded-lg hover:border-[#262626] hover:text-[#374151] transition-colors">
          <Wrench className="w-3.5 h-3.5" />
          新建自定义节点
        </button>
      </div>
    </div>
  )
}

function FlowNodeCard({
  node,
  onDragStart,
}: {
  node: FlowNode
  onDragStart?: (event: ReactMouseEvent<HTMLDivElement>, node: FlowNode) => void
}) {
  const statusIcons = {
    completed: <Check className="w-3 h-3" />,
    running: <Loader2 className="w-3 h-3 animate-spin" />,
    pending: <div className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
  }

  const statusColors = {
    completed: "text-green-500 bg-green-50",
    running: "text-blue-500 bg-blue-50",
    pending: "text-[#9CA3AF] bg-[#F3F4F6]"
  }

  return (
    <div 
      className={cn(
        "absolute bg-white rounded-2xl border shadow-[0_2px_10px_rgba(17,24,39,0.08)] transition-shadow hover:shadow-[0_10px_24px_rgba(17,24,39,0.14)]",
        node.isAgent ? "w-[390px] border-[#8B5CF6]" : "w-[260px] border-[#E5E7EB]",
        node.status === "running" && "shadow-[0_12px_30px_rgba(99,102,241,0.16)]"
      )}
      style={{ left: node.x, top: node.y }}
    >
      {/* Node Header */}
      <div className={cn(
        "flex items-center justify-between gap-2 px-3 py-2.5 border-b rounded-t-2xl cursor-grab active:cursor-grabbing select-none",
        node.isAgent ? "border-[#C4B5FD] bg-[#F5F3FF]" : "border-[#E5E7EB] bg-[#FCFCFD]"
      )} onMouseDown={(event) => onDragStart?.(event, node)}>
        <div className="flex min-w-0 flex-1 items-center gap-2 pr-1">
          <div 
            className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${node.color}15`, color: node.color }}
          >
            <node.icon className="w-4 h-4" />
          </div>
          <span className="truncate whitespace-nowrap text-[13px] font-semibold leading-none text-[#344054]">
            {node.title}
          </span>
        </div>
        {node.status === "pending" ? (
          <div className="h-7 w-12 shrink-0 rounded-full bg-[#EAECF0] p-1">
            <div className="h-5 w-5 rounded-full bg-[#D0D5DD]" />
          </div>
        ) : (
          <div className={cn(
            "shrink-0 whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium",
            statusColors[node.status]
          )}>
            {statusIcons[node.status]}
            {node.status === "completed" && "完成"}
            {node.status === "running" && "运行中"}
          </div>
        )}
      </div>

      {/* Node Content */}
      <div className="p-3 space-y-2">
        {node.description && <p className="text-[11px] leading-[1.45] text-[#667085]">{node.description}</p>}
        {node.configText && (
          <div className="rounded-lg bg-[#F8FAFC] border border-[#E4E7EC] px-2.5 py-2 text-[11px] text-[#475467]">
            {node.configText}
          </div>
        )}
        
        {node.isAgent && node.fields && (
          <div className="space-y-2 pt-1">
            {node.fields.map((field, idx) => (
              <div key={idx}>
                <label className="text-[11px] text-[#667085] mb-1 block">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                {field.type === "dropdown" ? (
                  <div className="relative">
                    <select className="w-full h-10 px-2.5 pr-8 text-[12px] bg-[#F8FAFC] border border-[#D0D5DD] rounded-lg appearance-none focus:border-[#8B5CF6] focus:outline-none">
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3] pointer-events-none" />
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea 
                    defaultValue={field.value}
                    className="w-full h-20 px-2.5 py-2 text-[12px] leading-[1.45] bg-[#F8FAFC] border border-[#D0D5DD] rounded-lg resize-none focus:border-[#8B5CF6] focus:outline-none"
                  />
                ) : (
                  <input 
                    type="text"
                    defaultValue={field.value}
                    className="w-full h-10 px-2.5 text-[12px] bg-[#F8FAFC] border border-[#D0D5DD] rounded-lg focus:border-[#8B5CF6] focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-2 border-t border-[#EAECF0] pt-3">
          {node.inputs && node.inputs.length > 0 && (
            <div>
              <p className="mb-1 text-[11px] font-medium text-[#475467]">输入</p>
              <div className="space-y-1.5">
                {node.inputs.map((input) => (
                  <div key={input.id} className="rounded-lg border border-[#EAECF0] bg-[#FCFCFD] px-2.5 py-2">
                    <p className="text-[10px] font-medium text-[#344054]">{input.label}</p>
                    {input.data && <p className="text-[10px] text-[#667085]">{input.data}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {node.outputs && node.outputs.length > 0 && (
            <div>
              <p className="mb-1 text-[11px] font-medium text-[#475467]">输出</p>
              <div className="space-y-1.5">
                {node.outputs.map((output) => (
                  <div key={output.id} className="rounded-lg border border-[#EAECF0] bg-[#FCFCFD] px-2.5 py-2">
                    <p className="text-[10px] font-medium text-[#344054]">{output.label}</p>
                    {output.data && <p className="text-[10px] text-[#667085]">{output.data}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Ports */}
      {node.inputs && (
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 space-y-2">
          {node.inputs.map((input) => (
            <div key={input.id} className="group relative flex h-7 w-7 items-center justify-center">
              <div 
                className="h-3.5 w-3.5 rounded-full border-2 bg-white shadow-sm transition-all group-hover:scale-110 group-hover:shadow-md"
                style={{ borderColor: input.color }}
              />
              <span className="pointer-events-none absolute left-8 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-[#E5E7EB] bg-white px-2 py-1 text-[10px] text-[#475467] shadow-sm group-hover:block">
                {input.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Output Ports */}
      {node.outputs && (
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 space-y-2">
          {node.outputs.map((output) => (
            <div key={output.id} className="group relative flex h-7 w-7 items-center justify-center">
              <div 
                className="h-3.5 w-3.5 rounded-full border-2 bg-white shadow-sm transition-all group-hover:scale-110 group-hover:shadow-md"
                style={{ borderColor: output.color }}
              />
              <span className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-[#E5E7EB] bg-white px-2 py-1 text-[10px] text-[#475467] shadow-sm group-hover:block">
                {output.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface PageNodeOrchestrationProps {
  mode: "edit" | "run"
  taskName: string
  onRunTask?: (taskName: string) => void
}

export function PageNodeOrchestration({
  mode,
  taskName,
  onRunTask,
}: PageNodeOrchestrationProps) {
  const isRunMode = mode === "run"
  const tabLabel = isRunMode ? "运行 - 定制充电宝柔性产线.task" : "编辑 - 定制充电宝柔性产线.task"
  const [nodes, setNodes] = useState(flowNodes)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const canvasSize = { width: 2200, height: 900 }
  const nodeWidth = (node: FlowNode) => (node.isAgent ? 390 : 260)

  const connections = [
    { from: "node1", to: "node2" },
    { from: "node2", to: "node3" },
    { from: "node3", to: "node4" },
    { from: "node4", to: "node5" },
    { from: "node5", to: "node6" },
    { from: "node6", to: "node7" },
  ]

  const handleNodeDragStart = (event: ReactMouseEvent<HTMLDivElement>, node: FlowNode) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const cursorX = (event.clientX - rect.left + canvasRef.current.scrollLeft) / zoom
    const cursorY = (event.clientY - rect.top + canvasRef.current.scrollTop) / zoom
    dragOffsetRef.current = {
      x: cursorX - node.x,
      y: cursorY - node.y,
    }
    setDraggingNodeId(node.id)
  }

  useEffect(() => {
    if (!draggingNodeId) return

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const cursorX = (event.clientX - rect.left + canvasRef.current.scrollLeft) / zoom
      const cursorY = (event.clientY - rect.top + canvasRef.current.scrollTop) / zoom
      const nextX = cursorX - dragOffsetRef.current.x
      const nextY = cursorY - dragOffsetRef.current.y

      setNodes((prev) =>
        prev.map((node) =>
          node.id === draggingNodeId
            ? { ...node, x: Math.max(16, nextX), y: Math.max(16, nextY) }
            : node
        )
      )
    }

    const handleMouseUp = () => setDraggingNodeId(null)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [draggingNodeId, zoom])

  const getConnectionPath = (fromId: string, toId: string) => {
    const fromNode = nodes.find((n) => n.id === fromId)
    const toNode = nodes.find((n) => n.id === toId)
    if (!fromNode || !toNode) return null

    const startX = fromNode.x + nodeWidth(fromNode) + 10
    const startY = fromNode.y + 90
    const endX = toNode.x - 10
    const endY = toNode.y + 90
    const controlOffset = Math.max(36, (endX - startX) * 0.45)
    const color = fromNode.outputs?.[0]?.color ?? "#8B5CF6"

    return {
      d: `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`,
      color,
    }
  }

  const zoomIn = () => setZoom((prev) => Math.min(2, +(prev + 0.1).toFixed(2)))
  const zoomOut = () => setZoom((prev) => Math.max(0.5, +(prev - 0.1).toFixed(2)))

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#F9FAFB]">
      {!isRunMode && <ComponentSidebar />}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
      <div className="h-12 bg-transparent border-b border-[#E5E7EB] flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F3F4F6] rounded text-[11px] text-[#374151] border-b-2 border-[#262626]">
              {isRunMode ? <Play className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
              <span>{tabLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-[#6B7280] hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              清空画布
            </button>
            {isRunMode ? (
              <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                任务运行中
              </div>
            ) : (
              <button
                onClick={() => onRunTask?.(taskName)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-medium bg-[#262626] text-white rounded-lg hover:bg-[#404040] transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                打开运行页
              </button>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-auto"
          style={{
            backgroundImage: 'radial-gradient(circle, #D1D5DB 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        >
          <div
            className="relative"
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              transform: `scale(${zoom})`,
              transformOrigin: "0 0",
            }}
          >
            {/* Connection Lines - SVG */}
            <svg className="absolute inset-0 pointer-events-none" style={{ width: canvasSize.width, height: canvasSize.height }}>
              {connections.map((connection) => {
                const path = getConnectionPath(connection.from, connection.to)
                if (!path) return null
                return (
                  <path
                    key={`${connection.from}-${connection.to}`}
                    d={path.d}
                    fill="none"
                    stroke={path.color === "#2563EB" ? "#8B5CF6" : "#3B82F6"}
                    strokeWidth="3"
                    strokeDasharray="8 8"
                  />
                )
              })}
            </svg>

            {/* Flow Nodes */}
            {nodes.map((node) => (
              <FlowNodeCard key={node.id} node={node} onDragStart={handleNodeDragStart} />
            ))}
          </div>

          {isRunMode && (
            <div className="absolute right-4 top-4 w-[320px] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
                <div>
                  <p className="text-[12px] font-medium text-[#111827]">环境观测窗口</p>
                  <p className="mt-1 text-[10px] text-[#6B7280]">用于观察机器人任务执行情况</p>
                </div>
                <div className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
                  Live
                </div>
              </div>
              <div className="bg-[#0F172A] p-3">
                <img
                  src="/placeholder.jpg"
                  alt="环境任务执行占位图"
                  className="h-[180px] w-full rounded-xl object-cover opacity-90"
                />
              </div>
            </div>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white rounded-lg border border-[#E5E7EB] p-1">
            <button
              onClick={zoomIn}
              className="w-7 h-7 flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6] rounded transition-colors"
            >
              +
            </button>
            <span className="px-2 text-[10px] text-[#6B7280]">{Math.round(zoom * 100)}%</span>
            <button
              onClick={zoomOut}
              className="w-7 h-7 flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6] rounded transition-colors"
            >
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
