# Spec Delta

## Purpose

Lets users move between detail pages and back to the home page: breadcrumb, back link and circular previous/next arrows for planets and exoplanets.

## ADDED Requirements

### Requirement: Breadcrumb and back link
Each detail page SHALL show a breadcrumb — "All planets / Solar System / <name>" for planets and "All planets / Exoplanets / <name>" for exoplanets — whose first item links to the home page, and a "Back to all planets" link to the home page.

#### Scenario: Back to home
- **WHEN** the user activates "Back to all planets" on a detail page
- **THEN** the home page opens in the current language

### Requirement: Circular previous/next navigation
Each detail page SHALL show previous and next arrows on mobile and desktop that navigate within the same list (planets ordered by `semimajorAxis`; exoplanets in query order). From the first item, previous SHALL go to the last; from the last, next SHALL go to the first.

#### Scenario: First planet
- **WHEN** the user activates "previous" on the Mercury detail page
- **THEN** the Neptune detail page opens

#### Scenario: Last planet
- **WHEN** the user activates "next" on the Neptune detail page
- **THEN** the Mercury detail page opens

#### Scenario: Exoplanet list
- **WHEN** the user activates "next" on the last exoplanet of the selection
- **THEN** the first exoplanet detail page opens

### Requirement: Accessible arrows
The arrows SHALL be links with accessible names that include the destination (e.g. "Previous planet: Venus") and SHALL be keyboard operable.

#### Scenario: Screen reader label
- **WHEN** a screen reader focuses the next arrow on the Earth page
- **THEN** it announces "Next planet: Mars" in the current language
