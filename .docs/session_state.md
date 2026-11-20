# Estado de sesión · 2026-11-20

## [QUÉ SE LLEVA (Done)]

- Rediseño aprobado en React, dentro del repositorio independiente RoomLink_Landing.
- Rosa malva de la app móvil; escenario completo con paneles translúcidos por etapas.
- Favorito animado, ocho preferencias, plantas/mascota vinculadas a la selección.
- Cafetera con 2/3/4 tazas enlazadas al reparto ilustrativo de renta.
- Color de cama, lámpara, mañana/atardecer, acuerdos, restablecimiento y vista sin datos.
- Estado conservado entre habitaciones, actualización de objetos sin reconstruir la escena.
- 15 pruebas pasan; tipos, formato y build aprobados. QA visual escritorio/móvil y smoke de dist.
- Documentación actualizada. Sin commits ni push.

## [QUÉ FALTA (Pending)]

No quedan pasos del alcance aprobado. Publicación y URL real de la app fuera de alcance. Límites de dispositivos y rendimiento en .docs/qa/report.md.

## [QUÉ SE HIZO HOY (Today's Diff)]

Se separaron recorrido, estado y controles; se sustituyeron columnas por escena completa y se actualizaron cámara, objetos, luces, interfaz y metadatos visuales. Dos mutaciones compilables fueron detectadas; archivos restaurados y suite completa aprobada.

## [ESPERAS EXTERNAS ABIERTAS]

Ninguna para la entrega local.

## Decisiones que deben conservarse

- Trabajar fuera de Room_Link: el usuario desarrolla la app allí en paralelo. Ese repo no se modificó.
- React y Three.js nativo, sin servicios de pago ni videos con créditos.
- Perfiles y renta ilustrativos, sin métricas inventadas de usuarios ni compatibilidad.
- Transparencia acompañada por un recorrido por etapas; el feedback está en .docs/feedback_log.md.
- Preferencias locales durante la visita, sin persistencia ni transmisión.

Versiones autoritativas en package.json/package-lock.json. Documentación activa revisada, sin versión publicada que sincronizar.
