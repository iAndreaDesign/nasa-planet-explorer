# Spec Delta

## Purpose

Lets users see a planet's moons from its detail page, loading each moon's data only when the user asks for it.

## ADDED Requirements

### Requirement: Collapsible moons section
The planet detail page SHALL include a "Moons (N)" section, where N is the total number of known moons, collapsed by default and operable with the keyboard, exposing its expanded state to assistive technologies.

#### Scenario: Default state
- **WHEN** the planet detail page loads
- **THEN** the moons section is collapsed and no moon data has been requested

#### Scenario: Keyboard expansion
- **WHEN** the user focuses the section toggle and presses Enter or Space
- **THEN** the section expands and its expanded state is announced

### Requirement: Planets without moons
When a planet has no known moons, the section SHALL read "Moons (0)" and, when expanded, show a translated message that the planet has no known moons, without making any request.

#### Scenario: Venus
- **WHEN** the user expands the moons section of Venus
- **THEN** a "no known moons" message is shown and no moon request is made

### Requirement: At most ten moons
The section SHALL list at most the first 10 moons of the planet's moon list. When the planet has more than 10, a translated note SHALL state how many are shown out of the total (e.g. "Showing 10 of 95").

#### Scenario: Jupiter
- **WHEN** the user expands the moons section of a planet with 95 moons
- **THEN** exactly 10 moons are listed with the note "Showing 10 of 95" and no more than 10 moon requests are made

### Requirement: Moon data loaded on expand
On first expansion the system SHALL load each listed moon's data (via its `rel` reference) and show its name, mean radius (km), mass (kg), density (g/cm³) and gravity (m/s²). Missing values SHALL show the translated "Not available". Collapsing and re-expanding SHALL NOT repeat successful requests.

#### Scenario: Moon loaded
- **WHEN** the moons section of Mars is expanded
- **THEN** Phobos and Deimos are listed with their available properties

#### Scenario: Re-expand
- **WHEN** the user collapses and expands the section again
- **THEN** the moon data is shown without new requests

### Requirement: Per-moon loading and error states
Each moon entry SHALL show a loading state until its data arrives and a translated error state if its request fails, without affecting the other moons.

#### Scenario: One moon fails
- **WHEN** the request for one moon fails and the others succeed
- **THEN** that moon shows an error and the others show their data
