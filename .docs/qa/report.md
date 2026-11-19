# Verificación de la landing

Fecha: 2026-11-19. Proyecto independiente: RoomLink_Landing.

## Matriz

| Nivel | Estado | Evidencia |
| --- | --- | --- |
| Unitario | PASSED | `npm test`: 7 pruebas de lógica/hook, límites, reversibilidad, continuidad de cámara, reparto exacto e inválidos, movimiento reducido y limpieza de observadores |
| Integración | PASSED | `npm test`: 2 pruebas de componentes: calculadora con reparto real y diálogo con estado React. 9/9 totales en 4 archivos |
| Estático | PASSED | `npm run check`, `npm run format:check`, `npm run build` |
| Smoke | PASSED | Versión `dist/` servida con `npm run preview -- --port 4174 --strictPort`; HTTP 200 y carga del canvas WebGL en navegador; CTA abre diálogo y Escape lo cierra; enlaces internos válidos |

## Evidencia de detección de errores

Dos alteraciones temporales que seguían compilando:

1. Progreso siempre cero y reparto siempre cero: **3 pruebas fallaron por aserción**, 6 pasaron.
2. Cámara que ignora el progreso y reparto que pierde el centavo restante: **2 pruebas fallaron por aserción**, 7 pasaron.

Se restauró el comportamiento y se ejecutó la suite completa: **9/9**. Ninguna mutación quedó en los archivos entregados. El adaptador de diálogo de jsdom solo reproduce `showModal`/`close`; la interacción nativa con Escape se verificó en el navegador.

## Revisión visual y funcional

- Escritorio 1440 × 900 y móvil 390 × 844 en el navegador integrado.
- Escena 3D real, cinco paradas y navegación entre habitaciones.
- Calculadora en móvil: al elegir cuatro personas cambia de $2,800 a $2,100 MXN por persona.
- Vista fija y reanudación de cámara probadas.
- Diálogo con foco inicial en Cerrar; Escape cierra y devuelve el foco al botón que lo abrió.
- En la versión compilada, sin enlaces internos rotos ni desbordamiento horizontal a 390 px.
- Importación dinámica de Three.js con estado de carga visible.

## Límites

- Sin publicación externa: entrega local para un repositorio independiente.
- No hay integración con login/backend ni URL pública de descarga. El CTA explica el proyecto.
- No se probó un teléfono físico, Safari ni GPU de gama baja. Movimiento reducido cubierto por prueba de hook y CSS; no se cambió la preferencia del sistema del usuario.
- La ruta de error por pérdida de contexto WebGL está implementada; no se forzó una pérdida de GPU durante esta revisión.
- Build avisa por el chunk de Three.js (~536 kB, ~133 kB gzip). El contenido principal se carga separado. No se modificó el umbral para ocultar el aviso.
