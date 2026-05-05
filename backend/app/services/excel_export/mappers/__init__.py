from __future__ import annotations
from typing import Any
from openpyxl.workbook import Workbook
from .utils import (
    _sheet, _resolve_amount_scale_divisor, _payload_ticker, _payload_company_name,
    WACC_LOOP_MODE_ITERATIVE, resolve_wacc_loop_mode,
    SHEET_OUTPUTS, SHEET_OUTPUTS_LEGACY, SHEET_WACC,
    SHEET_DATA_RECALCULATED, SHEET_DATA_ORIGINAL,
    SHEET_COVER, SHEET_DCF_BASE, SHEET_DCF_BULL, SHEET_DCF_BEAR, SHEET_COMPS
)
from .cover import _map_cover_sheet, _map_company_labels, _map_currency_labels, _align_income_statement_labels
from .dcf import _map_dcf_base_inputs, _sync_shared_scenario_inputs, _harden_growth_rate_formulas, _normalize_dcf_waterfall_formulas, _normalize_public_dcf_layout, _sync_scenario_formula_backbone, _apply_capex_schedule_to_dcf, _apply_scenario_snapshots_to_dcf, _finalize_assumption_block_cleanup, _add_prior_actual_year_display_column, _map_sensitivity_blocks, _replace_template_placeholders, _finalize_timeline_headers, _reset_dcf_sheet_view_to_top, _remove_assumption_breakdown
from .wacc import _map_wacc_inputs, _apply_required_wacc_formulas, _harden_wacc_peer_aggregate_formulas
from .data import _map_data_sheets, _build_timeline, _map_year_headers
from .comps import _map_comps, _harden_comps_ratio_formulas

def apply_payload_to_workbook(workbook: Workbook, payload: dict[str, Any]) -> None:
    divisor = _resolve_amount_scale_divisor(payload)

    cover = _sheet(workbook, SHEET_COVER)
    outputs = _sheet(workbook, SHEET_OUTPUTS)
    dcf_base = _sheet(workbook, SHEET_DCF_BASE)
    dcf_bull = _sheet(workbook, SHEET_DCF_BULL)
    dcf_bear = _sheet(workbook, SHEET_DCF_BEAR)
    wacc = _sheet(workbook, SHEET_WACC)
    comps_ws = _sheet(workbook, SHEET_COMPS)
    data_recalc = _sheet(workbook, SHEET_DATA_RECALCULATED)
    data_original = _sheet(workbook, SHEET_DATA_ORIGINAL)

    ticker = _payload_ticker(payload)
    company_name = _payload_company_name(payload)

    _map_cover_sheet(cover, payload, ticker, company_name)
    _map_company_labels(company_name, ticker, outputs, dcf_base, dcf_bull, dcf_bear, wacc, comps_ws)
    _map_currency_labels(outputs, dcf_base, dcf_bull, dcf_bear, wacc, comps_ws)

    _map_dcf_base_inputs(dcf_base, payload, divisor)
    assumptions = payload.get("assumptions", {})
    _sync_shared_scenario_inputs(dcf_bull, dcf_base, nwc_multiplier=1.0)
    _sync_shared_scenario_inputs(dcf_bear, dcf_base, nwc_multiplier=1.0)
    _align_income_statement_labels(dcf_base, dcf_bull, dcf_bear, data_original, data_recalc)
    
    _map_wacc_inputs(wacc, payload)
    _apply_required_wacc_formulas(wacc, payload)

    timeline_years, historical_years = _build_timeline(payload)
    _map_year_headers(outputs, dcf_base, dcf_bull, dcf_bear, data_original, data_recalc, timeline_years, historical_years, payload)
    _map_data_sheets(data_original, data_recalc, payload, divisor, timeline_years)
    
    _map_comps(comps_ws, payload, divisor)
    _harden_comps_ratio_formulas(comps_ws)
    _harden_wacc_peer_aggregate_formulas(wacc)
    
    _normalize_public_dcf_layout(outputs, dcf_base, dcf_bull, dcf_bear, payload, divisor)
    _sync_scenario_formula_backbone(dcf_base, dcf_bull, dcf_bear)
    _apply_capex_schedule_to_dcf(dcf_base, dcf_bull, dcf_bear, payload, timeline_years, divisor)
    _apply_scenario_snapshots_to_dcf(dcf_base, dcf_bull, dcf_bear, payload, timeline_years, divisor)
    
    _map_sensitivity_blocks(dcf_base, dcf_bull, dcf_bear, payload, divisor)
    
    _finalize_timeline_headers(outputs, dcf_base, dcf_bull, dcf_bear, timeline_years, historical_years)
    _replace_template_placeholders(company_name=company_name, ticker=ticker, sheets=(outputs, dcf_base, dcf_bull, dcf_bear))
    _reset_dcf_sheet_view_to_top(outputs, dcf_base, dcf_bull, dcf_bear)
    _remove_assumption_breakdown(workbook, cover)
