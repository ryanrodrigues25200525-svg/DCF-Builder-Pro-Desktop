import React from "react";
import { cn } from "@/core/utils/cn";
import { ReverseDCFKey } from "@/services/dcf/reverse-dcf";
import { formatDisplayCurrency } from "@/core/utils/financial-format";
import { solveOptions, solveOptionColorMap, formatSolveValue, getSelectedResultDescription } from "./utils";

interface GoalSeekSelectorProps {
  selectedKey: ReverseDCFKey;
  onSelect: (key: ReverseDCFKey) => void;
  reverseResults: Partial<Record<ReverseDCFKey, number>>;
  isDarkMode?: boolean;
  valuationMethod: "gordonGrowth" | "exitMultiple";
  targetPrice: number;
  baseRevenue: number;
  status: "loading" | "idle" | "error";
}

export function GoalSeekSelector({
  selectedKey,
  onSelect,
  reverseResults,
  isDarkMode,
  valuationMethod,
  targetPrice,
  baseRevenue: _baseRevenue,
  status,
}: GoalSeekSelectorProps) {
  return (
    <div
      className={cn(
        "rounded-[32px] border px-4 py-4 sm:px-6 sm:py-6",
        isDarkMode
          ? "border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]"
          : "border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] shadow-[0_20px_40px_rgba(15,23,42,0.05)]"
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className={cn("h-2.5 w-2.5 rounded-full", isDarkMode ? "bg-amber-400" : "bg-amber-500")} />
            <p className={cn("text-[14px] font-black uppercase tracking-[0.24em]", isDarkMode ? "text-white/45" : "text-[#7b818d]")}>
              Reverse DCF Engine
            </p>
          </div>
          <h2 className={cn("mt-4 text-[32px] font-black tracking-[-0.03em] sm:text-[40px]", isDarkMode ? "text-white" : "text-[#0b0f18]")}>
            Implied Market Assumptions
          </h2>
          <p className={cn("mt-4 max-w-[620px] text-[15px] leading-7 font-semibold", isDarkMode ? "text-white/65" : "text-[#4b5565]")}>
            The market is pricing <span className={cn(isDarkMode ? "text-white" : "text-[#0b0f18]")}>${formatDisplayCurrency(targetPrice)}</span> per share.
            Based on current financials and {valuationMethod === "gordonGrowth" ? "perpetual growth" : "exit multiple"} logic, these are the implied requirements.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className={cn("flex flex-wrap items-center gap-2 rounded-xl border px-2 py-2", isDarkMode ? "border-white/10 bg-white/3" : "border-[rgba(15,23,42,0.06)] bg-[#f1f5f9]")}>
            {solveOptions.map((opt) => {
              const colors = solveOptionColorMap[opt.key];
              const isSelected = selectedKey === opt.key;
              const value = reverseResults[opt.key];
              const formattedValue = value != null ? formatSolveValue(opt.key, value) : "—";

              return (
                <button
                  key={opt.key}
                  onClick={() => onSelect(opt.key)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-lg border px-4 py-2.5 transition-all duration-300",
                    isSelected
                      ? `${colors.active} ${colors.activeBorder} shadow-[0_8px_16px_rgba(37,99,235,0.2)]`
                      : isDarkMode
                      ? "border-transparent bg-transparent hover:bg-white/5"
                      : "border-transparent bg-transparent hover:bg-white/50"
                  )}
                >
                  <span className={cn("text-[10px] font-black uppercase tracking-[0.12em]", isSelected ? colors.activeLabel : isDarkMode ? "text-white/45" : "text-[#7b818d]")}>
                    {opt.label}
                  </span>
                  <span className={cn("text-[15px] font-black tabular-nums tracking-tight", isSelected ? colors.activeText : isDarkMode ? "text-white" : "text-[#0b0f18]")}>
                    {status === "loading" ? "..." : formattedValue}
                  </span>
                </button>
              );
            })}
          </div>
          <p className={cn("px-1 text-[11px] font-medium italic", isDarkMode ? "text-white/40" : "text-[#8b93a1]")}>
            * Click to toggle the solve variable. All other assumptions remain static.
          </p>
        </div>
      </div>

      <div className={cn("mt-6 rounded-[22px] border px-6 py-5 transition-all duration-500", isDarkMode ? "border-white/12 bg-white/2" : "border-[rgba(15,23,42,0.06)] bg-white")}>
        <div className="flex items-center gap-4">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", solveOptionColorMap[selectedKey].inactiveTint)}>
            <div className={cn("h-4 w-4 rounded-full border-2 border-white/40", solveOptionColorMap[selectedKey].active)} />
          </div>
          <div className="flex-1">
            <p className={cn("text-[13px] font-black uppercase tracking-[0.18em]", isDarkMode ? "text-white/45" : "text-[#7b818d]")}>
              Target Analysis: {solveOptions.find(o => o.key === selectedKey)?.label}
            </p>
            <p className={cn("mt-1 text-[15px] font-bold", isDarkMode ? "text-white/80" : "text-[#334155]")}>
              {getSelectedResultDescription(selectedKey)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
