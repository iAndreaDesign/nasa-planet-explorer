# Spec Delta

## Purpose

Presents the eight Solar System planets from Solar System OpenData as cards on the home page and as detail pages with their physical and orbital properties.

## ADDED Requirements

### Requirement: Planets ordered by distance from the Sun
The Solar System section SHALL display the eight planets returned by the API, sorted by ascending `semimajorAxis`, with a counter of the number of planets.

#### Scenario: Unordered API response
- **WHEN** the API returns the planets in any order
- **THEN** the cards appear as Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune

### Requirement: Planet card content
Each planet card SHALL show the planet's `englishName`, its position in the ordered list as two digits, its `bodyType`, its number of known moons and a visual representation. The whole card SHALL be a keyboard-accessible link to the planet detail page.

#### Scenario: Mars card
- **WHEN** the Solar System section renders Mars
- **THEN** its card shows "Mars", "04", the API `bodyType`, "2" moons and an image, and activating it opens the Mars detail page

#### Scenario: Planet without moons
- **WHEN** a planet's `moons` is null or empty
- **THEN** its card shows 0 moons

### Requirement: Planet detail properties
The planet detail page SHALL show the name, position, `bodyType`, an image and these properties with the API units: mass (kg, from `massValue` × 10^`massExponent`), mean radius (km), density (g/cm³), surface gravity (m/s²), escape velocity (m/s), axial tilt (°), semi-major axis (km), orbital period (days), rotation period (hours) and average temperature (K).

#### Scenario: Mass display
- **WHEN** `massValue` is 6.41712 and `massExponent` is 23
- **THEN** the mass is shown in scientific notation with "× 10²³" and the unit kg

#### Scenario: Missing property
- **WHEN** a property is null, missing or not a number
- **THEN** it is displayed as the translated "Not available"

### Requirement: No derived or editorial content
Planet pages SHALL display only data returned by the API. They SHALL NOT include unit conversions, comparisons with Earth or descriptive texts.

#### Scenario: Temperature
- **WHEN** `avgTemp` is 210
- **THEN** the temperature is shown as 210 K, not converted to °C

### Requirement: Planet loading, errors and unknown planets
The Solar System section and the planet detail page SHALL show a loading state while fetching and a translated error state on failure. An unknown planet id SHALL show the not-found page.

#### Scenario: Unknown planet
- **WHEN** the user opens the detail URL of an id that is not one of the eight planets
- **THEN** the not-found page is shown with a link back to the home page

#### Scenario: Planet API failure on home
- **WHEN** the Solar System API fails
- **THEN** the Solar System section shows an error and the other home sections render normally
