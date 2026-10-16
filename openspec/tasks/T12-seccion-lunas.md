# T12 — Sección de lunas colapsable

- **Estado:** Pendiente
- **Depende de:** T11

## Objetivo

Añadir al detalle de planeta la sección "Moons (N)", plegada por defecto, que carga los datos de las lunas al expandirse.

## Requisitos

- PROJECT.md §3: la sección está colapsada por defecto, carga los datos vía `rel` al expandir y muestra radio, masa, densidad y gravedad, o "Not available".
- Se muestran **como máximo 10 lunas** (D11); con más, aparece el texto indicado en C4. N es el total real.
- Con 0 lunas: "Moons (0)" y un mensaje de que no hay lunas conocidas, sin peticiones.
- Disclosure accesible (`button` + `aria-expanded` + `aria-controls`).
- Las peticiones van a un Route Handler propio (`/api/moons/[id]`) que añade el token en servidor y valida el id (D3, T05).
- Estado de carga y error por luna; caché en el cliente para no repetir peticiones al plegar y desplegar.

## Archivos afectados

`src/app/api/moons/[id]/route.ts` (+ test), `src/components/planet/MoonsSection/*`, `messages/*.json`.

## Pasos

1. Implementar el Route Handler: valida el id, llama a `getMoon` y devuelve errores saneados.
2. Implementar el componente cliente con su estado de expansión y la carga.
3. Tests: plegada por defecto, ninguna petición antes de expandir, como máximo 10 peticiones, caso de 0 lunas, expansión con teclado, éxito, error y valores ausentes.

## Criterios de aceptación

- [ ] Plegada por defecto; no hay peticiones hasta expandir.
- [ ] Nunca se piden más de 10 lunas.
- [ ] El token no aparece en ninguna petición del navegador.
- [ ] lint, typecheck, test y build pasan.

## Notas / hallazgos

—
