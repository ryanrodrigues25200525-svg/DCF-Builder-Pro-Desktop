from __future__ import annotations

# Sheet Names
SHEET_WACC = "WACC"
SHEET_OUTPUTS = "Outputs - Base"
SHEET_OUTPUTS_LEGACY = "Ouputs - Base"
SHEET_ASSUMPTION_BREAKDOWN = "Assumption Breakdown"
SHEET_DATA_ORIGINAL = "Original & Adjusted Data"
SHEET_DATA_RECALCULATED = "Data Given (Recalculated)"
SHEET_COVER = "Cover"
SHEET_DCF_BASE = "DCF Model - Base (1)"
SHEET_DCF_BULL = "DCF Model - Bull (2)"
SHEET_DCF_BEAR = "DCF Model - Bear (3)"
SHEET_COMPS = "Comps"

# Column Lists
TEN_YEAR_COLUMNS = ["V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE"]
RECALC_COLUMNS = ["G", "H", "I", "J", "K", "L", "M", "N", "O", "P"]
DCF_TIMELINE_COLUMNS = ["H", "I", "J", "K", "L", "M", "N", "O", "P", "Q"]

# Financial Constraints
MAX_TERMINAL_GROWTH_RATE = 0.03
MIN_TERMINAL_WACC_SPREAD = 0.005

# Helper Cells
DCF_HELPER_CASH_CELL = "AA17"
DCF_HELPER_DEBT_CELL = "AA18"
DCF_HELPER_NON_OP_CELL = "AA19"
DCF_HELPER_CASH_CELL_ABS = "$AA$17"
DCF_HELPER_DEBT_CELL_ABS = "$AA$18"
DCF_HELPER_NON_OP_CELL_ABS = "$AA$19"

# WACC Modes
WACC_LOOP_MODE_CURRENT_EQUITY = "current_equity"
WACC_LOOP_MODE_ITERATIVE = "iterative"

# Scenarios
SCENARIO_BASE = "base"
SCENARIO_BULL = "bull"
SCENARIO_BEAR = "bear"
