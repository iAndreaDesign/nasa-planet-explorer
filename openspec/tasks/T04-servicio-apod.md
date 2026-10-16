# T04 — Cliente HTTP y servicio APOD

- **Estado:** Pendiente
- **Depende de:** T02, T03

## Objetivo

Crear un cliente `fetchJson` tipado y compartido, y el servicio que obtiene la última Astronomy Picture of the Day que sea una imagen.

## Requisitos

- PROJECT.md §3 "Astronomy Picture of the Day", con D4 y C2.
- La API devuelve un **array** con las 25 entradas más recientes. El servicio elige la primera con `media_type === "image"` y `hdurl` no vacío.
- Si ninguna de las 25 es imagen → error "sin imagen disponible" (estado vacío en la UI).
- Modelo de dominio: `title`, `imageUrl` (`hdurl`), `linkUrl` (según C2), `alt` (con las entidades HTML decodificadas) y `date`. No se usa `name`.
- `fetchJson`: errores tipados (`ApiError` con status, error de red, respuesta inválida); las URLs de los errores se sanean (sin `api_key`).
- Autenticación `api_key` con `NASA_API_KEY`; si falta → `ConfigError` sin petición.
- Caché o revalidación de Next acorde a un contenido diario (p. ej. `revalidate: 3600`).

## Archivos afectados

`src/lib/http/fetchJson.ts` (+ test), `src/services/apod/{types.ts,apod.ts,apod.test.ts}`.

## Pasos

1. Implementar `fetchJson` con validación mínima de la forma de la respuesta.
2. Implementar `getLatestApodImage()`.
3. Tests de integración con `fetch` simulado: el primer elemento es un vídeo (se elige el siguiente), todos son vídeos, `hdurl` vacío, 4xx, 5xx, error de red, JSON inválido y token ausente (fetch no llamado).

## Criterios de aceptación

- [ ] Los tests pasan.
- [ ] Ningún error o log contiene la clave.
- [ ] typecheck y lint pasan.

## Notas / hallazgos

- Comprobado el 2026-10-16 con una petición sin clave: el endpoint responde 200 con un array de 25 elementos (cabeceras `X-WP-Total`/`X-WP-TotalPages`, paginable con `?page=`). La entrada de ese día era un vídeo con `hdurl: ""`. `url` y `permalink` apuntan al artículo HTML, no a la imagen.
