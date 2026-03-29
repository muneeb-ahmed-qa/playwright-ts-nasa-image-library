## Test plan (summary)

### What we cover

| Area | Scope |
|------|--------|
| **UI** | Search for a fixed keyword (`moon`), filter to images, assert minimum result count, open first result and check title/NASA ID, hover preview. |
| **API** | NASA Images API: search (`/search`) with `media_type=image`, first-hit title/ID, asset (`/asset/{id}`) and downloadable URLs, empty results for a nonsense query. |
| **Integration** | Same keyword on API vs UI: first result’s normalized title and NASA ID match between API response and detail page (guards against UI/API drift for the scenarios we exercise). |

**Environment:** production `https://images.nasa.gov` with `baseURL` in config; API calls use `https://images-api.nasa.gov`.

**Browser:** Chromium desktop only (other projects in `playwright.config.ts` are commented out).

### What we do not cover (and why)

- **Other browsers / mobile:** Only Chromium is enabled to keep runs fast and stable; Firefox/WebKit/mobile are left as optional future projects.
- **Full catalog / every media type:** Tests focus on **image** search and one primary keyword; video/audio flows and arbitrary queries are out of scope for this suite.
- **Auth, accounts, uploads:** Public search-only behavior; no logged-in flows.
- **Performance & load:** Functional checks only; no SLA or load testing.
- **Visual regression:** No screenshot baselines or pixel diff; layout is not locked.
- **API pagination beyond page 1** and **ordering guarantees** across UI vs API are only partially addressed (we compare “first” on both sides with normalization); different sort orders could make integration tests sensitive (see below).

---

## Flaky behavior and mitigations

| Risk | Mitigation in this repo |
|------|-------------------------|
| Slow or variable page loads on `images.nasa.gov` | Higher timeouts in config (`timeout`, `navigationTimeout`, `actionTimeout`) as some of the elements taking long time to become visible; So, UI steps wait for containers and details with explicit timeouts where needed. |
| Transient network or 5xx errors | **Retries:** 1 locally, **2 on CI** (`retries` in `playwright.config.ts`). |
| Hard failures to debug | **Screenshots on failure**; use `npm run test:ui-mode` for step-through debugging. |
| **UI vs API “first result” mismatch** | API and UI may not use identical sort/ranking; the integration test compares the **first** API hit to the **first** UI result after the same keyword + image filter. If ordering diverges, this test can fail even when both sides are “correct.” Mitigation: normalized string comparison for title/ID; if flakiness appears, consider comparing a specific known `nasa_id` from the API response instead of assuming order parity. |

---

## Project layout

```
tests/
  ui/           Browser tests
  api/          HTTP API tests (Playwright request fixture)
  integration/ UI + API consistency
pages/          Page object(s)
helpers/        API helpers and text normalization
```
