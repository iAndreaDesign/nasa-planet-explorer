# T07 — Internacionalización (en/es)

- **Estado:** Completada (2026-10-16)
- **Depende de:** T01 (y C1)

## Objetivo

Configurar la i18n de la interfaz en inglés y español según PROJECT.md §4 "Internationalisation".

## Requisitos

- La librería y la estrategia de rutas según C1: `next-intl`, `/en`/`/es`, `en` por defecto, detección por `Accept-Language`.
- Archivos de mensajes `messages/en.json` y `messages/es.json` con las mismas claves.
- Ningún texto visible queda fijo en los componentes; los datos de las APIs no se traducen.
- `<html lang>` refleja el idioma activo.
- Componente `LanguageSwitcher` accesible que conserva la ruta actual al cambiar de idioma (se coloca en el header en T08).
- Un idioma no soportado redirige al de por defecto o devuelve 404.

## Archivos afectados

`package.json`, `next.config.ts`, `src/proxy.ts`, `src/i18n/{routing,navigation,request}.ts`, `src/i18n/global.d.ts`, `messages/*.json`, `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/[locale]/{layout,page,not-found}.tsx`, `src/app/[locale]/[...rest]/page.tsx`, `src/components/layout/LanguageSwitcher/*`.

## Pasos

1. Instalar y configurar la librería aprobada.
2. Mover las rutas bajo `app/[locale]`.
3. Crear los mensajes iniciales y el `LanguageSwitcher`.
4. Tests: las claves de `en` y `es` coinciden (test automático), el switcher cambia de idioma conservando la ruta y la etiqueta `lang` es correcta.

## Criterios de aceptación

- [x] `/en` y `/es` sirven la página con los textos en su idioma.
- [x] El test de paridad de claves pasa.
- [x] El switcher funciona con teclado.
- [x] lint, typecheck, test y build pasan.

## Notas / hallazgos

- `next-intl` 4.14.9 (peer `next ^16`). En Next 16, `middleware.ts` pasa a llamarse **`proxy.ts`** (`src/proxy.ts`, matcher que excluye `api`, `_next`, `_vercel` y los archivos con extensión).
- Tipado: `src/i18n/global.d.ts` amplía el `AppConfig` de next-intl con `Locale` y `Messages` (las claves de traducción se comprueban en compilación). `AppLocale`/`LOCALES` de T03 son la fuente de los idiomas.
- Los nombres de idioma del selector son endónimos ("English", "Español") en ambos catálogos, con `lang`, `hrefLang` y `aria-current`; el landmark `nav` se traduce ("Language"/"Idioma").
- El selector se muestra temporalmente encima del contenido, en `[locale]/layout.tsx`; T08 lo mueve al header.
- Verificado con `next start` (puerto 3125):
  - `/` con `Accept-Language: es-ES` → 307 `/es`; `fr-FR` → 307 `/en`; sin cabecera → 307 `/en`; `/planets/mars` (es) → 307 `/es/planets/mars`.
  - `/en` → `<html lang="en">`, `nav aria-label="Language"`, `aria-current` en EN; `/es` → `lang="es"`, "Idioma", `aria-current` en ES; los enlaces apuntan a `/en` y `/es`.
  - `/fr` → 307 `/en/fr` → 404.
- **Hallazgo (Next 16.4.2):** cuando una página llama a `notFound()`, la respuesta es 404, pero el HTML es el shell `<html id="__next_error__">` y la página `not-found` se renderiza en el cliente a partir del payload RSC (que sí contiene "Página no encontrada"). Se ha reproducido en una app Next mínima y limpia: las rutas que no existen se renderizan en servidor, pero `notFound()` desde una página no. Es comportamiento del framework, no de next-intl ni de este proyecto. Afecta también a T11/T13 (planeta o exoplaneta inexistente). Con JS activo el usuario ve la página traducida; sin JS ve una página vacía. **Pendiente:** confirmarlo en el navegador.
- Se eliminan `src/app/page.tsx` y su test de humo (T01); el placeholder del home pasa a `[locale]/page.tsx` con texto traducido.
- Verificación: test ✔ (194/194 en total, 8 nuevos), lint ✔, typecheck ✔, build ✔ (`/en` y `/es` SSG + Proxy).
