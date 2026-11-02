# Validación con personas

Estado a 2 de noviembre de 2026: **guiones preparados, sesiones no realizadas**. No hay resultados de estudiantes ni una auditoría con lector de pantalla aportados al proyecto. Las comprobaciones automáticas no cierran estos criterios.

## Dos rondas con estudiantes

Participantes: cinco estudiantes de 1.º DAM por ronda, con distintos niveles de experiencia en CSS. Usar códigos E01–E05 y E06–E10; no registrar nombres, correos ni otros datos personales. Duración orientativa: 30–40 minutos. Primera ronda para detectar problemas; segunda, después de corregirlos, para verificar tareas equivalentes con otras personas.

Antes de empezar, anotar versión de la app, navegador, dispositivo y experiencia previa. Explicar que se evalúa la aplicación. Pedir que piensen en voz alta; no enseñarles la solución. Se permite usar las ayudas que ofrece la app. Registrar la ayuda externa del observador por separado.

| Tarea       | Consigna al estudiante                                            | Señal de éxito                                                            |
| ----------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Orientación | Encuentra una lección para aprender a dar espacio a una tarjeta.  | Localiza contenido pertinente y explica el objetivo.                      |
| Teoría      | Lee la lección, modifica el ejemplo y responde el cuestionario.   | Explica el cambio, recibe feedback y distingue completado de pendiente.   |
| Propiedades | Resuelve Margen exterior; consulta una pista si la necesitas.     | Aplica 24 px y entiende las cuatro comprobaciones. Repetir no duplica XP. |
| Catálogo    | Encuentra un ejemplo con nth-child y guárdalo.                    | Distingue posición y tipo, prueba el selector y recupera el favorito.     |
| Taller      | Avanza en un taller de listas o Flexbox y retómalo tras recargar. | Identifica el paso actual y conserva el código y los pasos hechos.        |
| Laboratorio | Carga una plantilla, selecciona un nodo DOM y cambia su CSS.      | Relaciona nodo, selector y borde; deselecciona y prueba móvil.            |
| Juego       | Completa una misión de tablas y otra de Grid.                     | Comprende el objetivo, observa el resultado y explica la solución.        |
| Referencia  | Abre la guía, busca clamp y vuelve al editor.                     | Encuentra la referencia sin perder su código ni el punto de trabajo.      |
| Progreso    | Identifica lo completado y exporta una copia.                     | Encuentra progreso, insignias y copia; entiende que el guardado es local. |

Al terminar: pedir que valoren claridad, facilidad y motivación de 1 a 5; preguntar qué cambiarían primero y qué concepto sigue siendo confuso. No convertir satisfacción en evidencia de aprendizaje: pedir que expliquen con sus palabras una solución y resuelvan una variante breve.

### Hoja por sesión

- Código de participante, ronda, fecha, observador, versión y entorno:
- Experiencia previa y necesidades de interacción que quiera comunicar:
- Por tarea: completada / con ayuda / no completada; tiempo; pistas; error observado; cita breve sin datos personales:
- Explicación del concepto y resultado de la variante:
- Valoraciones y comentario final:

### Registro de incidencias y cierre

| ID                    | Ronda/tarea | Evidencia | Impacto | Causa y corrección | Versión | Reprueba | Estado       |
| --------------------- | ----------- | --------- | ------- | ------------------ | ------- | -------- | ------------ |
| Pendiente de sesiones | —           | —         | —       | —                  | —       | —        | Sin ejecutar |

Prioridades: P0 impide trabajar o pierde datos; P1 impide completar una tarea sin ayuda externa; P2 confunde pero permite continuar; P3 mejora visual o de redacción. No cerrar una incidencia por un commit: registrar la reprueba. Cierre: diez sesiones documentadas, problemas P0/P1 corregidos y tareas afectadas repetidas; dejar explícitas las limitaciones de una muestra pequeña.

## Auditoría manual de accesibilidad

Responsable y fecha: pendientes. Registrar versiones reales: NVDA + Firefox/Chrome en Windows y, si se dispone, VoiceOver + Safari en macOS/iOS. La matriz automatizada usa WebKit; no acredita una prueba con Safari ni VoiceOver. No instalar ni activar lectores de pantalla sin acordarlo con quien use el equipo.

| Recorrido           | Qué comprobar                                                                                                                    | Estado       |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Teclado             | Desde recarga: salto a contenido, menú, enlaces, filtros y botones; orden lógico, foco visible, sin trampas.                     | Sin ejecutar |
| Editor y Emmet      | Nombre anunciado, lectura y edición de varias líneas, Tab/expansión, campos de snippet, Escape para salir; sin perder el código. | Sin ejecutar |
| Diálogos            | Guía e insignias: nombre, foco inicial, navegación contenida, cierre por Escape y devolución al botón de apertura.               | Sin ejecutar |
| DOM y vista         | Nombre y estado seleccionado de nodos, selección/desselección por teclado; el objetivo no depende solo del color.                | Sin ejecutar |
| Feedback            | Errores, aciertos y recompensas se anuncian una vez y no desplazan el foco inesperadamente.                                      | Sin ejecutar |
| Talleres y juegos   | Paso actual y completados comprensibles; alternativa por foco al hover; instrucciones y corrección accesibles.                   | Sin ejecutar |
| Ampliación          | Zoom real del navegador al 200 % y 400 %; reflujo a 320 px; controles y texto utilizables sin ocultación.                        | Sin ejecutar |
| Preferencias        | Claro/oscuro, contraste, fuente de lectura, movimiento reducido y celebraciones desactivadas.                                    | Sin ejecutar |
| Material de ejemplo | Tablas con cabeceras, formularios con etiquetas, navegación y contenido semántico dentro de vistas aisladas.                     | Sin ejecutar |
| Móvil               | Controles táctiles y orientación; lectura con VoiceOver/TalkBack cuando estén disponibles.                                       | Sin ejecutar |

Registrar por incidencia: ruta, pasos, resultado esperado/observado, navegador/lector, severidad, evidencia, corrección y reprueba. Las vistas con sandbox impiden que axe inyecte scripts: su exclusión de las auditorías automáticas exige revisar el material de ejemplo manualmente. No declarar conformidad WCAG completa a partir de axe o Lighthouse.

## Revisión editorial independiente

Revisar las 100 lecciones, 100 fichas y 100 retos, además de los itinerarios iniciales, con un segundo docente. Los controles automáticos verifican estructura, enlaces internos, objetivos seleccionables y soluciones; no verifican calidad didáctica, dificultad ni tiempo de aprendizaje.

Hoja por contenido: ID; exactitud de cada afirmación; objetivo observable; explicación y lista de ideas; ejemplo correcto y variante; error habitual pertinente; cuestionario sin ambigüedad y distractores plausibles; referencias específicas; nivel y tiempo; relación con conocimientos previos; redundancias; corrección y revisor. Priorizar primero una muestra por categoría para detectar patrones repetidos y después revisar la colección completa.

La revisión queda cerrada cuando cada ID tiene responsable y resultado, se corrigen los errores y se reprueban los ejemplos afectados. Por ahora permanece **pendiente**.
