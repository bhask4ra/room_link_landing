# Plan activo · Recorrido inmersivo y personalizable

Estado: aprobado por el usuario con «procede» el 2026-11-20. Incluye los extras propuestos.

## [OBJETIVO ACTUAL]

Rediseñar la landing React para que el departamento ocupe la pantalla y la información aparezca/desaparezca al recorrerlo. Usar la paleta rosa malva de la app móvil y conectar las interacciones con cambios reales en la escena, sin servicios de pago.

## [ARQUITECTURA/DISEÑO]

### Opciones evaluadas

1. Conservar las dos columnas y reducir la opacidad de las tarjetas. Es una modificación pequeña, pero mantiene la sensación de texto desplazándose al lado de una ilustración y no resuelve la inmersión solicitada.
2. **Recomendada: escenario 3D a pantalla completa con información por etapas.** El scroll controla la cámara y una secuencia de entrada, pausa de lectura y salida del contenido. Un solo panel activo por etapa evita que se amontonen los datos; el contenido usa fondos translúcidos ligeros y buen contraste.

No bloquear rueda/touch ni sustituir el scroll nativo. La escena queda fija durante la visita; el contenido final y las FAQ conservan desplazamiento normal. El progreso se usa para transiciones suaves en ambos sentidos. Los paneles ocultos no reciben clics ni foco. Con movimiento reducido, presentar una alternativa legible y navegable, sin vuelos ni partículas.

Separar el estado de la personalización de la trayectoria y del renderizador. React será la fuente única de preferencias, favoritos y número de personas; el mundo 3D aplicará cambios a sus objetos sin reconstruir la escena ni reiniciar la cámara. Eliminar la dependencia del estado local exclusivo de RentCalculator para sincronizarlo con la cocina. Mantener geometría/cámara, datos de preferencias y componentes interactivos con responsabilidades separadas.

### Paleta comprobada en la app móvil

- Rosa malva pastel: `#D6C2D9` (pestaña activa del feed).
- Rosa muy claro: `#E9DDEA` (superficie del selector del feed).
- Fondo casi blanco: `#F8F5F9`.
- Acento: `#81638B` (paleta de autenticación; feed utiliza `#806487`).
- Texto oscuro: `#332A37`.

Fuentes consultadas solo en lectura: `Room_Link/frontend/Room_Link/src/modulos/anuncios/PantallaAnunciosPrincipal.tsx` y `src/auth/ui.tsx`. El usuario continúa trabajando en ese repo en paralelo; todos los cambios de esta tarea se hacen en RoomLink_Landing.

### Interacciones solicitadas

1. **Favoritos:** corazones con estado activado/desactivado, pulso y pequeña dispersión de corazones al activar. Sin contadores de popularidad ficticios. Botones accesibles con `aria-pressed`; respuesta discreta sin movimiento cuando corresponda.
2. **Sala:** preferencias activables como plantas, mañanas tranquilas, cocinar, mascotas, trabajar desde casa, orden, visitas y música. Mostrar selección y resumen de convivencia de ejemplo; no inventar un porcentaje de compatibilidad real. Mantener las elecciones al cambiar de habitación y ofrecer restablecer.
3. **Cocina:** selector de dos, tres o cuatro personas enlazado tanto al cálculo de renta como a una cafetera y el número exacto de tazas visibles en 3D. Transición breve al añadir/quitar una taza; evitar reconstruir todo el departamento.

### Extras aprobados

- **Habitación:** cambiar el color de la ropa de cama y activar una lámpara de lectura para personalizar el rincón propio.
- **Balcón:** alternar iluminación de mañana/atardecer y marcar acuerdos de convivencia. Las plantas y el gato pueden responder a las preferencias de plantas/mascotas elegidas en la sala.

Extras aprobados junto con el plan.

### Restricciones

- React y Three.js existentes; sin videos generados, API de pago ni backend nuevo.
- Continuar en el repositorio independiente RoomLink_Landing. Estado inicial: rama main, árbol limpio, sin upstream.
- Sin commits ni push.
- Los dos adjuntos no están disponibles en las rutas proporcionadas. La descripción del usuario basta para preparar este plan; no se afirma haber inspeccionado las capturas.

## [PASOS DE IMPLEMENTACIÓN (Checklist)]

- [x] Revisar estado real de la landing y la paleta de la app móvil.
- [x] Identificar la limitación del layout y evaluar dos opciones.
- [x] Acordar plan y extras.
- [x] Sustituir columnas por escena completa y contenido temporal por etapas.
- [x] Aplicar paleta rosa malva a interfaz y objetos principales del departamento.
- [x] Crear estado de preferencias/favoritos/personas y componentes accesibles.
- [x] Añadir animación de corazones y selección de hábitos.
- [x] Construir cafetera y tazas, conectadas al reparto de renta.
- [x] Implementar los extras que el usuario acepte.
- [x] Verificar móvil, escritorio, navegación por teclado y movimiento reducido.
- [x] Ejecutar tests unitarios/integración, tipos, formato, build y smoke visual.
- [x] Actualizar README, QA y estado; archivar el plan al cerrar.

## [CRITERIOS DE ACEPTACIÓN]

- El departamento ocupa el escenario web completo; no hay una columna de texto desplazándose en paralelo.
- La información entra y sale en momentos definidos; no hay dos tarjetas activas superpuestas ni controles invisibles enfocables.
- Tipografía legible con las nuevas transparencias en todos los encuadres.
- Paleta coherente con los colores comprobados de la app móvil.
- Favorito reversible y preferencias que se conservan durante la visita.
- Elegir N personas muestra N tazas y una renta por persona coherente.
- Las interacciones modifican objetos existentes sin saltar la cámara al inicio.
- Pruebas de estado, sincronización React/escena, transiciones y accesibilidad; suite y build finales aprobados.
- Sin costos externos, publicaciones ni cambios al repo de la app móvil.

## Resultado

Completado 2026-11-20. Suite 15/15, tipos, formato y build aprobados. Revisión 1440 × 900 y 390 × 844; smoke de dist. Se añadió «Ver solo el depa» para despejar la escena sin perder elecciones. Evidencia y límites en ../qa/report.md. Sin commits ni push.
