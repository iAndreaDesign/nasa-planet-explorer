# T08 — Tema global y estructura (header/footer)

- **Estado:** Pendiente
- **Depende de:** T07

## Objetivo

Definir los tokens de diseño y la estructura común a todas las páginas, con el estilo de los mockups.

## Requisitos

- CLAUDE.md §4: solo modo oscuro, paleta indicada, tipografía en `rem` con **mínimo 1rem en todo** (D12) y fuente Inter vía `next/font`.
- Header según C3: logo + "NASA Planet Explorer" (enlace al home) y `LanguageSwitcher`. Sin menú ni buscador (D9).
- Footer: "NASA Planet Explorer" + texto de créditos, ambos traducidos.
- HTML semántico (`header`, `main`, `footer`), enlace "saltar al contenido" y contraste AA.

## Archivos afectados

`src/styles/{_tokens.scss,_typography.scss,_mixins.scss,globals.scss}`, `src/components/layout/{Header,Footer}/*`, `src/app/[locale]/layout.tsx`, `messages/*.json`.

## Pasos

1. Crear tokens SCSS (colores, superficies derivadas, espaciados, radios, breakpoints).
2. Configurar Inter.
3. Implementar Header y Footer, con tests de render y de accesibilidad.
4. Comparar visualmente con los mockups en escritorio y móvil.

## Criterios de aceptación

- [ ] El header y el footer siguen el estilo de los mockups en escritorio (1440px) y móvil (≈390px).
- [ ] No hay tamaños tipográficos en `px` ni por debajo de `1rem`.
- [ ] Todos los textos salen de los mensajes i18n.
- [ ] lint, typecheck, test y build pasan.

## Notas / hallazgos

—
