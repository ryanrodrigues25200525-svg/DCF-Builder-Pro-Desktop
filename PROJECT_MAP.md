# DCF Builder Project Map

## Scope
This document describes the authored files in `dcf-builder/` and the runtime data flow between the frontend, backend, SEC/EDGAR integration, market-data services, and Excel export path.

Excluded from this inventory:
- generated/build artifacts such as `node_modules`, `.next`, `__pycache__`
- machine-local state such as `.env`, `.env.local`, `.venv`, `.DS_Store`
- runtime cache/database contents inside `backend/data/`

## Project Purpose
DCF Builder is a valuation workspace for loading a public company, normalizing SEC-native financial data, deriving valuation assumptions, running a client-side DCF model, comparing the company against public comps and precedent transactions, and exporting the resulting model to Excel.

Current design intent:
- backend owns company-data recovery, normalization, caching, peer resolution, and valuation-context assembly
- frontend owns interaction speed, view state, assumptions editing, diagnostics, and DCF computation
- export defaults to the exact model state visible in the UI

## End-to-End Data Flow
1. The Next.js app boots through `frontend/src/app/layout.tsx` and `frontend/src/app/page.tsx`.
2. `frontend/src/containers/DCFBuilderContainer.tsx` renders the main app shell and delegates state assembly to `frontend/src/hooks/useDCFModel.ts`.
3. Company search uses `frontend/src/core/utils/ticker-search-client.ts`, which calls the frontend search route `frontend/src/app/api/sec/search/route.ts`.
4. The search route uses the in-memory SEC ticker index in `frontend/src/core/utils/search-index.ts`.
5. A company load goes through `frontend/src/hooks/useCompanyData.ts`, which calls `frontend/src/app/api/sec/company/route.ts`.
6. That frontend route proxies to the backend unified route in `backend/app/api/routers/financials_router.py`.
7. The backend unified builder pulls:
- SEC profile and statements from `backend/app/services/edgar.py`
- market data, valuation context, and peers from `backend/app/services/finance.py`
- cache/persistence support from `backend/app/infrastructure/repository.py`
8. The backend returns one unified payload with:
- profile
- normalized financials
- market snapshot
- valuation context
- peers
- data quality / completeness metadata
9. The frontend maps that payload through `frontend/src/services/integration/sec/native-normalizer.ts` into app models.
10. `frontend/src/hooks/dcf/useValuationAssumptions.ts` derives or updates assumptions from company data and peer medians.
11. `frontend/src/services/dcf/engine.ts` and its modules calculate the forecast, terminal value, discounting, and implied valuation outputs.
12. Visual components in `frontend/src/components/features/*` and `frontend/src/components/dashboard/*` render statements, assumptions, comps, charts, and diagnostics.
13. Export posts the current UI snapshot to `frontend/src/app/api/dcf/export/route.ts`, which proxies to `backend/app/api/routers/export_router.py`.
14. The backend export stack uses `backend/app/services/excel_export/*` and the template workbook `backend/app/assets/templates/dcf-export-template.xlsx` to produce the final Excel file.

## Top-Level Files
- `README.md`: public-facing app overview and download link.
- `ARCHITECTURE_FLOW.md`: current runtime architecture and the simplified backend-first recovery model.
- `API_DOCS.md`: API-facing behavior and endpoint reference.
- `API_STACK_AND_FLOW.md`: API and request-flow notes across the stack.
- `PROJECT_MAP.md`: this file; repo inventory and data-flow reference.
- `package.json`: root convenience scripts for running frontend and backend together.
- `package-lock.json`: root npm lockfile.
- `docker-compose.yml`: local multi-service container setup.
- `start.sh`: startup helper for local development.
- `verify-setup.sh`: environment verification script.
- `scripts/security_scan.sh`: security scan helper.
- `.gitignore`: ignored files and build artifacts.

## Backend

### Backend Entry and Config
- `backend/main.py`: lightweight launcher that runs `app.main`.
- `backend/README.md`: backend-specific setup instructions.
- `backend/requirements.txt`: Python dependency list.
- `backend/ruff.toml`: Ruff linting/formatting settings.
- `backend/Dockerfile`: backend container build.
- `backend/.env.example`: backend environment variable template.

