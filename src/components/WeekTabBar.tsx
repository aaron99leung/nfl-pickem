"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WeekTabBarItem {
  label: string;
  value: number | null;
}

interface WeekTabBarProps {
  items: WeekTabBarItem[];
  selected: number | null;
  onSelect: (value: number | null) => void;
  pageSize?: number;
}

export function WeekTabBar({ items, selected, onSelect, pageSize = 5 }: WeekTabBarProps) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const selectedIndex = items.findIndex((item) => item.value === selected);

  const [page, setPage] = useState(() => (selectedIndex >= 0 ? Math.floor(selectedIndex / pageSize) : 0));
  const [trackedIndex, setTrackedIndex] = useState(selectedIndex);

  if (selectedIndex !== trackedIndex) {
    setTrackedIndex(selectedIndex);
    if (selectedIndex >= 0) {
      setPage(Math.floor(selectedIndex / pageSize));
    }
  }

  const pageItems = items.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        {totalPages > 1 && (
          <div className="relative flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/30" />
            ))}
            <span
              className="absolute top-1/2 h-1.5 w-4 -translate-y-1/2 rounded-full bg-white transition-[left] duration-300 ease-out"
              style={{ left: `${page * 12 - 5}px` }}
            />
          </div>
        )}

        <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-zinc-900/95 p-1.5 shadow-xl backdrop-blur-md">
          <button
            type="button"
            aria-label="Previous tabs"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-20"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-1">
            {pageItems.map((item) => {
              const active = item.value === selected;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onSelect(item.value)}
                  className={cn(
                    "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150 hover:scale-105",
                    active ? "bg-zinc-800 text-white shadow-inner" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Next tabs"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-20"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
