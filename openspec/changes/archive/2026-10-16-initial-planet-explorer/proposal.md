# Proposal

## Why

NASA Planet Explorer has requirements (`PROJECT.md`), conventions (`CLAUDE.md`) and mockups (`figma/`), but no code and no approved specifications. This change records the behaviour of the first complete version as OpenSpec specs, so implementation can be driven and verified task by task (`openspec/tasks/`).

## What Changes

- A bilingual (English/Spanish) web application, dark theme only, responsive for mobile and desktop.
- Home page with three sections: the latest Astronomy Picture of the Day image, the eight Solar System planets and ten recently discovered exoplanets.
- Planet detail pages with physical/orbital properties and a collapsible moons section that loads moon data on demand.
- Exoplanet detail pages showing every field returned by the Exoplanet Archive query.
- Circular previous/next navigation between detail pages.
- Credentials read from environment variables and used only on the server; a clear configuration error when they are missing.
- Mockups are used as visual style references only: displayed data is exactly what the APIs return, in the units they return, with no editorial content.

## Capabilities

### New Capabilities

- `api-credentials`: how API credentials are configured, kept secret and reported when missing.
- `localization`: English/Spanish interface, language selection and locale-aware formatting.
- `astronomy-picture`: selection and display of the latest APOD image on the home page.
- `solar-system-planets`: planet list ordering, planet cards and planet detail content.
- `planet-moons`: collapsible moons section and on-demand moon data.
- `exoplanets`: exoplanet list, cards and detail content.
- `app-shell`: shared page structure (header, footer, theme, typography, loading/error/empty states, "Not available" values).
- `detail-navigation`: breadcrumb, back link and circular previous/next navigation on detail pages.

### Modified Capabilities

None (no existing specs).

## Impact

- New Next.js + TypeScript + SCSS project with Vitest; new dependency `next-intl` for localisation.
- External APIs: NASA Science APOD, Solar System OpenData (Bearer token), NASA Exoplanet Archive TAP.
- New environment variables: `NASA_API_KEY`, `SOLAR_SYSTEM_API_TOKEN`.
- `PROJECT.md` updated with the i18n requirement and with the real key removed from the exoplanet endpoint example.
