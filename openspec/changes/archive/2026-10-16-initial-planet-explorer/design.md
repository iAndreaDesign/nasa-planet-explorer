# Design

## Context

Greenfield project: the repository contains only documentation, mockups (`figma/`), three placeholder planet images (`planets/`) and OpenSpec configuration. See `proposal.md` for motivation. Requirements come from `PROJECT.md`; stack, coding and UI rules from `CLAUDE.md`. The step-by-step task plan lives in `openspec/tasks/`.

Facts observed on 2026-10-16 that shape the design:

- The APOD endpoint returns a JSON **array** of the 25 latest entries (WordPress REST, paginated with `X-WP-Total`). The entry for that day was a video with an empty `hdurl`.
- In APOD entries `url`/`permalink` point to the HTML article; the image itself is `hdurl`.
- Solar System OpenData requires `Authorization: Bearer`, so moon requests cannot be made directly from the browser without exposing the token.

## Goals / Non-Goals

**Goals:**
- No credential ever reaches the browser bundle, a log or an error message.
- Each home section loads and fails independently.
- All UI text translatable; numbers formatted per locale.

**Non-Goals:**
- Unit conversions, derived comparisons (e.g. "% of Earth's mass") or editorial texts from the mockups.
- Navigation menu, search, hamburger menu.
- Planet-specific imagery (deferred to a later task, T15).
- Persisting user preferences beyond the locale in the URL.

## Decisions

1. **Next.js App Router with server-side data fetching.** Pages are Server Components that call service modules; tokens are read only on the server. *Alternative:* client-side fetching (SPA/Vite) — rejected because it would expose tokens.
2. **Moon data through an internal Route Handler (`/api/moons/[id]`).** The client component calls it on expand; the handler validates the id against an allow-pattern, adds the Bearer token and returns sanitised errors. *Alternative:* fetch all moons server-side on page render — rejected: the spec requires loading on expand, and planets have up to ~150 moons.
3. **Service layer per API** (`services/apod`, `services/solarSystem`, `services/exoplanets`) mapping raw responses to domain models with `null` for missing values; the UI turns `null` into the translated "Not available". Formatting is pure, locale-aware functions in `lib/format`.
4. **APOD selection:** the first entry of the list with `media_type === "image"` and a non-empty `hdurl`. Shows `hdurl`; clicking opens `hdurl` in a new tab. *Alternative:* querying previous dates one by one — unnecessary since the list already holds 25 days.
5. **Localisation with `next-intl`:** locale prefix routes (`/en`, `/es`), `en` default, `Accept-Language` detection in middleware, messages in `messages/{en,es}.json` with an automated key-parity test. *Alternative:* hand-made dictionary — rejected: more code to maintain for routing, formatting and detection.
6. **Exoplanet identity:** a deterministic slug from `pl_name`; the detail page re-uses the cached list query (no detail endpoint exists). `pl_dens` is added to the query.
7. **Ordering for previous/next:** planets by `semimajorAxis`, exoplanets by query order; navigation wraps around.
8. **Images:** static imports from `planets/`, assigned by position in rotation; isolated in `lib/images` so T15 can replace it.
9. **Caching:** Next fetch revalidation (APOD hourly; planets/exoplanets daily) to limit external calls.
10. **Styling:** SCSS modules plus global tokens (`#96262F`, `#121A28`, `#184C9A`), Inter via `next/font`, every font size ≥ 1rem.
11. **Testing:** Vitest + Testing Library (jsdom). Unit tests for formatting/mapping, integration tests for services with mocked `fetch`, component tests for UI states.

## Risks / Trade-offs

- [APOD returns 25 videos in a row] → show the empty state of the section; the rest of the page is unaffected.
- [External API downtime or rate limits] → per-section error states and caching.
- [Exoplanet list changes over time, breaking an old slug] → detail returns 404 with a link back; acceptable for a browsing app.
- [Moon `rel` URLs used as proxy input (SSRF)] → only the id is accepted and validated; the host is fixed server-side.
- [APOD `alt`/`credit` contain HTML or entities] → decode entities in `alt`; `credit` is not displayed.
- [Generic rotating images may confuse users] → known limitation until T15.

## Open Questions

None.
