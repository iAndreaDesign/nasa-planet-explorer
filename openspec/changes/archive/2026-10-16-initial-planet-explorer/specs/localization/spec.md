# Spec Delta

## Purpose

Makes the interface available in English and Spanish, lets users choose the language and formats numbers according to the active language.

## ADDED Requirements

### Requirement: Supported languages
The interface SHALL be available in English (`en`) and Spanish (`es`), with English as the default. Every page SHALL be reachable under a language-prefixed URL (`/en/...`, `/es/...`).

#### Scenario: Spanish URL
- **WHEN** the user opens `/es`
- **THEN** all interface text is shown in Spanish

#### Scenario: Unsupported language
- **WHEN** the user opens a URL with an unsupported language prefix
- **THEN** the system responds with the not-found page

### Requirement: Initial language detection
When the user opens a URL without a language prefix, the system SHALL redirect to the language preferred by the browser if supported, otherwise to English.

#### Scenario: Browser prefers Spanish
- **WHEN** a browser with `Accept-Language: es-ES` opens `/`
- **THEN** it is redirected to `/es`

#### Scenario: Browser prefers an unsupported language
- **WHEN** a browser with `Accept-Language: fr-FR` opens `/`
- **THEN** it is redirected to `/en`

### Requirement: Language switcher
Every page SHALL offer a keyboard-accessible language switcher that changes the language while keeping the current page.

#### Scenario: Switch on a detail page
- **WHEN** the user is on `/en/planets/mars` and selects Spanish
- **THEN** the system navigates to `/es/planets/mars`

### Requirement: All interface text is translated
All interface text (headings, labels, buttons, units labels, loading, empty and error messages, "Not available") SHALL come from translation messages in both languages. Data returned by external APIs SHALL be shown as received, untranslated. The page `lang` attribute SHALL match the active language.

#### Scenario: Missing value in Spanish
- **WHEN** a property has no value and the language is Spanish
- **THEN** it is displayed as "No disponible"

#### Scenario: API data is not translated
- **WHEN** the language is Spanish
- **THEN** planet names, exoplanet names and the APOD title are displayed exactly as returned by the APIs

### Requirement: Locale-aware number formatting
Numbers SHALL be formatted according to the active language (decimal and thousands separators).

#### Scenario: Decimal separator
- **WHEN** the value 3.71 is displayed
- **THEN** it reads "3.71" in English and "3,71" in Spanish
