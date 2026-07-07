"use client"

import { useMemo, useState } from "react"
import { Bot, FileCheck2, Loader2, Paperclip, Send, Sparkles, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const creationModes = [
  {
    id: "preset",
    label: "sudo预制库",
    description: "复用标准工位模板，快速补齐基础布局与默认设备。",
  },
  {
    id: "local",
    label: "本地导入",
    description: "导入 CAD / BIM / 机器人文件，并自动转换预览与碰撞资源。",
  },
  {
    id: "ai",
    label: "AI 生成",
    description: "直接描述产线目标，由助手生成场景草案与关键对象配置。",
  },
] as const

const supportedFormats = [".STL", ".DAE", ".OBJ", ".GLB", ".GLTF", ".URDF"]

const environmentMessages = [
  {
    id: "1",
    role: "assistant" as const,
    content: "环境是由一个 scene、一些 objects，以及一个或多个 robots 组成的。你可以继续补充场景布局、设备和机器人配置，我会一起生成。",
  },
  {
    id: "2",
    role: "assistant" as const,
    content: "当前已经识别到本地 BIM 文件，正在转换为 GLB 预览。如果你愿意，我也可以帮你自动补一个 collision file。",
  },
  {
    id: "3",
    role: "user" as const,
    content: "场景里保留传送带和包装台，再加一台 UR10e 和一个待抓取礼盒。",
  },
]

const taskMessages = [
  {
    id: "1",
    role: "user" as const,
    content:
      "帮我编排一条柔性生产线：1号工位识别并泛化抓取对应外壳放到小车；2号工位进行亚毫米级精度的拼接装配；3号机器人用五指灵巧手对魔术布进行折叠打包、盖盒，最后安全递送给观众。",
  },
  {
    id: "2",
    role: "assistant" as const,
    content:
      "已为您生成包含 7 个关键业务节点的柔性装配工作流。对于第 3 号工位的复杂操作，已自动配置【Agent 柔性打包】大模型节点。提示：由于柔性材料易变性，您可以在运行前，用鼠标悬停该节点，手动插入【软体力控参数微调】节点以确保折叠精度。",
  },
]

interface CADImportCopilotPanelProps {
  variant?: "environment" | "task"
}

export function CADImportCopilotPanel({
  variant = "environment",
}: CADImportCopilotPanelProps) {
  const [chatInput, setChatInput] = useState("")
  const messages = variant === "task" ? taskMessages : environmentMessages

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F6]">
          <Bot className="h-4 w-4 text-[#262626]" />
        </div>
        <div>
          <p className="text-[12px] font-medium text-[#262626]">AI 助手</p>
          <p className="text-[10px] text-[#6B7280]">统一处理环境、任务与验证相关操作</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[92%] rounded-2xl px-3 py-2.5 text-[11px] leading-5",
                message.role === "user"
                  ? "bg-[#262626] text-white"
                  : "border border-[#E5E7EB] bg-[#F9FAFB] text-[#374151]"
              )}
            >
              {message.content}
              {variant === "task" && message.role === "assistant" && (
                <div className="mt-3">
                  <button className="rounded-xl bg-[#262626] px-4 py-2 text-[11px] font-medium text-white hover:bg-[#404040]">
                    试运行流水线
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {variant === "environment" && (
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-[#FCFCFD] p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-medium text-[#6B7280]">
              <Sparkles className="h-3.5 w-3.5" />
              推荐提示
            </div>
            <div className="space-y-2 text-[11px] text-[#374151]">
              <button className="w-full rounded-xl bg-white px-3 py-2 text-left hover:bg-[#F9FAFB]">
                创建一个带双传送带、缓存台和两台机器人协同抓取的环境
              </button>
              <button className="w-full rounded-xl bg-white px-3 py-2 text-left hover:bg-[#F9FAFB]">
                根据当前 BIM 自动补齐默认 objects，并把碰撞文件一并生成
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[#E5E7EB] p-3">
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
          <Paperclip className="h-3.5 w-3.5 text-[#9CA3AF]" />
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={
              variant === "task"
                ? "帮我编排一条柔性生产线的完整工作流..."
                : "描述你想要的场景、任务或验证需求..."
            }
            className="h-6 flex-1 bg-transparent text-[11px] text-[#374151] outline-none placeholder:text-[#9CA3AF]"
          />
          <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#262626] text-white hover:bg-[#404040]">
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function CADImportContent() {
  const [creationMode, setCreationMode] = useState<(typeof creationModes)[number]["id"]>("local")
  const [environmentName, setEnvironmentName] = useState("包装产线演示环境")
  const progress = 72
  const activeMode = creationModes.find((mode) => mode.id === creationMode) ?? creationModes[1]

  const progressLabel = useMemo(() => {
    if (progress < 100) {
      return `Converting BIM to GLB... ${progress}%`
    }

    return "GLB 预览已生成"
  }, [progress])

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden p-8">
      <div className="mx-auto w-full max-w-4xl rounded-[28px] border border-[#E5E7EB] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="border-b border-[#E5E7EB] px-8 py-5">
          <div className="flex flex-col gap-4">
            <div className="min-w-0">
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#9CA3AF]">
                Create Environment / 环境名称
              </label>
              <input
                value={environmentName}
                onChange={(e) => setEnvironmentName(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-[16px] font-semibold text-[#111827] outline-none transition-colors focus:border-[#262626]"
              />
            </div>

            <Tabs
              value={creationMode}
              onValueChange={(value) => setCreationMode(value as (typeof creationModes)[number]["id"])}
              className="gap-3"
            >
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <TabsList className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-1 lg:w-auto">
                  {creationModes.map((mode) => (
                    <TabsTrigger
                      key={mode.id}
                      value={mode.id}
                      className="rounded-lg px-4 text-[12px] font-medium text-[#6B7280] data-[state=active]:border-[#262626] data-[state=active]:bg-white data-[state=active]:text-[#111827]"
                    >
                      {mode.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <p className="text-[11px] leading-5 text-[#6B7280] lg:max-w-[360px] lg:text-right">
                  {activeMode.description}
                </p>
              </div>
            </Tabs>
          </div>
        </div>

        <div className="grid gap-8 px-8 py-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FBFCFE] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-medium text-[#111827]">本地导入文件</p>
                  <p className="mt-1 text-[11px] text-[#6B7280]">
                    支持 {supportedFormats.join("、")} 格式文件导入。
                  </p>
                </div>
                <div className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-medium text-[#4F46E5]">
                  转换中
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
                  <div className="mb-1 text-[10px] uppercase tracking-[0.16em] text-[#9CA3AF]">Scene Name</div>
                  <div className="text-[13px] font-medium text-[#111827]">包装产线主场景</div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-[#D1FAE5] bg-[#F0FDF4] px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCFCE7]">
                    <FileCheck2 className="h-5 w-5 text-[#16A34A]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#6B7280]">选中的场景文件</div>
                    <div className="truncate text-[13px] font-medium text-[#111827]">3号工位_包装产线结构.step</div>
                    <div className="mt-1 text-[11px] text-[#16A34A]">12.4 MB · 正在转换，暂不可删除</div>
                  </div>
                  <button
                    disabled
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#9CA3AF] opacity-60"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F4F6]">
                    <Loader2 className="h-5 w-5 animate-spin text-[#6B7280]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#9CA3AF]">碰撞文件</div>
                    <div className="truncate text-[13px] font-medium text-[#111827]">packaging_line_collision.usd</div>
                    <div className="mt-1 text-[11px] text-[#6B7280]">自动生成中，用于后续碰撞检测与物理推演</div>
                  </div>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#0F172A]">
              <div className="border-b border-white/10 px-4 py-3">
                <p className="text-[12px] font-medium text-white">转换预览</p>
                <p className="mt-1 text-[11px] text-slate-300">{progressLabel}</p>
              </div>
              <div className="flex flex-col gap-4 p-4">
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${progress}%` }} />
                </div>

                <div className="relative flex h-[232px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-[linear-gradient(180deg,#111827_0%,#020617_100%)]">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-55"
                    style={{ backgroundImage: "url('/factory-sim-empty.png')" }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.16),rgba(2,6,23,0.64))]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12)_0%,rgba(2,6,23,0.52)_100%)]" />
                  <div className="relative rounded-2xl border border-white/10 bg-slate-950/35 px-5 py-4 text-center shadow-[0_16px_40px_rgba(2,6,23,0.28)] backdrop-blur-[2px]">
                    <p className="text-[11px] text-slate-300">转换完成后自动刷新预览</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button className="h-11 rounded-xl border border-[#E5E7EB] px-5 text-[12px] font-medium text-[#6B7280] hover:bg-[#F9FAFB]">
                取消
              </button>
              <button className="h-11 rounded-xl bg-[#262626] px-5 text-[12px] font-medium text-white hover:bg-[#404040]">
                创建环境
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
