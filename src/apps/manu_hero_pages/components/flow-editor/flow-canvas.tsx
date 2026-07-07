"use client"

import { useState, useRef, useEffect } from "react"
import { FlowNode, FlowNodeData } from "./flow-node"
import { 
  MessageSquare, 
  Coffee, 
  CupSoda, 
  Navigation, 
  Hand, 
  Milk,
  Eye,
  Sparkles,
  Database
} from "lucide-react"

// Connection line component
function ConnectionLine({ 
  startX, 
  startY, 
  endX, 
  endY,
  color = "#3B82F6"
}: { 
  startX: number
  startY: number
  endX: number
  endY: number
  color?: string
}) {
  const midX = (startX + endX) / 2
  
  const path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
  
  return (
    <path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={2}
      className="transition-all"
    />
  )
}

// Mock nodes for beverage shop scenario
const initialNodes: FlowNodeData[] = [
  {
    id: "order-input",
    type: "input",
    title: "订单输入",
    description: "接收并解析顾客的饮品订单请求",
    icon: <MessageSquare className="w-4 h-4 text-white" />,
    iconBgColor: "bg-blue-500",
    status: { time: "45毫秒", success: true },
    inputs: [],
    outputs: [
      { id: "order-data", label: "订单数据", type: "output", color: "blue", connected: true },
      { id: "customer-info", label: "顾客信息", type: "output", color: "green" },
    ],
    fields: [
      { label: "订单内容", value: "冰拿铁 + 珍珠", type: "text" },
    ],
    position: { x: 50, y: 80 }
  },
  {
    id: "recipe-lookup",
    type: "data",
    title: "配方数据库",
    description: "查询饮品配方和制作参数",
    icon: <Database className="w-4 h-4 text-white" />,
    iconBgColor: "bg-purple-500",
    status: { time: "23毫秒", success: true },
    inputs: [
      { id: "drink-type", label: "饮品类型", type: "input", color: "blue", required: true, connected: true },
    ],
    outputs: [
      { id: "recipe", label: "配方参数", type: "output", color: "purple", connected: true },
      { id: "ingredients", label: "原料列表", type: "output", color: "orange", connected: true },
    ],
    fields: [
      { label: "数据库", value: "饮品配方库", type: "select", options: ["饮品配方库", "原料库", "设备参数库"] },
    ],
    position: { x: 350, y: 40 }
  },
  {
    id: "cup-detect",
    type: "perception",
    title: "杯具识别",
    description: "识别并定位目标杯具的位置和类型",
    icon: <CupSoda className="w-4 h-4 text-white" />,
    iconBgColor: "bg-cyan-500",
    status: { time: "156毫秒", success: true },
    inputs: [
      { id: "camera-feed", label: "相机画面", type: "input", color: "blue", required: true },
      { id: "cup-type", label: "杯型要求", type: "input", color: "purple", connected: true },
    ],
    outputs: [
      { id: "cup-position", label: "杯具位置", type: "output", color: "green", connected: true },
      { id: "cup-info", label: "杯具信息", type: "output", color: "blue" },
    ],
    fields: [
      { label: "检测模型", value: "YOLOv8-cup", type: "select", options: ["YOLOv8-cup", "DETR-beverage", "自定义模型"] },
      { label: "置信度阈值", value: "0.85", type: "number" },
    ],
    position: { x: 350, y: 280 }
  },
  {
    id: "path-plan",
    type: "planning",
    title: "路径规划",
    description: "计算机械臂的最优运动路径",
    icon: <Navigation className="w-4 h-4 text-white" />,
    iconBgColor: "bg-green-500",
    status: { time: "89毫秒", success: true },
    inputs: [
      { id: "target-pos", label: "目标位置", type: "input", color: "green", required: true, connected: true },
      { id: "obstacles", label: "障碍物", type: "input", color: "red" },
    ],
    outputs: [
      { id: "trajectory", label: "运动轨迹", type: "output", color: "blue", connected: true },
    ],
    fields: [
      { label: "规划算法", value: "RRT*", type: "select", options: ["RRT*", "A*", "PRM", "CHOMP"] },
      { label: "安全距离", value: "50毫米", type: "text" },
    ],
    position: { x: 650, y: 160 }
  },
  {
    id: "gripper",
    type: "execution",
    title: "夹爪控制",
    description: "执行抓取和放置动作",
    icon: <Hand className="w-4 h-4 text-white" />,
    iconBgColor: "bg-orange-500",
    status: { time: "执行中", success: true },
    inputs: [
      { id: "motion-path", label: "运动路径", type: "input", color: "blue", required: true, connected: true },
      { id: "grip-force", label: "夹持力度", type: "input", color: "orange" },
    ],
    outputs: [
      { id: "grip-status", label: "执行状态", type: "output", color: "green", connected: true },
    ],
    fields: [
      { label: "夹持力度", value: "中等", type: "select", options: ["轻柔", "中等", "牢固"] },
      { label: "速度系数", value: "0.8", type: "number" },
    ],
    position: { x: 950, y: 100 }
  },
  {
    id: "pour-action",
    type: "execution",
    title: "倾倒动作",
    description: "控制液体倾倒的角度和流量",
    icon: <Milk className="w-4 h-4 text-white" />,
    iconBgColor: "bg-sky-500",
    status: { time: "待执行", success: true },
    inputs: [
      { id: "grip-done", label: "抓取完成", type: "input", color: "green", required: true, connected: true },
      { id: "pour-amount", label: "倾倒量", type: "input", color: "purple" },
    ],
    outputs: [
      { id: "pour-status", label: "倾倒状态", type: "output", color: "green" },
    ],
    fields: [
      { label: "目标容量", value: "300毫升", type: "text" },
      { label: "倾倒角度", value: "45度", type: "select", options: ["30度", "45度", "60度", "90度"] },
    ],
    position: { x: 950, y: 380 }
  },
]

