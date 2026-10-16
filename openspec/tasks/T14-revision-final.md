# T14 — Revisión final y sincronización de specs

- **Estado:** Pendiente
- **Depende de:** T10, T11, T12, T13

## Objetivo

Verificar el conjunto (datos, i18n, accesibilidad, responsive y seguridad) y dejar OpenSpec actualizado.

## Requisitos

- Revisión con la skill `astronomy-review`: mapeo de campos, unidades, valores ausentes e identificación de planetas y exoplanetas.
- i18n: las dos versiones recorridas por completo; no queda texto sin traducir.
- Accesibilidad: navegación completa por teclado, foco visible, landmarks, `alt` en todas las imágenes y contraste AA.
- Responsive: comparación con los 4 mockups (≈390px y 1440px), sin scroll horizontal.
- Seguridad: no hay tokens en el bundle del cliente (búsqueda en `.next/static`), en el repo ni en los logs.
- Revisar en el navegador las páginas 404 (`notFound()` se renderiza en el cliente en Next 16.4.2, ver T07) y si una versión posterior de Next lo corrige.
- Sincronizar o archivar el cambio de OpenSpec (`/opsx:sync`, `/opsx:archive`).

## Archivos afectados

Solo las correcciones puntuales que salgan de la revisión (cada una aprobada por separado), `openspec/specs/**` y este directorio.

## Pasos

1. Ejecutar lint, typecheck, test y build.
2. Ejecutar `astronomy-review` y presentar los hallazgos.
3. Revisión manual de responsive, accesibilidad e i18n.
4. Buscar credenciales en el build y en el repo.
5. Sincronizar las specs y actualizar el README de tareas.

## Criterios de aceptación

- [ ] Todos los checks pasan, con salida registrada.
- [ ] Los hallazgos de `astronomy-review` están resueltos o documentados.
- [ ] No se encuentra ningún token en `.next/static` ni en el repo.
- [ ] `openspec/specs/` refleja lo implementado.

## Notas / hallazgos

—
