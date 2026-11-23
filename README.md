# RoomLink · Tu espacio. Tu gente.

Landing independiente hecha en **React + TypeScript + Vite**, con un departamento original en **Three.js** que se recorre al hacer scroll. El proyecto vive fuera del repositorio de la aplicación y no necesita su backend.

## Abrir y desarrollar

Requiere Node.js compatible con Vite (probado con Node 22).

```bash
npm ci
npm run dev -- --port 5174
```

Abre http://localhost:5174. Para revisar la versión compilada:

```bash
npm run build
npm run preview -- --port 4174
```

Abre http://localhost:4174. El contenido publicado está en `dist/`; puede servirse con alojamiento estático. Para URLs no existentes, el alojamiento debe reescribir a `index.html` para mostrar la página 404 de RoomLink. No se configuró un proveedor ni se publicó el sitio.

## La experiencia

- Entrada → sala → cocina → habitación → balcón, dentro del mismo departamento.
- Cámara continua ligada al scroll, navegación directa a cada espacio y control para fijar la vista general.
- Muebles, plantas, gato y personas de plastilina construidos con geometría original.
- Blancos y rosa malva de la app móvil: `#D6C2D9`, `#E9DDEA`, `#F8F5F9` y `#81638B`. Manrope e iconos incluidos localmente.
- Escena a pantalla completa con un panel translúcido por etapa: aparece al llegar y desaparece durante el traslado. Opción «Ver solo el depa» para ocultar los detalles.
- Corazón animado y ocho hábitos activables. Plantas y mascota cambian en la escena; las selecciones se conservan al cambiar de habitación durante la visita.
- Calculadora ilustrativa entre 2, 3 o 4 roomies, sincronizada con una cafetera y exactamente ese número de tazas.
- Tres colores de ropa de cama, lámpara de lectura, luz de mañana/atardecer y acuerdos de convivencia seleccionables. Restablecer devuelve los valores iniciales.
- Contenido adaptable, preguntas frecuentes, diálogo informativo, teclado, movimiento reducido y alternativa textual si WebGL no está disponible.
- Sin APIs externas, claves, generación de video, suscripciones, analítica ni servicios de pago. La escena se renderiza en el navegador.

## Qué editar

| Archivo | Contenido |
| --- | --- |
| `src/App.tsx` | Historia, textos, navegación, FAQ y secciones finales |
| `src/styles.css` / `src/immersive.css` | Estilos generales / escenario, transparencias y controles |
| `src/tour/ImmersiveTour.tsx` | Etapas, navegación y estado compartido del recorrido |
| `src/tour/personalization.ts` | Preferencias, valores iniciales y cambios de estado |
| `src/components/RoomControls.tsx` / `LikeButton.tsx` | Personalización y favorito animado |
| `src/tour/apartment.ts` | Departamento y personajes originales |
| `src/tour/journey.ts` | Trayectoria de cámara, progreso y reparto de renta |
| `src/tour/ApartmentWorld.tsx` | Renderizado, luces, sombras y liberación de recursos |
| `src/tour/useJourney.ts` | Conexión del scroll y la preferencia de movimiento |
| `src/components/RentCalculator.tsx` | Ejemplo interactivo de renta |
| `src/components/InfoDialog.tsx` | Presentación de la app y avisos de la demo |

Los botones principales enlazan al inicio de sesión publicado de RoomLink. No se simulan envíos ni registros desde la landing. El perfil y la renta se etiquetan como ilustrativos. Las elecciones son una demostración local y se reinician al recargar; no se envían ni crean un perfil real.

El prototipo tiene `noindex`. Antes de publicar: revisar textos, colocar el destino real del botón y reemplazar los metadatos sociales con URL absoluta e imagen compatible con el alojamiento. `public/social.svg` es una base editable; varias redes requieren PNG/JPEG para mostrar la tarjeta.

## Verificación

```bash
npm run check
npm run format:check
npm test
npm run build
```

Las 15 pruebas cubren recorrido y transiciones, cámara, reparto de renta, diálogo, movimiento reducido, preferencias reversibles, controles ocultos, conservación del estado entre habitaciones y sincronización entre React y los objetos reales de Three.js sin recrearlos. Se comprobaron fallos intencionales antes de restaurar y aprobar la suite. Resultados y límites en [`.docs/qa/report.md`](.docs/qa/report.md).

Three.js se carga aparte del contenido inicial. Su archivo supera ligeramente el umbral de advertencia de tamaño de Vite, aunque comprimido ocupa aproximadamente 133 kB. La advertencia no se ocultó. No se ha medido rendimiento en un teléfono físico ni compatibilidad específica con Safari.

## Skills y decisión de implementación

- [landing-page-design](https://github.com/elayadesign/ai-design-skills/tree/main/skills/landing-page-design): estructura narrativa, tipografía, copy, accesibilidad y revelado del mensaje.
- [scroll-world](https://github.com/oso95/scroll-world/tree/main/skills/scroll-world): recorrido continuo, lectura por etapas y control por scroll.

La adaptación a Three.js, aprobada por el usuario, sustituye expresamente el pipeline de videos de pago de scroll-world. No se copiaron su motor ni sus assets. Los objetos son código original, las fuentes y los iconos conservan sus licencias en sus paquetes.

La fuente autoritativa de versiones es `package.json` y el conjunto reproducible está en `package-lock.json`. No se creó un repositorio remoto, commit ni push.
