# NASA Planet Explorer

Aplicación web para explorar visualmente los planetas del Sistema Solar y los exoplanetas descubiertos más recientemente, con datos reales de APIs públicas de astronomía.

> 🧪 **Proyecto de práctica de _vibe coding_ con SDD (Spec-Driven Development).** Toda la aplicación se ha construido conversando con un agente de IA (Claude Code), con los requisitos y las especificaciones escritos *antes* que el código y un flujo de trabajo tarea a tarea. Más abajo se explica [cómo se ha trabajado](#cómo-se-ha-construido-vibe-coding--sdd).

## Qué hace

- **Home**
  - **Imagen astronómica del día (APOD)** de la NASA. Si la del día es un vídeo, se muestra la imagen más reciente. Al hacer clic se abre la imagen original.
  - **Sistema Solar:** los 8 planetas ordenados por distancia al Sol, con su posición, su tipo y su número de lunas.
  - **Exoplanetas:** los 10 descubiertos más recientemente, con su distancia en pársecs.
- **Detalle de planeta**
  - Masa, radio, densidad, gravedad, velocidad de escape, inclinación axial, semieje mayor y periodos orbital y de rotación, todo en las unidades de la API.
  - **Badge de temperatura:** *Frío* por debajo de 270 K y *Caliente* por encima de 323 K.
  - **Sección "Lunas (N)"** plegable. Carga hasta 10 lunas solo cuando se despliega y lo hace a través de un proxy en el servidor, así que el token nunca llega al navegador.
- **Detalle de exoplaneta:** estrella anfitriona, año y método de descubrimiento, distancia, radio, masa, densidad, periodo orbital y temperatura de equilibrio.
- **Navegación circular** anterior/siguiente entre detalles: desde el primero se pasa al último y al revés.
- **Inglés y español**, con detección del idioma del navegador y selector EN/ES.
- **Solo modo oscuro, responsive y accesible:** navegación completa con teclado, enlace "saltar al contenido", contraste AA y texto de 1rem como mínimo.
- Los valores que la API no proporciona se muestran como **"No disponible"**, nunca inventados.

## Tecnologías

[Next.js 16](https://nextjs.org/) (App Router, Turbopack) · React 19 · TypeScript (strict) · SCSS Modules · [next-intl](https://next-intl.dev/) · [Vitest](https://vitest.dev/) + Testing Library · ESLint

Los datos se piden en el servidor (Server Components y un Route Handler) y las páginas se generan en el build, con regeneración cada hora.

## Puesta en marcha

Requisitos: **Node.js 20.9 o superior** y npm.

```bash
git clone https://github.com/iAndreaDesign/nasa-planet-explorer.git
cd nasa-planet-explorer
npm install
cp .env.example .env    # Windows (PowerShell): Copy-Item .env.example .env
```

Rellena `.env` con tus propias credenciales (son gratuitas):

| Variable | Para qué | Dónde conseguirla |
| --- | --- | --- |
| `NASA_API_KEY` | APOD y NASA Exoplanet Archive | <https://api.nasa.gov> |
| `SOLAR_SYSTEM_API_TOKEN` | Planetas y lunas (Solar System OpenData) | <https://api.le-systeme-solaire.net/generatekey.html> |

> `.env` está en `.gitignore`: no subas nunca tus claves al repositorio. Si falta una credencial, la app no hace la petición y muestra un error de configuración solo en la sección afectada.

```bash
npm run dev     # http://localhost:3000 (redirige a /en o /es)
```

### Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build de producción y servidor |
| `npm test` | Tests (Vitest) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Comprobación de tipos de TypeScript |

## Cómo se ha construido: vibe coding + SDD

El objetivo del ejercicio era probar a desarrollar una aplicación completa **solo dando instrucciones en lenguaje natural** a un agente de IA, pero con disciplina: *especificar primero e implementar después*. Para ello se ha usado [OpenSpec](https://github.com/Fission-AI/OpenSpec) como fuente de verdad de los requisitos.

1. **Contexto inicial.** [`PROJECT.md`](PROJECT.md) recoge el producto, las APIs y el alcance. [`CLAUDE.md`](CLAUDE.md) define el stack, las normas de código y de diseño, y las reglas de trabajo para el agente. En [`figma/`](figma/) están los mockups de referencia.
2. **Plan de tareas.** El agente analizó los requisitos y propuso 15 tareas pequeñas y verificables, con sus dependencias, en [`openspec/tasks/`](openspec/tasks/). Antes de escribir código se resolvieron las ambigüedades con preguntas, y todas las decisiones quedaron registradas (D1–D15 en el [README de tareas](openspec/tasks/README.md)).
3. **Especificaciones.** Se creó un cambio OpenSpec con propuesta, diseño técnico y **8 specs de comportamiento**, con requisitos y escenarios: credenciales, i18n, APOD, planetas, lunas, exoplanetas, estructura de la interfaz y navegación.
4. **Implementación de una tarea cada vez.** Antes de cada tarea, el agente explicaba qué iba a hacer y pedía confirmación. Al terminarla, ejecutaba los tests, lint, typecheck y build, probaba contra las APIs reales y en el navegador (capturas a 1440 px y 390 px), anotaba los hallazgos en la tarea y proponía un commit para su validación.
5. **Revisión y cierre.** Se hizo una revisión astronómica de los datos, de la accesibilidad, del responsive, de la i18n y de que no hubiera credenciales en el bundle ni en el historial de git. Después se sincronizaron las specs en [`openspec/specs/`](openspec/specs/) y el cambio se archivó en [`openspec/changes/archive/`](openspec/changes/archive/).

Los requisitos que cambiaron por el camino (por ejemplo, el badge de temperatura o el orden de las secciones del detalle) se actualizaron también en las specs, de modo que la especificación sigue reflejando lo implementado. El historial de commits recorre el proyecto tarea a tarea.

## Estructura

```
src/
  app/[locale]/          páginas (home, planets/[slug], exoplanets/[slug]) en /en y /es
  app/api/moons/[id]/    proxy en servidor para los datos de las lunas
  services/              clientes de APOD, Solar System OpenData y Exoplanet Archive
  components/            layout, componentes de UI, home y detalles
  lib/                   configuración, HTTP, formato de valores, imágenes, navegación
  i18n/  proxy.ts        configuración de next-intl (proxy = middleware en Next 16)
messages/                textos de la interfaz en inglés y español
openspec/                specs, tareas y cambio archivado (SDD)
planets/                 imágenes de planetas (ilustrativas)
```

## Fuentes de datos

- [NASA Science — Astronomy Picture of the Day](https://science.nasa.gov/)
- [Solar System OpenData](https://api.le-systeme-solaire.net/) (planetas y lunas)
- [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/) (tabla `pscomppars`)

Los datos se muestran tal como los devuelven las APIs, sin conversiones de unidades. Las imágenes de planetas y exoplanetas son ilustrativas; las de los exoplanetas son recreaciones genéricas.

## Limitaciones conocidas

- La API de Solar System OpenData devuelve `0` para algunos valores desconocidos (por ejemplo, la temperatura de Mercurio). La app los muestra como "No disponible".
- En Next.js 16.4, la página 404 que genera `notFound()` se pinta en el navegador, así que sin JavaScript se ve vacía.
- Los exoplanetas usan de momento tres imágenes genéricas que van rotando. Mejorarlas es una tarea pendiente ([T15](openspec/tasks/T15-mejora-imagenes.md)).

## Créditos

Proyecto de aprendizaje desarrollado por [iAndreaDesign](https://github.com/iAndreaDesign) con [Claude Code](https://claude.com/claude-code). No está afiliado a la NASA. Los datos y las imágenes pertenecen a sus respectivas fuentes.
