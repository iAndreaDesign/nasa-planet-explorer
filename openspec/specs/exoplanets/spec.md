# exoplanets Specification

## Purpose

Presents ten recently discovered exoplanets from the NASA Exoplanet Archive as cards on the home page and as detail pages showing all the data returned by the query.

## Requirements

### Requirement: Exoplanet selection
The system SHALL query the Exoplanet Archive for the top 10 exoplanets with a known discovery year, ordered by discovery year descending and name ascending, selecting `pl_name`, `hostname`, `disc_year`, `discoverymethod`, `sy_dist`, `pl_rade`, `pl_bmasse`, `pl_orbper`, `pl_eqt` and `pl_dens`. The section SHALL show a counter of the selected worlds.

#### Scenario: Home section
- **WHEN** the home page loads successfully
- **THEN** the Exoplanets section shows 10 cards in the order returned by the query

#### Scenario: Latest discoveries
- **WHEN** the archive contains exoplanets discovered in the current year
- **THEN** the selection contains the 10 exoplanets with the most recent discovery years, not an arbitrary subset sorted afterwards

### Requirement: Exoplanet card content
Each exoplanet card SHALL show `pl_name`, the system distance `sy_dist` in parsecs and a visual representation. The whole card SHALL be a keyboard-accessible link to the exoplanet detail page, identified by a URL-safe slug of its name.

#### Scenario: Card link
- **WHEN** the user activates the card of "GJ 1214 b"
- **THEN** the detail page for that exoplanet opens at a URL containing `gj-1214-b`

### Requirement: Exoplanet detail data
The exoplanet detail page SHALL show the name, an image and all queried fields with the API units: host star, discovery year, discovery method, distance (pc), radius (Earth radii), mass (Earth masses), orbital period (days), equilibrium temperature (K) and density (g/cm³). Missing values SHALL show the translated "Not available". No conversions or derived values SHALL be shown.

#### Scenario: Complete data
- **WHEN** the detail page of an exoplanet with all fields loads
- **THEN** every field is displayed with its unit

#### Scenario: Null density
- **WHEN** `pl_dens` is null
- **THEN** density is displayed as the translated "Not available"

### Requirement: Exoplanet temperature badge
The exoplanet detail page SHALL show the same temperature badge as planets, based on the equilibrium temperature (`pl_eqt`): "Cold" (blue) below 270 K, "Hot" (red) above 323 K, and no badge in between or when the value is not available. The image SHALL be labelled as an artist impression.

#### Scenario: Hot exoplanet
- **WHEN** the detail page of an exoplanet with `pl_eqt` 1203.65 is shown in Spanish
- **THEN** a red badge reads "Caliente" and the image is labelled "Recreación artística"

#### Scenario: Unknown temperature
- **WHEN** `pl_eqt` is null
- **THEN** no badge is shown and the temperature reads "Not available"

### Requirement: Exoplanet loading, errors and unknown slugs
The Exoplanets section and detail page SHALL show a loading state while fetching and a translated error state on failure. A slug that does not match any of the selected exoplanets SHALL show the not-found page.

#### Scenario: Unknown slug
- **WHEN** the user opens an exoplanet URL whose slug is not in the current selection
- **THEN** the not-found page is shown with a link back to the home page
