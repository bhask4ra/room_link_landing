# Estado de sesión · 2026-11-19

## [QUÉ SE LLEVA (Done)]

- Landing independiente en React/TypeScript, con departamento Three.js y cinco espacios conectados por scroll.
- Estética pastel, geometría y personajes originales, fuentes e iconos locales.
- Ejemplo interactivo de renta, perfiles ilustrativos, FAQ y diálogo informativo.
- Navegación por teclado, preferencia de movimiento reducido, opción de fijar vista y alternativa textual sin WebGL.
- Nueve pruebas pasan. Comprobaciones de tipos, formato y build pasan. Smoke sobre `dist/` y revisión visual en escritorio y móvil completados.
- Código, lockfile y documentación listos para que el usuario los lleve a un repositorio propio. Sin commits ni push.

## [QUÉ FALTA (Pending)]

No quedan pasos de implementación dentro del alcance aprobado. La publicación y conexión con una URL real de la app no forman parte de esta entrega local.

Límites: no se probaron Safari, teléfonos físicos ni GPUs de gama baja. Three.js produce una advertencia de tamaño del bundle, documentada en el README. El botón principal muestra información porque no hay un destino público confirmado.

## [QUÉ SE HIZO HOY (Today's Diff)]

- Se creó el proyecto completo en `/home/charizardbellako/Documentos/RoomLink_Landing`.
- Se aplicó landing-page-design y se adaptó la narrativa de scroll-world a 3D nativo, con autorización expresa del usuario para evitar cualquier servicio de pago.
- Se verificaron dos mutaciones temporales: tres y dos fallos de aserción, respectivamente; se restauró y verificó el estado final.
- Se revisaron 1440 × 900 y 390 × 844. La calculadora cambia los importes, el diálogo cierra con Escape y no hay enlaces internos rotos.
- Las capturas y matriz de QA están en `.docs/qa/`.
- El repo de la aplicación se consultó solo como referencia y no se editó.

## [ESPERAS EXTERNAS ABIERTAS]

Ninguna para la entrega local. El usuario decidirá posteriormente el repositorio y alojamiento de destino.

## Decisiones que deben conservarse

- No integrar esta landing dentro de `Room_Link`: el usuario está trabajando allí en paralelo y quiere otro repositorio.
- Mantener React y evitar servicios de pago; no sustituir esta implementación por videos generados con créditos.
- No convertir los ejemplos de esta página en afirmaciones sobre datos reales de usuarios, rentas o mercado.

Las versiones se obtienen de `package.json`/`package-lock.json`. No hay una versión publicada que sincronizar; se revisaron las referencias de versión de la documentación activa.