### Backend Application Root
- `backend/app/__init__.py`: package marker.
- `backend/app/main.py`: FastAPI app creation, startup initialization, router registration, health routes.

### Backend API Layer
- `backend/app/api/__init__.py`: API package marker.
- `backend/app/api/routers/__init__.py`: router package marker.
- `backend/app/api/routers/financials_router.py`: primary company-data API surface; unified payload assembly, profile, market, peers, native financial routes.
- `backend/app/api/routers/export_router.py`: Excel export route; consumes UI snapshot and optionally refreshes peers.
- `backend/app/api/routers/macro_router.py`: macro-context endpoint exposing treasury yield and ERP from backend finance services.
- `backend/app/api/routers/search.py`: backend company search endpoint backed by EDGAR search.

### Backend Core
- `backend/app/core/__init__.py`: package marker.
- `backend/app/core/config.py`: loads application configuration from environment.
- `backend/app/core/cache_versions.py`: cache-version constants to invalidate stale serialized data safely.
- `backend/app/core/errors.py`: shared backend error definitions/helpers.

### Backend Infrastructure
- `backend/app/infrastructure/repository.py`: SQLite-backed repository for cached payloads and persisted backend artifacts.

### Backend Models
- `backend/app/models/__init__.py`: package marker.
- `backend/app/models/schemas.py`: Pydantic schemas for API requests and responses.

### Backend Services
- `backend/app/services/__init__.py`: service package marker.
- `backend/app/services/cache.py`: cache utility helpers.
- `backend/app/services/edgar.py`: SEC/EDGAR integration, identity setup, company search, statement fetch, SEC-native normalization.
- `backend/app/services/finance.py`: market data, peer resolution, valuation context, fallback behavior, and peer bundle construction.
- `backend/app/services/peer_universe.py`: static/curated peer universe helpers.
- `backend/app/services/stockdex_service.py`: Stockdex adapter for quote and market fields.

### Backend Excel Export
- `backend/app/services/excel_export/__init__.py`: export package marker.
- `backend/app/services/excel_export/exporter.py`: workbook generation engine and template application logic.
- `backend/app/services/excel_export/mappers.py`: maps frontend export payloads into workbook-ready structures.
- `backend/app/services/excel_export/template.py`: workbook template loading and sheet helper logic.

### Backend Assets
- `backend/app/assets/templates/dcf-export-template.xlsx`: base Excel workbook used for export generation.

### Backend Runtime Data
- `backend/data/`: runtime cache/database directory; not source code, but part of the backend persistence shape.

## Frontend

### Frontend Root and Tooling
- `frontend/package.json`: frontend scripts and dependencies.
- `frontend/package-lock.json`: frontend npm lockfile.
- `frontend/next.config.ts`: Next.js runtime/build configuration.
- `frontend/tsconfig.json`: TypeScript compiler configuration.
- `frontend/eslint.config.mjs`: ESLint rules.
- `frontend/postcss.config.mjs`: PostCSS config.
- `frontend/vitest.config.ts`: test runner configuration.
- `frontend/vercel.json`: Vercel deployment settings.
- `frontend/Dockerfile`: frontend container build.
- `frontend/next-env.d.ts`: Next.js type declarations.
- `frontend/.env.example`: frontend environment variable template.
- `frontend/public/grid.svg`: static background/graphic asset.
- `frontend/scripts/test-parity.ts`: parity-check helper script.
- `frontend/test-search-index.js`: search-index verification helper.

### Frontend App Router
- `frontend/src/app/layout.tsx`: root layout and provider wiring.
- `frontend/src/app/page.tsx`: home route that renders the valuation app.
- `frontend/src/app/error.tsx`: app-level error boundary page.
- `frontend/src/app/globals.css`: global styles.
- `frontend/src/app/favicon.ico`: browser favicon.
- `frontend/src/app/company/page.tsx`: company-focused route wrapper.
- `frontend/src/app/institutional/page.tsx`: alternate route for institutional presentation.
- `frontend/src/app/(dashboard)/financials/page.tsx`: dashboard route focused on financial statements.

