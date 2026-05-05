from __future__ import annotations
from io import BytesIO
from openpyxl import load_workbook
from ..mappers import apply_payload_to_workbook, resolve_wacc_loop_mode, WACC_LOOP_MODE_ITERATIVE
from ..template import load_template_artifact
from .styles import _restore_template_styles
from .xml_utils import _finalize_output_year_labels

def export_dcf_excel(payload: dict) -> bytes:
    template = load_template_artifact()

    workbook = load_workbook(filename=BytesIO(template.workbook_bytes), data_only=False)
    apply_payload_to_workbook(workbook, payload)

    _apply_calculation_properties(workbook, payload)

    output_buffer = BytesIO()
    workbook.save(output_buffer)

    patched_output = _restore_template_styles(
        workbook_bytes=output_buffer.getvalue(),
        template_workbook_bytes=template.workbook_bytes,
        template_styles_xml=template.styles_xml,
    )
    return _finalize_output_year_labels(patched_output)

def _apply_calculation_properties(workbook, payload: dict) -> None:
    calc = workbook.calculation
    calc.fullCalcOnLoad = True
    calc.forceFullCalc = True

    loop_mode = resolve_wacc_loop_mode(payload)
    if loop_mode == WACC_LOOP_MODE_ITERATIVE:
        calc.iterate = True
        calc.iterateCount = 100
        calc.iterateDelta = 0.001
        return

    calc.iterate = False
    calc.iterateCount = None
    calc.iterateDelta = None
