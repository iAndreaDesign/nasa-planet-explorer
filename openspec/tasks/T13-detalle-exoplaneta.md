# T13 — Página de detalle de exoplaneta

- **Estado:** Completada (2026-10-16)
- **Depende de:** T06, T11

## Objetivo

Crear `/[locale]/exoplanets/[slug]` con todos los datos del exoplaneta, reutilizando el diseño de detalle.

## Requisitos

- PROJECT.md §3 "Exoplanets API": "Display all the data", es decir, estrella anfitriona, año y método de descubrimiento, distancia (pc), radio (R⊕), masa (M⊕), periodo orbital (días), temperatura de equilibrio (K) y densidad (`pl_dens`, g/cm³), con las unidades de la API (D8).
- Badge de temperatura (D14) con `pl_eqt` (temperatura de equilibrio): < 270 K "Cold"/"Frío", > 323 K "Hot"/"Caliente", entre medias sin badge (confirmado por el usuario tras T11).
- Reutiliza `components/detail/` de T11, incluidas las flechas circulares en el orden de la consulta.
- Breadcrumb "All planets / Exoplanets / <nombre>", "Back to all planets", `loading`/`error`/`not-found`.

## Archivos afectados

`src/app/[locale]/exoplanets/[slug]/{page.tsx,loading.tsx,error.tsx,not-found.tsx}`, `src/components/exoplanet/**`, `messages/*.json`.

## Pasos

1. Implementar la página con `getExoplanets()` y `getExoplanetBySlug()`.
2. Mapear los campos a `StatCard`.
3. Tests: datos completos, nulos, navegación circular, slug inexistente y error de API.

## Criterios de aceptación

- [x] Se muestran todos los campos con las unidades correctas.
- [x] Los valores nulos se muestran como "Not available".
- [x] La navegación anterior/siguiente es circular.
- [x] Un slug inválido devuelve 404.
- [x] lint, typecheck, test y build pasan.

## Notas / hallazgos

- **Páginas:** `generateStaticParams` genera 20 páginas (10 exoplanetas × 2 idiomas) con datos reales; `revalidate = 3600`. Un slug fuera de la selección (p. ej. `gj-1214-b`) → 404. Si la API falla o falta la clave, se muestra el estado de error con el breadcrumb y "Back to all planets".
- **Estructura** (igual que el planeta, sin repetir datos): hero → "Descubrimiento" (estrella anfitriona, año, método, distancia) → "Propiedades físicas" (radio, masa, densidad). El periodo orbital y la temperatura de equilibrio están en el resumen del hero; el grupo "Órbita", que solo repetía el periodo, se eliminó.
- **Badge de temperatura (D14)** con `pl_eqt`: misma lógica que los planetas, extraída al hook compartido `components/detail/useTemperatureBadge.ts`; los textos pasan a `detail.temperatureBadge`. Datos reales: DMPP-6 b (1203,65 K) → "Caliente", CD-35 2722 B b (77,39 K) → "Cold", Elias 2-24 b (sin dato) → sin badge. Spec `exoplanets` actualizada (requisito "Exoplanet temperature badge").
- **Imagen:** la misma rotación genérica que en la tarjeta del home (por posición), con la nota "Artist impression" / "Recreación artística" bajo la imagen (`imageNote`, nueva prop opcional de `DetailHero`).
- **Unidades (D8):** pársecs, radios terrestres, masas terrestres, g/cm³, días y K, traducidas. El año de descubrimiento se muestra sin separador de miles ("2026", no "2,026").
- Eyebrow "NN / Exoplanets" con la posición en la selección (orden de la consulta); flechas circulares en ese orden ("Previous exoplanet: …" / "Exoplaneta anterior: …"). Breadcrumb "All planets / Exoplanets / <nombre>" (D10), enlazado a `/#exoplanets`.
- Verificación visual (Edge headless, datos reales): `/es/exoplanets/dmpp-6-b` a 1440 px y `/en/exoplanets/cd-35-2722-b-b` a 390 px reales.
- Seguridad: ninguna credencial en `.next/static` ni en el HTML generado.
- Ver T07: el 404 de `notFound()` se renderiza en el cliente en Next 16.4.2.
- Verificación: test ✔ (357/357 en total, 12 nuevos), lint ✔, typecheck ✔, build ✔ (20 rutas de exoplaneta SSG).
