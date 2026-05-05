import React from "react";
import { cn } from "@/core/utils/cn";
import { ReverseWorksheetRow } from "./types";
import { formatDisplayCompactCurrency } from "@/core/utils/financial-format";

interface ForecastWorksheetProps {
  worksheetRows: ReverseWorksheetRow[];
  stageOnePv: number;
  isDarkMode?: boolean;
}

export function ForecastWorksheet({ worksheetRows, stageOnePv, isDarkMode }: ForecastWorksheetProps) {
  return (
    <section className="mt-12">
      <div className={cn(
        "relative rounded-[32px] border px-6 py-6 sm:px-8 sm:py-8",
        isDarkMode
          ? "border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]"
          : "border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] shadow-[0_20px_40px_rgba(15,23,42,0.05)]"
      )}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className={cn("h-2.5 w-2.5 rounded-full", isDarkMode ? "bg-amber-400" : "bg-amber-500")} />
              <p className={cn("text-[13px] font-black uppercase tracking-[0.24em]", isDarkMode ? "text-white/45" : "text-[#7b818d]")}>
                Cash Flow Detail
              </p>
            </div>
            <h3 className={cn("mt-4 text-[26px] font-black tracking-[-0.02em]", isDarkMode ? "text-white" : "text-[#0b0f18]")}>
              Stage 1 FCFF Projection
            </h3>
            <p className={cn("mt-4 max-w-[680px] text-[14px] leading-7 font-semibold", isDarkMode ? "text-amber-200/85" : "text-amber-800")}>
              Five-year forecast using the current reverse DCF setup and implied operating assumptions.
            </p>
          </div>
          <div
            className={cn(
              "relative w-full max-w-[500px] overflow-hidden rounded-[22px] border px-4 py-4 xl:ml-6",
              isDarkMode
                ? "border-white/12 bg-white/3 text-white"
                : "border-[rgba(245,158,11,0.16)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(255,247,235,0.98))] text-[#0b0f18] shadow-[0_16px_32px_rgba(15,23,42,0.06)]"
            )}
          >
            {!isDarkMode && (
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[4px] bg-[linear-gradient(90deg,#f59e0b_0%,#fbbf24_45%,rgba(251,191,36,0.15)_100%)]" />
            )}
            <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-stretch 2xl:justify-between">
              <div className="min-w-0 flex-1">
                <p className={cn("text-[11px] font-black uppercase tracking-[0.16em]", isDarkMode ? "text-white/50" : "text-[#7b818d]")}>
                  Stage 1 Present Value
                </p>
                <p className="mt-2 text-[30px] font-black tabular-nums tracking-[-0.03em] sm:text-[36px]">
                  ${formatDisplayCompactCurrency(stageOnePv)}
                </p>
                <p className={cn("mt-2 max-w-[280px] text-[12px] leading-5", isDarkMode ? "text-white/58" : "text-[#6b7280]")}>
                  Discounted sum of projected free cash flow across the five-year forecast horizon.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:min-w-[250px]">
                <div
                  className={cn(
                    "rounded-xl border px-3 py-3",
                    isDarkMode
                      ? "border-white/10 bg-white/4"
                      : "border-[rgba(245,158,11,0.14)] bg-white/88 shadow-[0_10px_20px_rgba(15,23,42,0.04)]"
                  )}
                >
                  <p className={cn("text-[10px] font-black uppercase tracking-[0.16em]", isDarkMode ? "text-white/45" : "text-[#7b818d]")}>
                    Years
                  </p>
                  <p className={cn("mt-2 text-[20px] font-black tabular-nums", isDarkMode ? "text-white" : "text-[#0b0f18]")}>5</p>
                  <p className={cn("mt-1 text-[11px]", isDarkMode ? "text-white/40" : "text-[#8b93a1]")}>Forecast rows</p>
                </div>
                <div
                  className={cn(
                    "rounded-xl border px-3 py-3",
                    isDarkMode
                      ? "border-white/10 bg-white/4"
                      : "border-[rgba(245,158,11,0.14)] bg-white/88 shadow-[0_10px_20px_rgba(15,23,42,0.04)]"
                  )}
                >
                  <p className={cn("text-[10px] font-black uppercase tracking-[0.16em]", isDarkMode ? "text-white/45" : "text-[#7b818d]")}>
                    Discounting
                  </p>
                  <p className={cn("mt-2 text-[20px] font-black tracking-[-0.03em]", isDarkMode ? "text-white" : "text-[#0b0f18]")}>Mid-Year</p>
                  <p className={cn("mt-1 text-[11px]", isDarkMode ? "text-white/40" : "text-[#8b93a1]")}>DCF convention</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cn(
          "mt-6 overflow-hidden rounded-[22px] border",
          isDarkMode ? "border-white/12 bg-white/3" : "border-[rgba(15,23,42,0.10)] bg-white"
        )}>
          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full table-fixed">
              <colgroup>
                <col className="w-[92px]" />
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr className={cn(isDarkMode ? "bg-white/2" : "bg-[#f8fafc]")}>
                  {["Year", "Revenue", "EBIT", "NOPAT", "D&A", "Capex", "Δ NWC", "FCFF"].map((header) => (
                    <th
                      key={header}
                      className={cn(
                        "px-4 py-4 text-[11px] font-black uppercase tracking-[0.16em]",
                        header === "Year" ? "text-left" : "text-right",
                        isDarkMode ? "text-white/50" : "text-[#7b818d]"
                      )}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {worksheetRows.map((row) => (
                  <tr key={row.year} className={cn("border-t", isDarkMode ? "border-white/10" : "border-[rgba(15,23,42,0.08)]")}>
                    <td className={cn("px-4 py-[15px] text-left text-[14px] font-black", isDarkMode ? "text-white" : "text-[#0b0f18]")}>{row.year}</td>
                    <td className={cn("px-4 py-[15px] text-right text-[14px] font-semibold tabular-nums", isDarkMode ? "text-white/88" : "text-[#111827]")}>${formatDisplayCompactCurrency(row.revenue)}</td>
                    <td className={cn("px-4 py-[15px] text-right text-[14px] font-semibold tabular-nums", isDarkMode ? "text-white/88" : "text-[#111827]")}>${formatDisplayCompactCurrency(row.ebit)}</td>
                    <td className={cn("px-4 py-[15px] text-right text-[14px] font-semibold tabular-nums", isDarkMode ? "text-white/88" : "text-[#111827]")}>${formatDisplayCompactCurrency(row.nopat)}</td>
                    <td className={cn("px-4 py-[15px] text-right text-[14px] font-semibold tabular-nums", isDarkMode ? "text-white/88" : "text-[#111827]")}>${formatDisplayCompactCurrency(row.depreciation)}</td>
                    <td className={cn("px-4 py-[15px] text-right text-[14px] font-semibold tabular-nums", isDarkMode ? "text-white/88" : "text-[#111827]")}>${formatDisplayCompactCurrency(row.capex)}</td>
                    <td className={cn("px-4 py-[15px] text-right text-[14px] font-semibold tabular-nums", row.nwcChange < 0 ? "text-[#f87171]" : isDarkMode ? "text-white/88" : "text-[#111827]")}>${formatDisplayCompactCurrency(row.nwcChange)}</td>
                    <td className={cn("px-4 py-[15px] text-right text-[14px] font-black tabular-nums", isDarkMode ? "text-white" : "text-[#0b0f18]")}>${formatDisplayCompactCurrency(row.fcff)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={cn(
            "flex flex-col gap-4 border-t px-4 py-4 lg:flex-row lg:items-center lg:justify-between",
            isDarkMode ? "border-white/10 text-white" : "border-[rgba(15,23,42,0.08)] text-[#0b0f18]"
          )}>
            <div className="flex flex-col gap-1">
              <span className={cn("text-[13px] font-semibold", isDarkMode ? "text-white/72" : "text-[#4b5565]")}>
                Stage 1 present value flows directly into the valuation bridge.
              </span>
              <p className={cn("text-[12px]", isDarkMode ? "text-white/50" : "text-[#7b818d]")}>
                Five projected years, discounted using the current reverse DCF setup.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em]",
                  isDarkMode
                    ? "border-white/12 bg-white/4 text-white/78"
                    : "border-[rgba(245,158,11,0.18)] bg-[rgba(255,251,235,0.95)] text-[#9a5b00]"
                )}
              >
                Included Above
              </span>
              <span className={cn("text-[20px] font-black tabular-nums tracking-tight", isDarkMode ? "text-white" : "text-[#0b0f18]")}>
                ${formatDisplayCompactCurrency(stageOnePv)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
