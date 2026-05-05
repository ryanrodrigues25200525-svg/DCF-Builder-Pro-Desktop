import React from "react";
import { cn } from "@/core/utils/cn";
import { ReverseBridge } from "./types";
import { HistoricalData } from "@/core/types";
import { formatDisplayCompactCurrency, formatDisplayShareValue } from "@/core/utils/financial-format";

interface ValuationBridgeProps {
  targetPriceInput: string;
  setTargetPriceInput: (value: string) => void;
  bridge: ReverseBridge | null;
  isDarkMode?: boolean;
  historicals: HistoricalData;
}

export function ValuationBridge({
  targetPriceInput,
  setTargetPriceInput,
  bridge,
  isDarkMode,
  historicals,
}: ValuationBridgeProps) {
  return (
    <aside className="mt-8 self-start 2xl:mt-0">
      <div
        className={cn(
          "overflow-hidden rounded-[28px] border shadow-[0_18px_40px_rgba(15,23,42,0.06)]",
          isDarkMode
            ? "border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]"
            : "border-[rgba(76,140,255,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(239,246,255,0.9))]"
        )}
      >
        {!isDarkMode && (
          <div className="h-[4px] bg-[linear-gradient(90deg,#3b82f6_0%,#60a5fa_45%,rgba(96,165,250,0.12)_100%)]" />
        )}

        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3.5">
            <div>
              <p className={cn("text-[18px] font-black uppercase tracking-[0.2em]", isDarkMode ? "text-white/50" : "text-[#7b818d]")}>
                Target Price
              </p>
              <p className={cn("mt-2 text-[12px] font-semibold uppercase tracking-[0.14em]", isDarkMode ? "text-white/55" : "text-[#5a6a82]")}>
                Valuation Bridge + Implied Equity Output
              </p>
            </div>

            <div
              className={cn(
                "rounded-2xl border px-3.5 py-3.5",
                isDarkMode
                  ? "border-white/10 bg-white/3"
                  : "border-[rgba(76,140,255,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,246,255,0.88))]"
              )}
            >
              <p className={cn("text-[11px] font-black uppercase tracking-[0.15em]", isDarkMode ? "text-white/45" : "text-[#7b818d]")}>
                Set Cell
              </p>
              <input
                value={targetPriceInput}
                onChange={(e) => setTargetPriceInput(e.target.value)}
                className={cn(
                  "mt-2 w-full border-0 bg-transparent p-0 text-[42px] font-black tracking-[-0.03em] outline-none",
                  isDarkMode ? "text-white" : "text-[#0b0f18]"
                )}
              />
              <p className={cn("mt-2 text-[12px] leading-5", isDarkMode ? "text-white/58" : "text-[#627084]")}>
                Implied share price used for the reverse DCF solve.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { label: "Market", value: (historicals.price || 0).toFixed(2) },
                  { label: "-10%", value: ((historicals.price || 0) * 0.9).toFixed(2) },
                  { label: "+10%", value: ((historicals.price || 0) * 1.1).toFixed(2) },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setTargetPriceInput(preset.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em]",
                      isDarkMode
                        ? "border-white/12 bg-white/3 text-white/70"
                        : "border-[rgba(76,140,255,0.14)] bg-white text-[#4e5f76] shadow-[0_8px_18px_rgba(15,23,42,0.04)]"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {bridge && (
              <div className={cn(
                "overflow-hidden rounded-2xl border",
                isDarkMode ? "border-white/10 bg-white/3" : "border-[rgba(15,23,42,0.08)] bg-white/96"
              )}>
                <div className={cn(
                  "grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em]",
                  isDarkMode ? "border-white/10 bg-white/2 text-white/48" : "border-[rgba(15,23,42,0.08)] bg-[#f8fbff] text-[#7b818d]"
                )}>
                  <span>Bridge Component</span>
                  <span>Value</span>
                </div>

                {[
                  ["Stage 1 PV", bridge.stageOnePv],
                  ["PV of terminal value", bridge.pvTerminalValue],
                  ["Enterprise value", bridge.enterpriseValue],
                  ["Net debt", bridge.netDebt],
                  ["Equity value", bridge.equityValue],
                ].map(([label, value], index, rows) => (
                  <div
                    key={label}
                    className={cn(
                      "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 text-[14px]",
                      index < rows.length - 1 && (isDarkMode ? "border-b border-white/10" : "border-b border-[rgba(15,23,42,0.08)]")
                    )}
                  >
                    <span className={cn("font-medium", isDarkMode ? "text-white/78" : "text-[#3f4c5f]")}>{label}</span>
                    <span className={cn("text-[15px] font-black tabular-nums", isDarkMode ? "text-white" : "text-[#0b0f18]")}>
                      ${formatDisplayCompactCurrency(Number(value))}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {bridge && (
              <div
                className={cn(
                  "flex items-center justify-between rounded-2xl border px-4 py-3.5",
                  isDarkMode
                    ? "border-sky-300/20 bg-[linear-gradient(90deg,rgba(191,219,254,0.92),rgba(219,234,254,0.84))] text-[#0f172a]"
                    : "border-[rgba(76,140,255,0.18)] bg-[linear-gradient(90deg,rgba(225,238,255,0.98),rgba(235,245,255,0.92))] text-[#0f172a]"
                )}
              >
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5f6f87]">Implied Output</p>
                  <span className="mt-1 block text-[18px] font-black tracking-tight">Implied share price</span>
                </div>
                <span className="text-[30px] font-black tabular-nums tracking-[-0.03em]">{formatDisplayShareValue(bridge.impliedSharePrice)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
