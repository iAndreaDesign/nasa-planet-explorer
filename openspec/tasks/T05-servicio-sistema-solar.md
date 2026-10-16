# T05 — Servicio Sistema Solar

- **Estado:** Completada (2026-10-16)
- **Depende de:** T04

## Objetivo

Obtener los planetas y las lunas de Solar System OpenData y mapearlos a modelos de dominio.

## Requisitos

- PROJECT.md §3 "Solar System Planets API", con todos los campos de "Format" y las unidades originales (D8).
- `getPlanets()`: los 8 planetas ordenados por `semimajorAxis` ascendente (este orden también se usa para las flechas anterior/siguiente).
- `getPlanetBySlug(slug)`: un planeta por el slug de su nombre inglés (`earth`), o `null`.
- `getMoon(id)`: el `id` se extrae del `rel` y se valida contra el host de la API (evita SSRF en el proxy de T12).
- El tipo es el `bodyType` de la API (D5).
- Cabecera `Authorization: Bearer` con `SOLAR_SYSTEM_API_TOKEN`, solo en servidor.
- Campos ausentes → `null` en el dominio.

## Archivos afectados

`src/services/solarSystem/{types.ts,mappers.ts,solarSystem.ts,fixtures.ts}` + `mappers.test.ts`, `solarSystem.test.ts`.

## Pasos

1. Definir los tipos de la respuesta cruda y los modelos `Planet`, `Moon` y `MoonRef`.
2. Implementar las funciones reutilizando `fetchJson`.
3. Tests: orden correcto con datos desordenados, campos ausentes, `mass` nulo, `moons: null` (0 lunas), ids inválidos, errores de API y token ausente.

## Criterios de aceptación

- [x] Los tests pasan.
- [x] El token solo aparece en la cabecera, nunca en errores ni logs.
- [x] typecheck y lint pasan.

## Notas / hallazgos

- Prueba real (2026-10-16, con el token del usuario): los 8 planetas llegan en orden (Mercurio → Neptuno) y el filtro codificado funciona. Marte y Venus tienen todos sus campos (Venus: rotación −5832.5 h, 0 lunas). Fobos y Deimos se cargan con radio, masa, densidad y gravedad. Saturno tiene **293** lunas y Júpiter 115; todos los `rel` de Saturno pasan la validación. Sin token, la API responde 401.
- En la lista `moons` del planeta, los nombres de las lunas vienen en francés ("Deïmos", "Encelade"); el detalle de cada luna trae `englishName` ("Deimos"). T12 mostrará el nombre del detalle una vez cargado.
- Los ids de la API están en francés (`terre`, `mercure`, `saturne`…). Las URLs usan el slug de `englishName` (`/planets/earth`), y `getPlanetBySlug` lo busca en la lista (en caché, sin una petición extra). Esto sustituye a `getPlanet(id)`.
- La API usa `0` para los valores desconocidos: en masa, radio, densidad, gravedad, escape, temperatura, distancia y periodos, el 0 se trata como `null` ("Not available"). `axialTilt` conserva el 0. Los valores negativos se mantienen (rotación retrógrada de Venus).
- `MoonRef.id` es `null` si el `rel` no es `https://api.le-systeme-solaire.net/rest/bodies/<id>`; la luna se cuenta igualmente en N.
- `getMoon(id)` valida el id con `^[a-z0-9-]{1,64}$` antes de hacer la petición (`RangeError`), como protección SSRF para el proxy de T12.
- Si `englishName` falta, se usa `name`; los cuerpos sin id o sin nombre se descartan.
- `fixtures.ts` (datos de prueba) no lo importa el código de la app, así que no entra en el bundle.
- Verificación: test ✔ (169/169 en total, 56 nuevos), lint ✔, typecheck ✔, build ✔.
