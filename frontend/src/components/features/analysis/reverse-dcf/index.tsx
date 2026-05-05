import React from "react";
import { ReverseDCFProps, ReverseControlCard } from "./types";
import { useReverseDCFEngine } from "./useReverseDCFEngine";
import { GoalSeekSelector } from "./GoalSeekSelector";
import { AssumptionsTable } from "./AssumptionsTable";
import { ForecastWorksheet } from "./ForecastWorksheet";
import { ValuationBridge } from "./ValuationBridge";
import { formatSolveValue } from "./utils";

export default function ReverseDCF({ historicals, assumptions, overrides, isDarkMode }: ReverseDCFProps) {
  const {
    selectedKey,
    setSelectedKey,
    targetPriceInput,
    setTargetPriceInput,
    valuationMethod,
    setValuationMethod,
    status,
    reverseResults,
    worksheetRows,
    stageOnePv,
    bridge,
    targetPrice,
    localBaseRevenue,
    localEbitMargin,
    localTaxRate,
    localWacc,
    localTerminalGrowth,
    localExitMultiple,
    setLocalBaseRevenue,
    setLocalEbitMargin,
    setLocalTaxRate,
    setLocalWacc,
    setLocalTerminalGrowth,
    setLocalExitMultiple,
    handleReset,
  } = useReverseDCFEngine({ historicals, assumptions, overrides });

  const controlCards: ReverseControlCard[] = [
    {
      label: "Solving For",
      readOnly: true,
      value: selectedKey === "revenueGrowth" ? "5Y Revenue CAGR" :
             selectedKey === "ebitMargin" ? "EBIT Margin" :
             selectedKey === "terminalGrowthRate" ? "Terminal Growth" :
             selectedKey === "wacc" ? "WACC" : "Exit Multiple",
      helperText: "Selected target variable for solve."
    },
    {
      label: "Revenue Growth",
      readOnly: true,
      value: selectedKey === "revenueGrowth"
        ? formatSolveValue("revenueGrowth", reverseResults.revenueGrowth ?? NaN)
        : "Historical",
      helperText: selectedKey === "revenueGrowth" ? undefined : "Uses last 5Y average growth."
    },
    selectedKey === "ebitMargin"
      ? {
          label: "EBIT Margin",
          readOnly: true,
          value: formatSolveValue("ebitMargin", reverseResults.ebitMargin ?? NaN),
          helperText: "Solved by reverse DCF engine."
        }
      : {
          label: "EBIT Margin",
          value: localEbitMargin,
          suffix: "%",
          onChange: setLocalEbitMargin,
        },
    {
      label: "Tax Rate",
      value: localTaxRate,
      suffix: "%",
      onChange: setLocalTaxRate,
    },
    selectedKey === "wacc"
      ? {
          label: "WACC",
          readOnly: true,
          value: formatSolveValue("wacc", reverseResults.wacc ?? NaN),
          helperText: "Solved by reverse DCF engine."
        }
      : {
          label: "WACC",
          value: localWacc,
          suffix: "%",
          onChange: setLocalWacc,
        },
    selectedKey === "terminalGrowthRate"
      ? {
          label: "Terminal Growth",
          readOnly: true,
          value: formatSolveValue("terminalGrowthRate", reverseResults.terminalGrowthRate ?? NaN),
          helperText: "Solved by reverse DCF engine."
        }
      : {
          label: "Terminal Growth",
          value: localTerminalGrowth,
          suffix: "%",
          onChange: setLocalTerminalGrowth,
          disabled: valuationMethod === "exitMultiple",
        },
    selectedKey === "terminalExitMultiple"
      ? {
          label: "Exit Multiple",
          readOnly: true,
          value: formatSolveValue("terminalExitMultiple", reverseResults.terminalExitMultiple ?? NaN),
          helperText: "Solved by reverse DCF engine."
        }
      : {
          label: "Exit Multiple",
          value: localExitMultiple,
          suffix: "x",
          onChange: setLocalExitMultiple,
          disabled: valuationMethod === "gordonGrowth",
        },
    {
      label: "Base Revenue",
      value: localBaseRevenue,
      suffix: "M",
      stringInput: true,
      onChange: setLocalBaseRevenue,
    },
  ];


  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 2xl:grid-cols-[1fr_400px]">
        <div className="min-w-0">
          <GoalSeekSelector
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            reverseResults={reverseResults}
            isDarkMode={isDarkMode}
            valuationMethod={valuationMethod}
            targetPrice={targetPrice}
            baseRevenue={parseFloat(localBaseRevenue) || 0}
            status={status}
          />

          <AssumptionsTable
            controlCards={controlCards}
            isDarkMode={isDarkMode}
            onReset={handleReset}
            onMethodChange={setValuationMethod}
            valuationMethod={valuationMethod}
            status={status}
          />

          <ForecastWorksheet
            worksheetRows={worksheetRows}
            stageOnePv={stageOnePv}
            isDarkMode={isDarkMode}
          />
        </div>

        <ValuationBridge
          targetPriceInput={targetPriceInput}
          setTargetPriceInput={setTargetPriceInput}
          bridge={bridge}
          isDarkMode={isDarkMode}
          historicals={historicals}
        />
      </div>
    </div>
  );
}
