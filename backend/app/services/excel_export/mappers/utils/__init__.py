from __future__ import annotations

from .constants import (
    SHEET_WACC, SHEET_OUTPUTS, SHEET_OUTPUTS_LEGACY, SHEET_ASSUMPTION_BREAKDOWN,
    SHEET_DATA_ORIGINAL, SHEET_DATA_RECALCULATED, SHEET_COVER, SHEET_DCF_BASE,
    SHEET_DCF_BULL, SHEET_DCF_BEAR, SHEET_COMPS,
    TEN_YEAR_COLUMNS, RECALC_COLUMNS, DCF_TIMELINE_COLUMNS,
    MAX_TERMINAL_GROWTH_RATE, MIN_TERMINAL_WACC_SPREAD,
    DCF_HELPER_CASH_CELL, DCF_HELPER_DEBT_CELL, DCF_HELPER_NON_OP_CELL,
    DCF_HELPER_CASH_CELL_ABS, DCF_HELPER_DEBT_CELL_ABS, DCF_HELPER_NON_OP_CELL_ABS,
    WACC_LOOP_MODE_CURRENT_EQUITY, WACC_LOOP_MODE_ITERATIVE,
    SCENARIO_BASE, SCENARIO_BULL, SCENARIO_BEAR
)

from .core import (
    _sheet, _to_float, _safe_date, _fiscal_year_end_date, _safe_year_end_date,
    _first_float, _series, _resolve_amount_scale_divisor, _scale, _payload_ticker,
    _payload_company_name, _display_company_label, resolve_wacc_loop_mode,
    _historical_index_by_year, _forecast_by_year, _format_percent_axis_label
)

from .financial import (
    _sanitize_wacc_rate, _sanitize_terminal_growth_rate, _scenario_assumption_value,
    _last_known_ratio, _last_known_opex_mix, _template_opex_mix,
    _historical_value_for_year, _numeric_list, _matrix_values,
    _fallback_wacc_terminal_matrix, _fallback_revenue_ebit_matrix,
    _scenario_snapshot, _forecast_map, _scenario_assumptions, _scenario_summary,
    _scenario_first_projection_forecast, _infer_revenue_growth_rate,
    _metric_series, _split_cost_of_revenue_components, _opex_component_series
)

from .excel import (
    _set_comment, _safe_set, _safe_set_or_clear, _safe_set_with_options,
    _force_set, _axis_from_bounds, _uniform_axis_step, _set_percent_axis_row,
    _set_percent_axis_column, _clear_sensitivity_blocks,
    _map_scenario_forecasts_to_sheet, _apply_scenario_snapshot_to_sheet,
    _link_dcf_income_statement_to_recalculated_data,
    _normalize_public_dcf_assumption_block, _enforce_core_public_dcf_formulas,
    _scenario_choose_formula, _enforce_outputs_bridge_formulas,
    _rewrite_formula_sheet_name_references
)
