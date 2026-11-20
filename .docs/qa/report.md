# Verificación del rediseño inmersivo

Fecha: 2026-11-20. Proyecto independiente: RoomLink_Landing.

## Matriz

| Nivel | Estado | Evidencia |
| --- | --- | --- |
| Unitario | PASSED | Progreso, límites, continuidad, entrada/salida de contenido, reparto exacto, movimiento reducido y limpieza |
| Integración | PASSED | Controles React y reducer conectados a objetos Three.js reales: tazas, plantas, gato, cama, lámpara; favorito, acuerdos, restablecer y conservación entre etapas. 15/15 pruebas en 6 archivos |
| Estático | PASSED | npm run check, npm run format:check, npm run build |
| Smoke | PASSED | dist en puerto 4174; canvas WebGL, navegación, cocina y teclado |

## Sensibilidad de las pruebas

Dos mutaciones temporales compilables, ejecutadas en las cinco pruebas de personalización y recorrido:

1. Reducer ignora el número elegido y conserva tres personas: 2 fallos, 3 pasan.
2. Cocina siempre muestra tres tazas: 2 fallos, 3 pasan (sincronización y animación).

Archivos restaurados inmediatamente. Suite final completa: 15/15. Las pruebas de escena usan geometría real; solo el test de paneles sustituye la frontera de GPU.

## Revisión visual y funcional

- Escritorio 1440 × 900 y móvil 390 × 844 en navegador integrado.
- Escenario fijo y un solo panel activo, con entrada/salida por scroll.
- Paneles ocultos con inert y aria-hidden; movimiento reducido verificado por tests.
- «Ver solo el depa» oculta los detalles y permite recuperarlos sin borrar preferencias.
- Like reversible, plantas/gato visibles u ocultos, cama malva, lámpara y atardecer comprobados visualmente.
- Cuatro personas: $2,100 MXN de ejemplo y cuatro tazas. Repartos 2/3/4 cubiertos en integración.
- Sin desbordamiento horizontal ni enlaces internos rotos a 390 px. Navegación con Enter y selección con Space.
- Capturas: redesign-mobile.jpg, redesign-desktop.jpg y redesign-sala.jpg.

## Límites

- Entrega local, sin publicación, backend ni destino público de descarga. CTA informativo.
- Preferencias en memoria durante la visita; recargar restablece la demostración.
- No se probó teléfono físico, Safari ni GPU de gama baja. No se cambió la preferencia del sistema del usuario.
- Fallback WebGL implementado; no se forzó pérdida de GPU.
- Aviso de build por Three.js: 538.19 kB / 133.45 kB gzip, separado del contenido inicial. No se ocultó.
