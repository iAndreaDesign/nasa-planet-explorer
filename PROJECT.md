# NASA Planet Explorer

## 1. Project Overview

NASA Planet Explorer is a visual exploration web application for discovering Solar System planets and selected exoplanets.

The application focuses on presenting astronomical objects through visual cards and detail pages. It is a browsing and visualization experience.

## 2. Main Features

### Home Page

The home page contains three main sections:

- **Astronomy Picture of the Day:** displays an image obtained from the NASA Science API. Clicking the image opens its original image URL in the browser.
- **Solar System:** displays the eight planets of the Solar System in a card grid.
- **Exoplanets:** displays a selection of ten exoplanets in a card grid.

Each planet and exoplanet card provides a visual representation and basic identifying information. Clicking a card navigates to the corresponding detail page.
Mockup example has to be followed, can be found on figma/home.png and figma/home-mobile.png

### Planet and exoplanet Detail Pages

Each Solar System planet has a detail page accessible by selecting its card on the home page.
The data source and displayed properties will be documented once the planet API is defined.
Mockup example has to be followed, can be found on figma/detail.png and figma/detail-mobile.png

## 3. External APIs

### Astronomy Picture of the Day

**Endpoint**
GET `https://science.nasa.gov/wp-json/wp/v2/apod-basic`

**Authentication**
Include the following this URL parameter
`api_key=<NASA_API_KEY>`

**Expected response:**
{
"date": "2026-09-11",
"post_id": 1308668,
"title": "M83: The Southern Pinwheel",
"permalink": "https://science.nasa.gov/image-article/apod-2026-september-11-m83-the-southern-pinwheel/",
"media_type": "image",
"explanation": "Detailed Explanation",
"credit": "Aldo Zanetti",
"copyright": "Aldo Zanetti",
"alt": "A spiral galaxy is shown in front of a dark field of stars.",
"url": "https://science.nasa.gov/image-article/apod-2026-september-11-m83-the-southern-pinwheel/",
"hdurl": "https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/september/M83_Final2_1x.jpg?w=3828&h=3798&fit=clip&crop=faces%2Cfocalpoint",
"basic_html": "HTML of the page",
"basic_html_url": "https://science.nasa.gov/wp-json/wp/v2/apod-basic/260911/html"
}

**Application behaviour:**

- Retrieve the image 'url' param from the API response.
- Retrieve 'title' and 'name'
- Display the image on the home page.
- Make the displayed image clickable.
- When clicked, navigate to the image's original URL.

### Solar System Planets API

**### Solar System Planets API**

**Endpoint**

GET `https://api.le-systeme-solaire.net/rest/bodies/?filter[]=isPlanet,eq,true`

**Authentication**

Include the following HTTP header in all requests:

`Authorization: Bearer <SOLAIRE_API_TOKEN>`

**Expected response**

The API returns a JSON object containing a `bodies` array with the planets and their properties.

**Format**

- `englishName`: Planet name
- `bodyType`: Celestial body type
- `moons`: Array of known moons (`moon` name and `rel` URL)
- `mass.massValue` + `mass.massExponent`: Mass in kg
- `meanRadius`: Mean radius in km
- `density`: Density in g/cm³
- `gravity`: Surface gravity in m/s²
- `avgTemp`: Average temperature in Kelvin
- `semimajorAxis`: Orbital semi-major axis in km
- `sideralOrbit`: Orbital period in days
- `sideralRotation`: Rotation period in hours
- `escape`: Escape velocity in m/s
- `axialTilt`: Axial tilt in degrees

**Application behaviour**

- Display the eight planets sorted by distance from the Sun, using `semimajorAxis`.
- Planet cards must display the name, type, number of moons and a visual representation.
- Clicking a card navigates to its detail page.
- Detail pages must display the planet's physical properties, orbital properties, rotation period and temperature.
- Include a collapsible **"Moons (N)"** section, collapsed by default, listing the planet's moons.
- Retrieve individual moon data using each moon's `rel` URL when the section is expanded. Display available properties such as radius, mass, density and gravity.
- Display missing values as "Not available".
- Handle loading states and API errors.
- Follow `figma/home.png`, `figma/home-mobile.png`, `figma/detail.png` and `figma/detail-mobile.png`.

### Exoplanets API

**Endpoint**
GET `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?api_key=<NASA_API_KEY>&query=select+top+10+pl_name,hostname,disc_year,discoverymethod,sy_dist,pl_rade,pl_bmasse,pl_orbper,pl_eqt+from+pscomppars+where+disc_year+is+not+null+order+by+disc_year+desc,pl_name+asc&format=json`

**Authentication**
Include the following this URL parameter
`api_key=<NASA_API_KEY>`

**Expected response:**
{
"pl_name": "GJ 1214 b",
"hostname": "GJ 1214",
"disc_year": 2009,
"discoverymethod": "Transit",
"sy_dist": 14.64270000,
"pl_rade": 2.73300000,
"pl_bmasse": 8.41000000,
"pl_orbper": 1.58040453100,
"pl_eqt": 567.00,
"pl_dens"
}

**Format**
pl_name Nombre del exoplaneta —
hostname Nombre de la estrella anfitriona
disc_year Año del descubrimiento date
discoverymethod Método de descubrimiento
sy_dist Distancia del sistema unit: Pársecs
pl_rade Radio del planeta unit: Radios terrestres
pl_bmasse Mejor estimación de masa disponible unit: Masas terrestres
pl_orbper Periodo orbital unit: Días
pl_eqt Temperatura de equilibrio estimada unit:Kelvin

**Application behaviour:**

- Display all the data
- Use figma/detail.png

## 4. User Experience

- The application is primarily for visualizing astronomical objects.
- Users navigate from the home page to individual planet or exoplanet details by selecting cards.
- The Astronomy Picture of the Day links directly to its original image URL.
- The interface follows the project's dark visual theme and responsive design rules defined in `CLAUDE.md`.

### Internationalisation (i18n)

- The interface is available in **English** and **Spanish**.
- All interface text (labels, headings, buttons, loading and error messages, "Not available") is translated through i18n message files; no user-facing text is hardcoded in components.
- Users can switch language from the interface.
- Numbers and dates are formatted according to the active language.
- Data returned by the external APIs (planet names, APOD titles, etc.) is displayed as received, without translation.

## 5. Scope
The application is intended to display astronomical information obtained from external APIs.
Unless explicitly specified in future requirements, it does not include:

- Editing or submitting astronomical data.
- Scientific calculations or simulations.
- User accounts or personalization.
- Additional functionality beyond browsing, visualization and navigation.
  Any new features or changes to this scope must be defined and approved through OpenSpec.

**API credentials and security**

- Store API credentials in environment variables, never hardcode tokens in source code.
- Create a `.env.example` file with the required variable names and placeholder values.
- Create a local `.env` file and ask the user to provide the required API tokens.
- Ensure `.env` is included in `.gitignore` and never commit real credentials to the repository.
- Use the appropriate authentication method for each API:
  - NASA APIs: `NASA_API_KEY`, passed as the `api_key` query parameter when required.
  - Solar System OpenData: `SOLAR_SYSTEM_API_TOKEN`, passed in the `Authorization: Bearer <API_TOKEN>` header.
- If a required token is missing, display a clear configuration error instead of making the request.
- Never expose secret credentials in logs, error messages or committed files.