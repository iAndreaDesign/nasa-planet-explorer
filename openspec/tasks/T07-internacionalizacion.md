# T07 — Internacionalización (en/es)

- **Estado:** Pendiente
- **Depende de:** T01 (y C1)

## Objetivo

Configurar la i18n de la interfaz en inglés y español según PROJECT.md §4 "Internationalisation".

## Requisitos

- La librería y la estrategia de rutas según C1 (propuesta: `next-intl`, `/en`/`/es`, `en` por defecto, detección por `Accept-Language`).
- Archivos de mensajes `messages/en.json` y `messages/es.json` con las mismas claves.
- Ningún texto visible queda fijo en los componentes; los datos de las APIs no se traducen.
- `<html lang>` refleja el idioma activo.
- Componente `LanguageSwitcher` accesible que conserva la ruta actual al cambiar de idioma (se coloca en el header en T08).
- Un idioma no soportado redirige al de por defecto o devuelve 404.

## Archivos afectados

`package.json`, `next.config.ts`, `src/middleware.ts`, `src/i18n/**`, `messages/*.json`, `src/app/[locale]/layout.tsx` (el layout de T01 se mueve aquí), `src/components/layout/LanguageSwitcher/*`.

## Pasos

1. Instalar y configurar la librería aprobada.
2. Mover las rutas bajo `app/[locale]`.
3. Crear los mensajes iniciales y el `LanguageSwitcher`.
4. Tests: las claves de `en` y `es` coinciden (test automático), el switcher cambia de idioma conservando la ruta y la etiqueta `lang` es correcta.

## Criterios de aceptación

- [ ] `/en` y `/es` sirven la página con los textos en su idioma.
- [ ] El test de paridad de claves pasa.
- [ ] El switcher funciona con teclado.
- [ ] lint, typecheck, test y build pasan.

## Notas / hallazgos

—