### Frontend API Routes
- `frontend/src/app/api/dcf/export/route.ts`: validates/proxies export payloads to the backend export service.
- `frontend/src/app/api/dcf/export/route.test.ts`: tests the export API route.
- `frontend/src/app/api/market-data/route.ts`: frontend market-data route for quotes/history and comps refreshes.
- `frontend/src/app/api/projections/[ticker]/route.ts`: lightweight projection helper route that builds simple forward projections from unified backend data.
- `frontend/src/app/api/sec/company/route.ts`: frontend BFF route for unified company payloads with in-memory caching and de-duplication.
- `frontend/src/app/api/sec/search/route.ts`: frontend company-search route backed by the local search index.
- `frontend/src/app/api/wacc/erp/route.ts`: transitional ERP endpoint.
- `frontend/src/app/api/wacc/treasury/route.ts`: transitional treasury-rate endpoint.

### Frontend Containers and Providers
- `frontend/src/containers/DCFBuilderContainer.tsx`: top-level UI container, route/state glue, and export trigger surface.
- `frontend/src/components/providers/QueryProvider.tsx`: React Query provider and stale-cache purge logic.

### Frontend Dashboard Components
- `frontend/src/components/dashboard/AnalystRail.tsx`: side rail for analyst-style context and summary content.
- `frontend/src/components/dashboard/CompanyOverviewPage.tsx`: overview page for company snapshot content.
- `frontend/src/components/dashboard/DashboardLayout.tsx`: layout shell for dashboard composition.
- `frontend/src/components/dashboard/DenseCompsTable.tsx`: compact comparable-company table.
- `frontend/src/components/dashboard/TearsheetHeader.tsx`: tear sheet style header block.
- `frontend/src/components/dashboard/TerminalHeader.tsx`: terminal-inspired top header.
- `frontend/src/components/dashboard/ValuationBridgeCard.tsx`: bridge-style card connecting valuation outputs and supporting metrics.

### Frontend Feature Components: Analysis
- `frontend/src/components/features/analysis/RevenueBuild.tsx`: revenue build / revenue-driver view.
- `frontend/src/components/features/analysis/SensitivityAnalysis.tsx`: sensitivity table/chart for valuation scenario analysis.
- `frontend/src/components/features/analysis/WACCBuild.tsx`: WACC decomposition and support view.

### Frontend Feature Components: Assumptions
- `frontend/src/components/features/assumptions/AssumptionSanityStrip.tsx`: quick-read strip showing reasonableness of key assumptions.
- `frontend/src/components/features/assumptions/AssumptionsPanel.tsx`: main assumptions editing panel.
- `frontend/src/components/features/assumptions/ConvergenceVisualizer.tsx`: visual aid for convergence from explicit forecast to terminal-state assumptions.

### Frontend Feature Components: Statements
- `frontend/src/components/features/statements/DcfBridgeTable.tsx`: bridge table linking accounting lines to DCF inputs.
- `frontend/src/components/features/statements/FinancialStatements.tsx`: main financial statements view.
- `frontend/src/components/features/statements/FinancialStatementsToolbar.tsx`: toolbar for statements controls.
- `frontend/src/components/features/statements/NativeStatementTable.tsx`: tabular renderer for native standardized statements.
- `frontend/src/components/features/statements/SourcesAndUses.tsx`: sources-and-uses style financing/cash view.
- `frontend/src/components/features/statements/StatementRow.tsx`: row-level statement renderer/helper.
- `frontend/src/components/features/statements/ThreeStatementFlow.tsx`: visual flow across income statement, balance sheet, and cash flow.

### Frontend Feature Components: Valuation
- `frontend/src/components/features/valuation/CompsTable.tsx`: primary public comps table.
- `frontend/src/components/features/valuation/CompsTableInstitutional.tsx`: institutional-style comps presentation.
- `frontend/src/components/features/valuation/EVComposition.tsx`: enterprise value composition view.
- `frontend/src/components/features/valuation/FootballFieldChart.tsx`: football-field valuation range chart.
- `frontend/src/components/features/valuation/PrecedentTransactions.tsx`: precedent transaction comps view.
- `frontend/src/components/features/valuation/ValuationBubbleSquare.tsx`: visual valuation summary block.
- `frontend/src/components/features/valuation/ValuationDashboard.tsx`: main valuation screen combining outputs, assumptions, statements, and diagnostics.
- `frontend/src/components/features/valuation/ValuationHero.tsx`: hero/summary section for valuation state.

