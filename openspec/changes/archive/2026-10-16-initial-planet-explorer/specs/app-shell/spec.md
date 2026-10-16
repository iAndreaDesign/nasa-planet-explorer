# Spec Delta

## Purpose

Defines the structure, visual theme and shared states common to every page, so the application looks and behaves consistently on mobile and desktop.

## ADDED Requirements

### Requirement: Page structure
Every page SHALL have a header with the application logo and the "NASA Planet Explorer" title linking to the home page, plus the language switcher, and a footer with the application name and a credit stating that images and planet data are provided by external APIs. There SHALL be no navigation menu and no search.

#### Scenario: Header on a detail page
- **WHEN** the user activates the title in the header of a detail page
- **THEN** the home page in the current language opens

### Requirement: Dark theme and typography
The interface SHALL use only a dark theme based on primary `#96262F`, background `#121A28` and accent `#184C9A`, with font sizes in rem and no text smaller than 1rem. Text and interactive elements SHALL meet WCAG AA contrast.

#### Scenario: Smallest text
- **WHEN** any page is rendered
- **THEN** no text has a computed font size below 1rem

### Requirement: Responsive layout
The interface SHALL adapt to mobile and desktop widths following the visual style of the mockups in `figma/`, without horizontal scrolling. Card grids SHALL show four columns on desktop and two on mobile.

#### Scenario: Mobile width
- **WHEN** the home page is viewed at 390px wide
- **THEN** planet cards are displayed in two columns and there is no horizontal scroll

### Requirement: Accessibility
Pages SHALL use semantic landmarks, provide a skip-to-content link, give every image a text alternative and make every interactive element reachable and operable by keyboard with a visible focus indicator.

#### Scenario: Keyboard navigation
- **WHEN** the user navigates the home page with Tab
- **THEN** every card and button receives visible focus in reading order

### Requirement: Shared data states
Every data area SHALL present distinct, translated loading, empty, error and configuration-error states. Missing values SHALL be shown as the translated "Not available".

#### Scenario: Loading
- **WHEN** a section is waiting for API data
- **THEN** a loading placeholder is shown in place of its content
