# Spec Delta

## Purpose

Shows the most recent Astronomy Picture of the Day that is an image on the home page and lets users open the original image.

## ADDED Requirements

### Requirement: Latest image entry is selected
The system SHALL request the APOD list and select the most recent entry whose `media_type` is `image` and whose `hdurl` is not empty, even if it is not from the current day.

#### Scenario: Today's entry is a video
- **WHEN** the most recent entry has `media_type` `video` and the next one is an image
- **THEN** the home page shows the image from the next entry

#### Scenario: No image in the list
- **WHEN** no entry in the response is an image with an `hdurl`
- **THEN** the APOD area shows a translated empty state and the rest of the home page renders normally

### Requirement: APOD display
The home page hero SHALL display the selected image (`hdurl`) with its `title` and an accessible text alternative taken from `alt` (HTML entities decoded). No other APOD fields SHALL be displayed.

#### Scenario: Image shown
- **WHEN** the APOD data loads successfully
- **THEN** the hero shows the image and its title

### Requirement: Image opens its original URL
The displayed image SHALL be a link that opens its original image URL (`hdurl`) in a new browser tab. The hero "Explore last discovery" button SHALL open the same URL; the "Discover planets" button SHALL scroll to the Solar System section.

#### Scenario: Click on the image
- **WHEN** the user clicks or activates the APOD image with the keyboard
- **THEN** the original image URL opens in a new tab

#### Scenario: Discover planets
- **WHEN** the user activates "Discover planets"
- **THEN** the page scrolls to the Solar System section

### Requirement: APOD loading and errors
The APOD area SHALL show a loading state while data is fetched and a translated error state if the request fails, without affecting other home sections.

#### Scenario: APOD API failure
- **WHEN** the APOD API responds with an error
- **THEN** the APOD area shows an error message and the Solar System and Exoplanets sections still render
