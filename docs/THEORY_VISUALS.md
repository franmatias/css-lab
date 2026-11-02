# Ilustraciones y demostraciones de teoría

Entrega del 2 de noviembre de 2026. Diez ilustraciones SVG originales, locales y ampliables, vinculadas a conceptos de las lecciones. No se necesitan servicios ni imágenes externas. El estilo conserva la paleta índigo, cian y ámbar de CSS Lab.

## Qué se ha añadido

- Modelo de caja: capas de contenido, relleno, borde y margen. La calculadora muestra una caja real de 200 px y permite cambiar padding, borde y box-sizing; contrasta ancho del contenido y ancho exterior.
- Grid y diseño responsive: esquema de filas/columnas y comparación de móvil, tableta y escritorio. Una página aislada cambia entre una, dos y tres columnas en los puntos de 600 y 900 px; sus botones y deslizador controlan el viewport real.
- Movimiento: fotogramas de inicio, intermedio y final; muestra de cuatro segundos con ritmo linear, ease-in-out o steps, pausa, continuación y repetición.
- Otros apoyos: relaciones del DOM, anatomía de tablas, ejes de Flexbox, etapas de cascada, límites de clamp y transformaciones que conservan su hueco en el flujo.

Puntos de entrada: [caja](https://franmatias.github.io/css-lab/teoria/m17), [Grid y responsive](https://franmatias.github.io/css-lab/teoria/m16), [animaciones](https://franmatias.github.io/css-lab/teoria/m23), [Flexbox](https://franmatias.github.io/css-lab/teoria/m15) y [variables y funciones](https://franmatias.github.io/css-lab/teoria/m10). También se reutilizan esquemas de base en lecciones avanzadas relacionadas, sin añadirlos indiscriminadamente a todos los temas.

## Interacción y accesibilidad

La reproducción siempre la inicia el usuario. El recorrido responsive dura doce segundos, vuelve al punto de partida y se detiene; la animación de movimiento realiza una sola repetición. Ambos se pueden pausar. Se detienen al ocultar la pestaña y se cancelan al salir de la lección. No cambian borradores, respuestas ni progreso.

Con prefers-reduced-motion las reproducciones quedan desactivadas. Los botones y el deslizador conservan comparaciones estáticas. Cada ilustración tiene título, descripción, alternativa de texto, ideas explicadas y enlace al SVG original para ampliarlo. La vista responsive mantiene sandbox vacío y CSP sin scripts.

Los dibujos son esquemas explicativos, no una representación completa de todos los casos de CSS. Se indica el contexto de los ejes, las simplificaciones de cascada y el significado de la escala de la vista responsive.

## Verificación

Pruebas de navegador específicas: medidas físicas de content-box/border-box; puntos de cambio 599/600 y 899/900 px; pausa; curvas de ritmo; movimiento reducido; sandbox; alternativas de texto; contraste en ambos temas y reflujo a 320 px. Las ocho ejecuciones locales de Chromium/WebKit pasan. La matriz de CI repite los cuatro casos también en Firefox.

Una prueba adicional comprueba los enlaces entre lecciones y recursos, XML válido, títulos y descripciones de todos los SVG utilizados. El presupuesto de JavaScript inicial de Inicio sigue activo: el material visual se carga con la ruta de teoría y las imágenes usan carga diferida y dimensiones reservadas.

Código: src/features/theory/TheoryVisual.vue y theoryVisuals.ts. Recursos: public/illustrations/theory. No se declara realizada una revisión con estudiantes ni con lector de pantalla por añadir estas comprobaciones.
