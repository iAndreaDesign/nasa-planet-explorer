# Plan de tareas — NASA Planet Explorer

Requisitos: [`PROJECT.md`](../../PROJECT.md). Convenciones, stack y diseño: [`CLAUDE.md`](../../CLAUDE.md).
Estas tareas no repiten esos documentos: los referencian por sección.

Estados posibles: `Pendiente` · `Bloqueada` · `En curso` · `Completada`.
Una tarea solo pasa a `Completada` cuando se han verificado sus criterios de aceptación.
Se ejecuta **una tarea cada vez**, con confirmación previa y posterior (CLAUDE.md §7).

## Orden de ejecución y dependencias

| #   | Tarea                                                                   | Depende de         | Estado    |
| --- | ----------------------------------------------------------------------- | ------------------ | --------- |
| T00 | [Especificaciones OpenSpec iniciales](T00-especificaciones-openspec.md) | —                  | Completada |
| T01 | [Scaffold del proyecto](T01-scaffold-proyecto.md)                       | T00                | Completada |
| T02 | [Gestión de credenciales](T02-credenciales.md)                          | T01                | Completada |
| T03 | [Utilidades de dominio y formato](T03-utilidades-formato.md)            | T01                | Completada |
| T04 | [Cliente HTTP y servicio APOD](T04-servicio-apod.md)                    | T02, T03           | Completada |
| T05 | [Servicio Sistema Solar](T05-servicio-sistema-solar.md)                 | T04                | Completada |
| T06 | [Servicio Exoplanetas](T06-servicio-exoplanetas.md)                     | T04                | Completada |
| T07 | [Internacionalización (en/es)](T07-internacionalizacion.md)             | T01                | Completada |
| T08 | [Tema global y estructura (header/footer)](T08-tema-y-layout.md)        | T07                | Completada |
| T09 | [Componentes UI compartidos](T09-componentes-ui.md)                     | T03, T08           | Completada |
| T10 | [Página Home](T10-pagina-home.md)                                       | T04, T05, T06, T09 | Completada |
| T11 | [Página de detalle de planeta](T11-detalle-planeta.md)                  | T05, T09           | Pendiente |
| T12 | [Sección de lunas colapsable](T12-seccion-lunas.md)                     | T11                | Pendiente |
| T13 | [Página de detalle de exoplaneta](T13-detalle-exoplaneta.md)            | T06, T11           | Pendiente |
| T14 | [Revisión final y sincronización de specs](T14-revision-final.md)       | T10–T13            | Pendiente |
| T15 | [Mejora de imágenes](T15-mejora-imagenes.md) (por definir)              | T14                | Pendiente |

Son independientes entre sí: T02/T03, T05/T06 y T07 (puede hacerse justo después de T01).

## Arquitectura

```
planets/                    # imágenes aportadas por el usuario (importación estática)
messages/en.json, es.json   # textos de la interfaz
src/
  proxy.ts                  # detección y redirección de idioma (Next 16: antes middleware)
  i18n/                     # configuración de idiomas y routing
  app/[locale]/
    layout.tsx, page.tsx, loading.tsx, error.tsx, not-found.tsx
    planets/[slug]/page.tsx
    exoplanets/[slug]/page.tsx
  app/api/moons/[id]/route.ts   # proxy servidor: el token nunca llega al navegador
  lib/
    config/env.ts           # lectura y validación de variables de entorno (solo servidor)
    http/fetchJson.ts       # fetch tipado + errores saneados
    format/                 # formateo de valores según el idioma
    images/                 # asignación de imágenes a planetas y exoplanetas
  services/apod/  solarSystem/  exoplanets/
  components/layout/  ui/  home/  detail/  planet/  exoplanet/
  styles/                   # tokens SCSS, tipografía, globales
```

Las peticiones se hacen en Server Components; las lunas pasan por el Route Handler. Tests colocalizados (`*.test.ts(x)`) con Vitest.

## Decisiones resueltas

| #   | Decisión                                                                                                                                                                                                                                 |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Next.js (App Router). Vite descartado.                                                                                                                                                                                                   |
| D2  | `NASA_API_KEY` (APOD y exoplanetas) y `SOLAR_SYSTEM_API_TOKEN` (Bearer).                                                                                                                                                                 |
| D3  | Las peticiones se hacen en servidor y las lunas pasan por un proxy propio.                                                                                                                                                              |
| D4  | APOD: se muestra solo `title`. La API devuelve las 25 últimas entradas, así que se usa la más reciente con `media_type: "image"` (comprobado el 2026-10-16: la entrada de ese día era un vídeo y su `hdurl` venía vacío).            |
| D5  | Solo se muestran los campos que especifica PROJECT.md; el tipo es el `bodyType` de la API. Los mockups son orientativos: valen para el estilo, no para los datos.                                                                       |
| D6  | Imágenes: cada planeta usa su imagen de `./planets` (por slug); los exoplanetas rotan las 3 genéricas (actualizada en T09). Se mejorará en T15. |
| D7  | Nada de contenido editorial (descripción, habitabilidad ni comparativas): solo datos de la API.                                                                                                                                          |
| D8  | Las unidades se muestran tal como las devuelve la API, sin conversiones.                                                                                                                                                                |
| D9  | Sin menú de navegación ni buscador. En el detalle hay flechas anterior/siguiente circulares (del primero se pasa al último y al revés).                                                                                                  |
| D10 | Se añade `pl_dens` a la consulta de exoplanetas. Breadcrumb: "All planets / Exoplanets / <nombre>".                                                                                                                                       |
| D11 | Con 0 lunas se muestra "Moons (0)" con un mensaje de que no hay lunas. Se muestran como máximo 10 lunas, cargadas al expandir y con estado de carga.                                                                                      |
| D12 | Inter. Toda la tipografía a un mínimo de 1rem.                                                                                                                                                                                          |
| D13 | Interfaz en inglés y español con i18n (añadido a PROJECT.md §4).                                                                                                                                                                         |

## Confirmaciones

| #   | Decisión                                                                                                                                                          | Estado                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| C1  | `next-intl`, rutas `/en/...` y `/es/...`, `en` por defecto y detección por `Accept-Language`.                                                                     | Aprobada               |
| C2  | Clic en la APOD: se muestra `hdurl` y el clic abre la imagen original (`hdurl`) en una pestaña nueva (`url` es la página del artículo).                            | Aprobada               |
| C3  | Header: logo + título (enlace al home) + selector de idioma. Hero: "Explore last discovery" abre la APOD y "Discover planets" baja a Solar System.                 | Aprobada               |
| C4  | Más de 10 lunas: se muestran las 10 primeras con el texto "Showing 10 of N".                                                                                      | Aprobada               |
| C5  | npm + repositorio git (se inicializa en T01).                                                                                                                     | Aprobada               |
| C6  | Clave retirada de PROJECT.md y sustituida por `api_key=<NASA_API_KEY>` (2026-10-16). Se recomienda regenerarla.                                                    | Hecho                  |