// Connection definitions
const connections = [
  { from: { nodeId: "order-input", portId: "order-data" }, to: { nodeId: "recipe-lookup", portId: "drink-type" }, color: "#3B82F6" },
  { from: { nodeId: "recipe-lookup", portId: "recipe" }, to: { nodeId: "cup-detect", portId: "cup-type" }, color: "#8B5CF6" },
  { from: { nodeId: "cup-detect", portId: "cup-position" }, to: { nodeId: "path-plan", portId: "target-pos" }, color: "#10B981" },
  { from: { nodeId: "path-plan", portId: "trajectory" }, to: { nodeId: "gripper", portId: "motion-path" }, color: "#3B82F6" },
  { from: { nodeId: "gripper", portId: "grip-status" }, to: { nodeId: "pour-action", portId: "grip-done" }, color: "#10B981" },
]

interface FlowCanvasProps {
  className?: string
}

export function FlowCanvas({ className }: FlowCanvasProps) {
  const [nodes, setNodes] = useState(initialNodes)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  // Calculate connection line positions
  const getConnectionCoords = (fromNodeId: string, toNodeId: string) => {
    const fromNode = nodes.find(n => n.id === fromNodeId)
    const toNode = nodes.find(n => n.id === toNodeId)
    
    if (!fromNode || !toNode) return null

    // Approximate port positions (right side of from node, left side of to node)
    const startX = fromNode.position.x + 280 + 12 // node width + port offset
    const startY = fromNode.position.y + 140 // approximate center
    const endX = toNode.position.x - 12
    const endY = toNode.position.y + 100

    return { startX, startY, endX, endY }
  }

  return (
    <div 
      ref={canvasRef}
      className={`relative flex-1 overflow-hidden bg-muted ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle, #D1D5DB 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }}
    >
      {/* SVG layer for connections */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)` }}
      >
        {connections.map((conn, index) => {
          const coords = getConnectionCoords(conn.from.nodeId, conn.to.nodeId)
          if (!coords) return null
          return (
            <ConnectionLine
              key={index}
              startX={coords.startX}
              startY={coords.startY}
              endX={coords.endX}
              endY={coords.endY}
              color={conn.color}
            />
          )
        })}
      </svg>

      {/* Nodes layer */}
      <div 
        className="absolute inset-0"
        style={{ transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)` }}
      >
        {nodes.map((node) => (
          <FlowNode
            key={node.id}
            node={node}
            selected={selectedNodeId === node.id}
            onSelect={() => setSelectedNodeId(node.id)}
            onDelete={() => setNodes(nodes.filter(n => n.id !== node.id))}
          />
        ))}
      </div>

      {/* Canvas controls */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 bg-card rounded-lg border border-border shadow-sm p-1">
        <button 
          className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
          onClick={() => setScale(Math.min(scale + 0.1, 2))}
        >
          <span className="text-lg">+</span>
        </button>
        <button 
          className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
          onClick={() => setScale(Math.max(scale - 0.1, 0.5))}
        >
          <span className="text-lg">-</span>
        </button>
        <div className="h-px bg-border my-1" />
        <button 
          className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground text-[10px]"
          onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }}
        >
          重置
        </button>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 left-16 bg-card rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground">
        {Math.round(scale * 100)}%
      </div>
    </div>
  )
}
