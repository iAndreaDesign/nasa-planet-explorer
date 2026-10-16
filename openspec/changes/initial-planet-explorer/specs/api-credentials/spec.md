# Spec Delta

## Purpose

Defines how the application obtains the credentials for external astronomy APIs and guarantees they are never exposed to users or committed to the repository.

## ADDED Requirements

### Requirement: Credentials come from environment variables
The system SHALL read `NASA_API_KEY` and `SOLAR_SYSTEM_API_TOKEN` from environment variables. No credential value SHALL appear in source code or committed files. The repository SHALL include a `.env.example` with placeholder values, and `.env` SHALL be ignored by version control.

#### Scenario: Example environment file
- **WHEN** a developer clones the repository
- **THEN** `.env.example` lists `NASA_API_KEY` and `SOLAR_SYSTEM_API_TOKEN` with placeholder values and no real credential is present in any tracked file

#### Scenario: Local environment file is not tracked
- **WHEN** a `.env` file exists in the project root
- **THEN** version control ignores it

### Requirement: Each API uses its authentication method
The system SHALL send `NASA_API_KEY` as the `api_key` query parameter to the APOD and Exoplanet Archive APIs, and `SOLAR_SYSTEM_API_TOKEN` as an `Authorization: Bearer` header to the Solar System OpenData API.

#### Scenario: Solar System request
- **WHEN** the system requests planet or moon data
- **THEN** the request carries the header `Authorization: Bearer <SOLAR_SYSTEM_API_TOKEN>`

#### Scenario: NASA request
- **WHEN** the system requests APOD or exoplanet data
- **THEN** the request includes the `api_key` query parameter with the value of `NASA_API_KEY`

### Requirement: Credentials never reach the browser
External API requests that need credentials SHALL be performed on the server. Credential values SHALL NOT appear in client-side code, browser network requests, logs or error messages.

#### Scenario: Moon data loaded from the browser
- **WHEN** the user expands the moons section and moon data is requested
- **THEN** no browser request contains `SOLAR_SYSTEM_API_TOKEN`

#### Scenario: API error message
- **WHEN** an external API request fails
- **THEN** the displayed and logged error contains no credential value

### Requirement: Missing credentials produce a configuration error
When a required credential is missing or empty, the system SHALL NOT call the corresponding API and SHALL display a clear, translated configuration error in the affected area only.

#### Scenario: Missing Solar System token
- **WHEN** `SOLAR_SYSTEM_API_TOKEN` is not set and the home page is opened
- **THEN** no request is sent to Solar System OpenData, the Solar System section shows a configuration error and the other sections render normally
