"use client"

import { useState } from "react"
import { Search, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Asset {
  name: string
  category: string
}

const assets: Asset[] = [
  { name: "饮水机", category: "饮品设备" },
  { name: "意式咖啡机", category: "饮品设备" },
  { name: "纸杯堆", category: "杯具道具" },
  { name: "马克杯", category: "杯具道具" },
  { name: "茶叶盒", category: "杯具道具" },
  { name: "奶茶杯", category: "杯具道具" },
  { name: "保温杯", category: "杯具道具" },
  { name: "玻璃杯", category: "杯具道具" },
]

const categories = ["全部", "家具", "饮品设备", "杯具道具"]

interface AssetDrawerProps {
  onClose?: () => void
}

export function AssetDrawer({ onClose }: AssetDrawerProps) {
  const [activeCategory, setActiveCategory] = useState("杯具道具")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = activeCategory === "全部" || asset.category === activeCategory
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-card border-t border-border rounded-t-xl shadow-lg flex flex-col z-10">
      {/* Drawer Handle */}
      <div className="flex items-center justify-center py-2 border-b border-border">
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
      </div>
      
      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索办公室饮品角资源..."
            className="w-full h-10 pl-10 pr-4 text-[13px] bg-muted border border-transparent rounded-lg focus:border-primary focus:outline-none placeholder:text-muted-foreground"
          />
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted-foreground/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="px-4 flex items-center gap-2 border-b border-border pb-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors",
              activeCategory === category
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Asset Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-4 gap-3">
          {filteredAssets.map((asset, index) => (
            <AssetGridCard key={index} name={asset.name} />
          ))}
        </div>
      </div>
    </div>
  )
}

function AssetGridCard({ name }: { name: string }) {
  return (
    <div className="group flex flex-col bg-muted rounded-lg border border-border hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer overflow-hidden">
      {/* Thumbnail */}
      <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
        <div className="w-12 h-12 bg-slate-300 rounded-lg" />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-[10px] text-primary font-medium px-2 py-1 bg-white/90 rounded">点击添加</span>
        </div>
      </div>
      {/* Label */}
      <div className="p-2 text-center">
        <p className="text-[11px] text-foreground truncate">{name}</p>
      </div>
    </div>
  )
}