### Frontend Layout Components
- `frontend/src/components/layout/DealDashboard.tsx`: overall dashboard framing/layout for the valuation workspace.
- `frontend/src/components/layout/DiagnosticsPanel.tsx`: diagnostics and warning display.
- `frontend/src/components/layout/HeroCover.tsx`: hero cover/visual framing component.
- `frontend/src/components/layout/ParametersSidebar.tsx`: sidebar for model parameters and controls.
- `frontend/src/components/layout/SideNav.tsx`: side navigation.
- `frontend/src/components/layout/TopNav.tsx`: top navigation.

### Frontend UI Components
- `frontend/src/components/ui/ErrorBoundary.tsx`: reusable React error boundary.
- `frontend/src/components/ui/GlassCard.tsx`: card with glassmorphism styling wrapper.
- `frontend/src/components/ui/LoadingSkeleton.tsx`: loading skeleton UI.
- `frontend/src/components/ui/SearchBar.module.css`: styles for search bar component.
- `frontend/src/components/ui/SearchBar.tsx`: ticker/company search input UI.
- `frontend/src/components/ui/SegmentedControl.tsx`: segmented control component.
- `frontend/src/components/ui/Slider.tsx`: slider control component.

### Frontend UI Primitives
- `frontend/src/components/ui/primitives/Button.tsx`: base button primitive.
- `frontend/src/components/ui/primitives/GlassCard.tsx`: primitive glass card wrapper.
- `frontend/src/components/ui/primitives/Input.tsx`: base input primitive.
- `frontend/src/components/ui/primitives/MetricCard.tsx`: metric display card primitive.
- `frontend/src/components/ui/primitives/SectionHeader.tsx`: section title/header primitive.
- `frontend/src/components/ui/primitives/SegmentedControl.tsx`: primitive segmented control.
- `frontend/src/components/ui/primitives/StatBadge.tsx`: status/stat badge primitive.

### Frontend Core Config, Data, and Constants
- `frontend/src/core/config/financial-statements.ts`: statement display/config rules.
- `frontend/src/core/constants/index.ts`: shared constants.
- `frontend/src/core/data/industry-templates.ts`: default assumption presets by industry and helper logic for applying them.
- `frontend/src/core/data/precedent-transactions.ts`: built-in precedent transaction dataset for comps analysis.
- `frontend/src/core/data/sp500-template-map.ts`: ticker-to-industry-template lookup table.
- `frontend/src/core/logger.ts`: app logging helper.
- `frontend/src/core/logic/financial-processor.ts`: utility logic for reading and deriving financial-series values across historical and forecast data.

### Frontend Core Types
- `frontend/src/core/types/company.ts`: company/profile-related types.
- `frontend/src/core/types/index.ts`: central type exports.
- `frontend/src/core/types/model.ts`: DCF model and scenario types.
- `frontend/src/core/types/native.ts`: backend native/unified payload types, including valuation context and data-quality metadata.
- `frontend/src/core/types/revenue.ts`: revenue-build and revenue-driver types.
- `frontend/src/core/types/valuation.ts`: valuation output and comps-related types.

### Frontend Core Utils
- `frontend/src/core/utils/cn.ts`: class-name composition helper.
- `frontend/src/core/utils/financial-format.ts`: number/financial formatting helpers.
- `frontend/src/core/utils/index.ts`: utility re-exports.
- `frontend/src/core/utils/math.ts`: generic math helpers.
- `frontend/src/core/utils/search-index.ts`: in-memory SEC ticker dataset loader and fuzzy-search index.
- `frontend/src/core/utils/ticker-search-client.ts`: browser-side ticker-search client with caching and request de-duplication.
- `frontend/src/core/utils/utils.ts`: miscellaneous shared utilities.

### Frontend Hooks
- `frontend/src/hooks/useCompanyData.ts`: unified company fetch, cache, normalization, and degraded-state handling.
- `frontend/src/hooks/useDCFModel.ts`: composition root for the frontend valuation model.
- `frontend/src/hooks/useDebounce.ts`: generic debounce hook.

