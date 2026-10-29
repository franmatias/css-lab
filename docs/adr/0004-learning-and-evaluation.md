# 0004 — Contenido, evaluación y progreso

Se mantiene Vue/Pinia en presentación y aplicación, con contenido independiente en `packages/content` y reglas de evaluación/puntuación en `src/domain`.

Los retos se evalúan por estrategia. Los selectores se comparan por identidad de nodos de un documento inerte, no por igualdad de texto. Los estados transitorios se reescriben mediante el AST hacia clases declaradas por el ejercicio. Los pseudoelementos se separan y se comprueban junto a sus nodos de origen. Un reto de estilo admite reglas simples sin recursos externos y comprueba estilos computados dentro de un Shadow DOM temporal que se retira siempre.

El progreso ocupa el subárbol `progress` de `csslab:v1`. Zod valida la lectura, las importaciones y los campos añadidos con valores predeterminados. Una escritura de tema o laboratorio conserva el resto del estado; los datos corruptos se respaldan antes de recuperar valores iniciales. Los cambios en otras pestañas se aplican sin volver a emitirlos, evitando ciclos de escritura.

La finalización concede XP una sola vez. Los repasos utilizan cajas de 1, 3, 7, 14 y 30 días. La racha depende del calendario local y no retrocede por cambios hacia atrás en el reloj. Todo el estado es personal y modificable por el propietario del navegador; no existe clasificación competitiva.
