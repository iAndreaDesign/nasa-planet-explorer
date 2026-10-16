# T08 — Tema global y estructura (header/footer)

- **Estado:** Completada (2026-10-16)
- **Depende de:** T07

## Objetivo

Definir los tokens de diseño y la estructura común a todas las páginas, con el estilo de los mockups.

## Requisitos

- CLAUDE.md §4: solo modo oscuro, paleta indicada, tipografía en `rem` con **mínimo 1rem en todo** (D12) y fuente Inter vía `next/font`.
- Header según C3: logo + "NASA Planet Explorer" (enlace al home) y `LanguageSwitcher`. Sin menú ni buscador (D9).
- Footer: "NASA Planet Explorer" + texto de créditos, ambos traducidos.
- HTML semántico (`header`, `main`, `footer`), enlace "saltar al contenido" y contraste AA.

## Archivos afectados

`src/styles/{_tokens,_typography,_mixins,globals}.scss` + `styles.test.ts`, `src/components/layout/{Header,Footer,Logo,SkipLink}/*`, estilos de `LanguageSwitcher`, `layout.test.tsx`, `src/app/[locale]/{layout,page,not-found}.tsx` + `.module.scss`, `messages/*.json`.

## Pasos

1. Crear tokens SCSS (colores, superficies derivadas, espaciados, radios, breakpoints).
2. Configurar Inter.
3. Implementar Header y Footer, con tests de render y de accesibilidad.
4. Comparar visualmente con los mockups en escritorio y móvil.

## Criterios de aceptación

- [x] El header y el footer siguen el estilo de los mockups en escritorio (1440px) y móvil (≈390px).
- [x] No hay tamaños tipográficos en `px` ni por debajo de `1rem`.
- [x] Todos los textos salen de los mensajes i18n.
- [x] lint, typecheck, test y build pasan.

## Notas / hallazgos

- **Logo:** icono propio y genérico (planeta con anillo, SVG decorativo con `aria-hidden`) en lugar del logo de NASA, cuyo uso está restringido. El usuario no indicó otra cosa.
- **Créditos del footer:** "Images and planetary data provided by NASA and Solar System OpenData." en lugar del "…provided by NASA API" del mockup, porque los datos de planetas vienen de Solar System OpenData.
- Tokens: la paleta de CLAUDE.md como variables CSS más superficies derivadas. Contrastes medidos (test automático, ≥ 4.5:1): texto 16,3:1, texto atenuado 8,3:1, acento de texto `#6ea0e8` 6,5:1 (el acento `#184C9A` como texto daría ~2:1, así que solo se usa en fondos y bordes) y texto sobre el primario 7,5:1.
- Tipografía: Inter vía `next/font/google` (autoalojada, variable `--font-inter`). Un test recorre todos los `.scss` y falla si un `font-size` usa px/pt/em o si un paso de la escala baja de 1rem.
- Los módulos SCSS importan los parciales con rutas relativas (`@use '../../../styles/mixins'`), sin depender de alias de Sass.
- `<main id="main-content" tabIndex={-1}>` está en el layout; las páginas ya no renderizan su propio `<main>`. El enlace "saltar al contenido" es el primer elemento enfocable.
- `suppressHydrationWarning` en `<body>`: la extensión ColorZilla del navegador del usuario inyectaba `cz-shortcut-listen` y provocaba un aviso de hidratación. Solo afecta a los atributos de `<body>`.
- Header sin menú ni buscador (D9, C3): logo + título (enlace al home) y el selector de idioma.
- Verificación visual con Edge headless (`next start`): 1440 px y 390 px reales (dentro de un iframe, porque Edge headless no baja de ~500 px de ventana). Sin desbordamiento horizontal.
- Verificación: test ✔ (221/221 en total, 27 nuevos), lint ✔, typecheck ✔, build ✔.
