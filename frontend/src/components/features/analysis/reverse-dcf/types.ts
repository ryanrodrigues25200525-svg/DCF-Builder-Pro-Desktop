import { Assumptions, HistoricalData, Overrides } from "@/core/types";

export interface ReverseDCFProps {
  historicals: HistoricalData;
  assumptions: Assumptions;
  overrides: Overrides;
  isDarkMode?: boolean;
}

export type ReverseWorksheetRow = {
  year: number;
  revenue: number;
  ebit: number;
  nopat: number;
  depreciation: number;
  capex: number;
  nwcChange: number;
  fcff: number;
  discountExponent: number;
  pvFcff: number;
};

export type ReverseBridge = {
  stageOnePv: number;
  pvTerminalValue: number;
  enterpriseValue: number;
  netDebt: number;
  equityValue: number;
  shareCount: number;
  impliedSharePrice: number;
};

export type ReverseControlCard =
  | {
      label: string;
      readOnly: true;
      value: string;
      helperText?: string;
    }
  | {
      label: string;
      readOnly?: false;
      value: number;
      suffix: string;
      onChange: (value: number) => void;
      stringInput?: false;
      disabled?: boolean;
      helperText?: string;
    }
  | {
      label: string;
      readOnly?: false;
      value: string;
      suffix: string;
      stringInput: true;
      onChange: (value: string) => void;
      disabled?: boolean;
      helperText?: string;
    };
