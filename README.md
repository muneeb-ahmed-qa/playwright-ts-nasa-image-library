# NASA Image Library — Playwright (TypeScript)

End-to-end and API tests against [NASA Image Library](https://images.nasa.gov) and the [NASA Images API](https://images-api.nasa.gov).

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (comes with Node)

## Install

```bash
git clone <repository-url>
cd playwright-ts-nasa-image-library
npm install
npx playwright install
```

`npx playwright install` downloads browser binaries (Chromium is used by this project).

## Run tests

| Command | What it runs |
|--------|----------------|
| `npm test` | **All** tests (UI, API, integration) |
| `npm run test:ui-tests` | **UI** tests only (`tests/ui/`) |
| `npm run test:api-tests` | **API** tests only (`tests/api/`) |
| `npm run test:integration` | **Integration** tests only (`tests/integration/`) |
| `npm run test:headed` | All tests in a visible browser |
| `npm run test:ui-mode` | Playwright interactive UI mode (debug/trace) |

Equivalent paths if you prefer `npx`:

```bash
npx playwright test tests/ui          # UI
npx playwright test tests/api         # API
npx playwright test tests/integration # Integration
npx playwright test                 # All
```

---

## HTML report

This project uses Playwright’s **HTML reporter** (`reporter: 'html'` in `playwright.config.ts`).

1. Run tests (report is written when the run finishes):

   ```bash
   npm test
   ```

2. Open the last report in the browser:

   ```bash
   npm run report
   ```

   This runs `playwright show-report`, which serves the report from the default output folder **`playwright-report/`** (created next to the project root).

To open a report from a specific folder:

```bash
npx playwright show-report path/to/playwright-report
```

Artifacts: failed tests attach **screenshots** (`screenshot: 'only-on-failure'`). Traces are not enabled by default; use `test:ui-mode` or add trace options in config if you need them.

---