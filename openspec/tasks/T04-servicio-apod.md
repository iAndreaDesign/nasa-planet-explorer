# T04 — Cliente HTTP y servicio APOD

- **Estado:** Completada (2026-10-16)
- **Depende de:** T02, T03

## Objetivo

Crear un cliente `fetchJson` tipado y compartido, y el servicio que obtiene la última Astronomy Picture of the Day que sea una imagen.

## Requisitos

- PROJECT.md §3 "Astronomy Picture of the Day", con D4 y C2.
- La API devuelve un **array** con las 25 entradas más recientes. El servicio elige la primera con `media_type === "image"` y `hdurl` no vacío.
- Si ninguna de las 25 es imagen → `null` (estado vacío en la UI).
- Modelo de dominio: `title`, `imageUrl` (`hdurl`, que se muestra y se abre al hacer clic, C2), `alt` (texto plano) y `date`. No se usa `name`.
- `fetchJson`: errores tipados (`ApiError` con status, error de red, respuesta inválida); las URLs de los errores se sanean (sin `api_key`).
- Autenticación `api_key` con `NASA_API_KEY`; si falta → `ConfigError` sin petición.
- Caché o revalidación de Next acorde a un contenido diario (p. ej. `revalidate: 3600`).

## Archivos afectados

`src/lib/http/fetchJson.ts` (+ test), `src/lib/format/html.ts` (+ test), `src/services/apod/{types.ts,apod.ts,apod.test.ts}`.

## Pasos

1. Implementar `fetchJson` con validación mínima de la forma de la respuesta.
2. Implementar `getLatestApodImage()`.
3. Tests de integración con `fetch` simulado: el primer elemento es un vídeo (se elige el siguiente), todos son vídeos, `hdurl` vacío, 4xx, 5xx, error de red, JSON inválido y token ausente (fetch no llamado).

## Criterios de aceptación

- [x] Los tests pasan.
- [x] Ningún error o log contiene la clave.
- [x] typecheck y lint pasan.

## Notas / hallazgos

- Comprobado el 2026-10-16 con una petición sin clave: el endpoint responde 200 con un array de 25 elementos (cabeceras `X-WP-Total`/`X-WP-TotalPages`, paginable con `?page=`). La entrada de ese día era un vídeo con `hdurl: ""`. `url` y `permalink` apuntan al artículo HTML, no a la imagen.
- No existe `linkUrl`: según C2, el enlace es la propia `imageUrl`.
- `hdurl` solo se acepta con protocolo `http`/`https` (se descartan, p. ej., las URLs `javascript:`); las entradas sin título también se descartan.
- `toPlainText` (`lib/format/html.ts`) quita etiquetas, decodifica entidades (`&#039;`, `&#x2014;`, `&amp;`…) y normaliza espacios. Se aplica a `title` y `alt`.
- `fetchJson`: timeout de 10 s (`AbortSignal.timeout`); `api_key` se sustituye por `[redacted]` en las URLs de los errores; ante un error de red se descarta el error original, porque podría contener la URL.
- Caché: `next: { revalidate: 3600 }` (modelo de caché clásico; `cacheComponents` no está activado, según la documentación local de Next 16).
- Pendiente para T10: `next/image` necesitará `images.remotePatterns` para `assets.science.nasa.gov`.
- Sin prueba real contra la API: `.env` aún está vacío. Se hará cuando el usuario añada la clave.
- Verificación: test ✔ (113/113 en total, 30 nuevos), lint ✔, typecheck ✔, build ✔.
