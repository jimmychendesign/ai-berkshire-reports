"use client"

import { Pause, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface ValidationCard {
  id: number
  label: string
  status: "creating" | "running" | "success" | "failed"
  scene: string
}

const validationCards: ValidationCard[] = [
  { id: 1, label: "环境01", status: "running", scene: "标准纸盒与魔术布" },
  { id: 2, label: "环境02", status: "running", scene: "魔术布初始形变干扰" },
  { id: 3, label: "环境03", status: "failed", scene: "充电宝尺寸变量" },
  { id: 4, label: "环境04", status: "running", scene: "传送带微小抖动" },
  { id: 5, label: "环境05", status: "creating", scene: "抓取点随机偏移" },
  { id: 6, label: "环境06", status: "success", scene: "盒型切换回归" },
  { id: 7, label: "环境07", status: "running", scene: "缓冲台遮挡" },
  { id: 8, label: "环境08", status: "creating", scene: "输送速度上调" },
  { id: 9, label: "环境09", status: "success", scene: "软袋干涉测试" },
  { id: 10, label: "环境10", status: "running", scene: "相机视角偏移" },
  { id: 11, label: "环境11", status: "failed", scene: "末端姿态异常" },
  { id: 12, label: "环境12", status: "success", scene: "礼盒材质替换" },
  { id: 13, label: "环境13", status: "creating", scene: "侧边工位噪声" },
  { id: 14, label: "环境14", status: "running", scene: "工件堆叠干扰" },
  { id: 15, label: "环境15", status: "success", scene: "多机器人接力" },
  { id: 16, label: "环境16", status: "running", scene: "软布褶皱加剧" },
  { id: 17, label: "环境17", status: "creating", scene: "抓取时序抖动" },
  { id: 18, label: "环境18", status: "success", scene: "轻量化网格回归" },
  { id: 19, label: "环境19", status: "failed", scene: "碰撞文件缺失" },
  { id: 20, label: "环境20", status: "running", scene: "并行工位插单" },
  { id: 21, label: "环境21", status: "creating", scene: "托盘位姿扰动" },
  { id: 22, label: "环境22", status: "success", scene: "抓手摩擦力修正" },
  { id: 23, label: "环境23", status: "running", scene: "机器人换班模型" },
  { id: 24, label: "环境24", status: "success", scene: "视锥裁剪回归" },
]

const statusMap = {
  creating: { label: "创建场景中", badge: "bg-slate-500", tint: "border-slate-200 bg-slate-50" },
  running: { label: "运行中", badge: "bg-emerald-500", tint: "border-emerald-200 bg-emerald-50" },
  success: { label: "成功", badge: "bg-sky-500", tint: "border-sky-200 bg-sky-50" },
  failed: { label: "失败", badge: "bg-rose-500", tint: "border-rose-200 bg-rose-50" },
}

function ValidationThumbnail({ status }: { status: ValidationCard["status"] }) {
  return (
    <div
      className={cn(
        "relative h-[112px] overflow-hidden rounded-xl border bg-slate-100",
        statusMap[status].tint
      )}
    >
      <img
        src="/parallel-environment.jpeg"
        alt="并行环境预览"
        className="h-full w-full object-cover"
      />
    </div>
  )
}

function ValidationCardTile({ card }: { card: ValidationCard }) {
  return (
    <button className="group rounded-2xl border border-[#E5E7EB] bg-white p-3 text-left transition-colors hover:border-[#CBD5E1] hover:bg-[#FCFCFD]">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-medium text-[#111827]">{card.label}</div>
          <div className="mt-0.5 text-[10px] text-[#6B7280]">{card.scene}</div>
        </div>
        <span className={cn("mt-0.5 h-2.5 w-2.5 rounded-full", statusMap[card.status].badge)} />
      </div>

      <ValidationThumbnail status={card.status} />

      <div className="mt-2 flex items-center justify-between text-[10px] text-[#6B7280]">
        <span>{statusMap[card.status].label}</span>
        <span className="opacity-0 transition-opacity group-hover:opacity-100">查看关键节点</span>
      </div>
    </button>
  )
}

export function PageParallelValidation() {
  const counts = validationCards.reduce(
    (acc, card) => {
      acc[card.status] += 1
      return acc
    },
    { creating: 0, running: 0, success: 0, failed: 0 }
  )

  return (
    <div className="flex h-full flex-col">
      <div className="h-12 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F3F4F6] rounded text-[11px] text-[#374151] border-b-2 border-[#262626]">
            <span>柔性打包基准验证.task</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 rounded-lg bg-[#F3F4F6] px-3 py-1.5 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full bg-slate-500" />
              创建场景中 ({counts.creating})
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              运行中 ({counts.running})
            </span>
            <span className="flex items-center gap-1.5 text-sky-600">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              成功 ({counts.success})
            </span>
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              失败 ({counts.failed})
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors" title="暂停全部">
              <Pause className="w-4 h-4 text-[#6B7280]" />
            </button>
            <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors" title="重新运行">
              <RotateCcw className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-4 gap-3">
          {validationCards.map((card) => (
            <ValidationCardTile key={card.id} card={card} />
          ))}
        </div>
      </div>

      <div className="h-8 bg-white border-t border-[#E5E7EB] flex items-center justify-between px-4">
        <div className="flex items-center gap-4 text-[10px] text-[#6B7280]">
          <span>总环境数: 24</span>
          <span>|</span>
          <span>当前批次: 01</span>
          <span>|</span>
          <span>状态追踪模式</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-[10px] text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6] rounded transition-colors">
            导出报告
          </button>
        </div>
      </div>
    </div>
  )
}
