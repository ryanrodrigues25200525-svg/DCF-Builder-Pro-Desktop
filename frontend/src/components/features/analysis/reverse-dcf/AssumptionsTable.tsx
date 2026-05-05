import React from "react";
import { cn } from "@/core/utils/cn";
import { ReverseControlCard } from "./types";
import { getAssumptionNote } from "./utils";

interface AssumptionsTableProps {
  controlCards: ReverseControlCard[];
  isDarkMode?: boolean;
  onReset: () => void;
  onMethodChange: (method: "gordonGrowth" | "exitMultiple") => void;
  valuationMethod: "gordonGrowth" | "exitMultiple";
  status: "loading" | "idle" | "error";
}

export function AssumptionsTable({
  controlCards,
  isDarkMode,
  onReset,
  onMethodChange,
  valuationMethod,
  status,
}: AssumptionsTableProps) {
  return (
    <section className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className={cn("h-2.5 w-2.5 rounded-full", isDarkMode ? "bg-amber-400" : "bg-amber-500")} />
            <p className={cn("text-[13px] font-black uppercase tracking-[0.24em]", isDarkMode ? "text-white/45" : "text-[#7b818d]")}>
              Operational Inputs
            </p>
          </div>
          <h3 className={cn("mt-4 text-[26px] font-black tracking-[-0.02em]", isDarkMode ? "text-white" : "text-[#0b0f18]")}>
            Operating Assumptions
          </h3>
          <p className={cn("mt-3 max-w-[600px] text-[14px] leading-6 font-semibold", isDarkMode ? "text-white/60" : "text-[#64748b]")}>
            Configure the base-case assumptions for the reverse DCF calculations.
            The engine solves for the selected variable by iterating these inputs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className={cn("flex items-center rounded-full border p-1", isDarkMode ? "border-white/10 bg-white/4" : "border-[rgba(15,23,42,0.08)] bg-[#f1f5f9]")}>
            <button
              onClick={() => onMethodChange("gordonGrowth")}
              className={cn(
                "rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] transition-all",
                valuationMethod === "gordonGrowth"
                  ? isDarkMode ? "bg-white text-[#0f172a]" : "bg-white text-[#0f172a] shadow-sm"
                  : isDarkMode ? "text-white/50" : "text-[#7b818d]"
              )}
            >
              Gordon Growth
            </button>
            <button
              onClick={() => onMethodChange("exitMultiple")}
              className={cn(
                "rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] transition-all",
                valuationMethod === "exitMultiple"
                  ? isDarkMode ? "bg-white text-[#0f172a]" : "bg-white text-[#0f172a] shadow-sm"
                  : isDarkMode ? "text-white/50" : "text-[#7b818d]"
              )}
            >
              Exit Multiple
            </button>
          </div>
          <button
            onClick={onReset}
            className={cn(
              "rounded-full border px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] transition-all",
              isDarkMode
                ? "border-white/12 bg-white/4 text-white/70 hover:bg-white/8"
                : "border-[rgba(15,23,42,0.10)] bg-white text-[#4b5563] hover:bg-[#f9fafb] shadow-sm"
            )}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {controlCards.map((card) => (
          <div
            key={card.label}
            className={cn(
              "group relative overflow-hidden rounded-[24px] border px-4 py-4.5 transition-all duration-300",
              isDarkMode
                ? "border-white/10 bg-white/3 hover:border-white/20"
                : "border-[rgba(15,23,42,0.08)] bg-white hover:border-[rgba(15,23,42,0.16)] shadow-[0_8px_20px_rgba(15,23,42,0.03)]"
            )}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={cn("text-[10px] font-black uppercase tracking-[0.18em]", isDarkMode ? "text-white/45" : "text-[#7b818d]")}>
                  {card.label}
                </span>
                {card.readOnly && (
                  <span className={cn("rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-widest", isDarkMode ? "border-white/10 text-white/40" : "border-[rgba(15,23,42,0.1)] text-[#94a3b8]")}>
                    Solved
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1.5">
                {card.readOnly ? (
                  <span className={cn("text-[26px] font-black tabular-nums tracking-tight", isDarkMode ? "text-white/90" : "text-[#0b0f18]", status === "loading" && "animate-pulse")}>
                    {status === "loading" ? "..." : card.value}
                  </span>
                ) : (
                  <div className="flex items-baseline gap-1.5">
                    {card.stringInput ? (
                      <input
                        type="text"
                        value={card.value}
                        onChange={(e) => card.onChange(e.target.value)}
                        disabled={card.disabled}
                        className={cn(
                          "w-[120px] bg-transparent text-[26px] font-black tabular-nums tracking-tight outline-none",
                          isDarkMode ? "text-white" : "text-[#0b0f18]",
                          card.disabled && "opacity-50"
                        )}
                      />
                    ) : (
                      <input
                        type="number"
                        value={card.value}
                        onChange={(e) => card.onChange(parseFloat(e.target.value) || 0)}
                        disabled={card.disabled}
                        step="0.1"
                        className={cn(
                          "w-[80px] bg-transparent text-[26px] font-black tabular-nums tracking-tight outline-none",
                          isDarkMode ? "text-white" : "text-[#0b0f18]",
                          card.disabled && "opacity-50"
                        )}
                      />
                    )}
                    <span className={cn("text-[15px] font-bold", isDarkMode ? "text-white/40" : "text-[#94a3b8]")}>
                      {card.suffix}
                    </span>
                  </div>
                )}
              </div>

              <p className={cn("text-[11px] leading-relaxed transition-colors", isDarkMode ? "text-white/45 group-hover:text-white/60" : "text-[#8b93a1] group-hover:text-[#64748b]")}>
                {card.helperText || getAssumptionNote(card.label, !!card.readOnly)}
              </p>
            </div>

            {!card.readOnly && (
              <div className={cn("absolute bottom-0 left-0 h-[2px] w-0 bg-amber-500/50 transition-all duration-500 group-hover:w-full")} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