### Frontend DCF Hooks
- `frontend/src/hooks/dcf/useCompanyWorkspace.ts`: current ticker/workspace state and load orchestration.
- `frontend/src/hooks/dcf/useDiagnostics.ts`: diagnostics derived from model state and payload quality.
- `frontend/src/hooks/dcf/useScenarioControls.ts`: scenario switching and scenario-control state.
- `frontend/src/hooks/dcf/useValuationAssumptions.ts`: initial assumption seeding and editable assumption state.

### Frontend Lib
- `frontend/src/lib/hooks/useDebounce.ts`: duplicate/alternate debounce hook under `lib`.
- `frontend/src/lib/utils.ts`: shared library helpers.

### Frontend Calculator Services
- `frontend/src/services/calculators/forecasting.ts`: forecasting math helpers.
- `frontend/src/services/calculators/tax.ts`: tax-calculation helpers.
- `frontend/src/services/calculators/valuation.ts`: valuation helper calculations.
- `frontend/src/services/calculators/wacc.ts`: WACC-related calculations.

### Frontend DCF Engine
- `frontend/src/services/dcf/assumption-policy.ts`: assumption defaults and policy logic.
- `frontend/src/services/dcf/constants.ts`: engine constants.
- `frontend/src/services/dcf/engine.ts`: main DCF engine that combines forecast modules and output assembly.
- `frontend/src/services/dcf/sensitivity.ts`: sensitivity-analysis logic.
- `frontend/src/services/dcf/comprehensive-scenarios.test.ts`: tests for scenario handling.
- `frontend/src/services/dcf/sensitivity.test.ts`: tests for sensitivity logic.
- `frontend/src/services/dcf/validation.test.ts`: tests for validation and model integrity.

### Frontend DCF Engine Modules
- `frontend/src/services/dcf/modules/financing.ts`: financing and capital-structure forecast logic.
- `frontend/src/services/dcf/modules/fixed-assets.ts`: CapEx, depreciation, and fixed-asset schedule logic.
- `frontend/src/services/dcf/modules/income-statement.ts`: forecast income-statement logic.
- `frontend/src/services/dcf/modules/initial-assumptions.ts`: starting-point assumptions derived from historical data.
- `frontend/src/services/dcf/modules/terminal-valuation.ts`: terminal-value calculations.
- `frontend/src/services/dcf/modules/working-capital.ts`: working-capital forecast logic.

### Frontend Export Services
- `frontend/src/services/exporters/excel/index.ts`: export service entrypoint.
- `frontend/src/services/exporters/excel/payload-mappers.ts`: maps UI state to backend export payload shape.
- `frontend/src/services/exporters/excel/types.ts`: export payload/result types.
- `frontend/src/services/exporters/excel/excel.test.ts`: export-layer tests.

### Frontend Integration Services: Market Data
- `frontend/src/services/integration/market-data/damodaran.ts`: market-data integration for Damodaran-style reference inputs.
- `frontend/src/services/integration/market-data/treasury.ts`: treasury-rate integration helper.
- `frontend/src/services/integration/market-data/yahoo-finance.ts`: Yahoo Finance integration helper.

### Frontend Integration Services: SEC
- `frontend/src/services/integration/sec/native-normalizer.ts`: maps backend-native SEC structures into frontend domain models.
- `frontend/src/services/integration/sec/xbrl-constants.ts`: XBRL concept constants and normalization support.

## Architectural Notes
- The backend unified company payload is the recovery boundary for SEC-native data.
- The frontend still has lightweight BFF routes, but no longer owns financial fallback merging.
- Search is intentionally frontend-local for speed and low coupling.
- The DCF engine is client-side so assumption edits feel immediate.
- The Excel export path is backend-rendered but frontend-state-driven.

## What To Read First
If you want to understand the system quickly, read these in order:
1. `README.md`
2. `ARCHITECTURE_FLOW.md`
3. `backend/app/main.py`
4. `backend/app/api/routers/financials_router.py`
5. `backend/app/services/edgar.py`
6. `backend/app/services/finance.py`
7. `frontend/src/containers/DCFBuilderContainer.tsx`
8. `frontend/src/hooks/useDCFModel.ts`
9. `frontend/src/hooks/useCompanyData.ts`
10. `frontend/src/services/integration/sec/native-normalizer.ts`
11. `frontend/src/services/dcf/engine.ts`
12. `backend/app/api/routers/export_router.py`
