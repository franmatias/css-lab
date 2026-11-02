# Experimentos interactivos de propiedades

Ampliación del 2 de noviembre de 2026: doce tipos de experimento reutilizables, relacionados con las lecciones de teoría. Complementan las ilustraciones y la calculadora del modelo de caja.

| Experimento             | Qué se puede cambiar                                                                 | Entrada principal                                    |
| ----------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Gradientes              | Lineal/radial, dos colores, dirección y primera parada.                              | m18, selector de experimento; m45 radial.            |
| Posición                | static, relative, absolute, fixed, sticky, desplazamientos y z-index.                | m19.                                                 |
| Transformación          | Traslación, giro, escala y origen; referencia del hueco original.                    | m22.                                                 |
| Fondos                  | cover/contain, tamaño, posición, repetición y altura; imagen de ejemplo descargable. | m18 o m24.                                           |
| Funciones               | clamp, calc, min y max; viewport y valores de comparación.                           | m10; m35 inicia en calc.                             |
| Tipografía              | Fuente, tamaño, peso, interlineado, espaciado y longitud de línea.                   | m18; m25.                                            |
| Unidades                | px, rem, em, %, vw y vh; raíz, contenedor y viewport independientes.                 | m10 o m17.                                           |
| Animación               | Distancia, duración, retardo positivo/negativo, ritmo, dirección y repeticiones.     | m23; m91 inicia en steps y m92 con retardo negativo. |
| Transición              | Dos estados de color/elevación, duración y curva de ritmo.                           | m21.                                                 |
| Sombras y transparencia | Desplazamientos, desenfoque, expansión, alfa del fondo/sombra y opacidad completa.   | m20.                                                 |
| Flexbox                 | Dirección, distribución principal, alineación transversal y gap.                     | m15.                                                 |
| Grid                    | Columnas, filas, gap y extensión del primer elemento.                                | m16.                                                 |

## Cómo se aprende

Cada experimento tiene un objetivo, controles con valores visibles, resultado, CSS generado y explicación de lo que ocurre. Incluye restauración, copia de CSS y apertura en el Laboratorio con el HTML y estilos de partida. Estos se pueden consultar en dos paneles con sintaxis y formato. El CSS generado es de solo lectura: la edición libre corresponde al Laboratorio.

Los ajustes se conservan al cambiar entre experimentos de una misma lección mientras sigue abierta. Son una exploración temporal: no completan actividades ni modifican XP o borradores del editor. La restauración afecta solo al experimento actual.

El modo de ajuste muestra el viewport real y permite desactivar la escala para examinar medidas a tamaño 1:1. Los ejemplos de funciones y unidades calculan sus explicaciones a partir de esas mismas referencias. Las diferencias mínimas de serialización decimal de los motores se comprueban con tolerancia numérica de milésimas de píxel.

## Casos que se explican explícitamente

- static ignora top/left en esta escena; relative conserva el hueco. absolute se refiere al ancestro posicionado; fixed al viewport del ejemplo aislado. sticky necesita desplazamiento y top.
- Las transformaciones no recolocan las cajas vecinas en el flujo normal.
- El alfa del fondo no atenúa el texto; opacity afecta al elemento completo.
- El CSS de fondo usa paisaje.svg, que se puede descargar. La apertura en el Laboratorio incorpora la misma imagen como datos, sin peticiones externas.
- Las animaciones no se inician solas; tienen reproducción, pausa y repetición finita. Las transiciones cambian mediante un botón utilizable con teclado. Con movimiento reducido, la animación queda estática y la transición cambia al instante.

## Aislamiento y calidad

Los controles aceptan números acotados y ajustados a su paso, opciones conocidas y colores hexadecimales; rechazan valores arbitrarios o inyección de CSS. Las escenas HTML/CSS conservan sandbox vacío y CSP restrictiva. Los ejemplos de animación y transición son elementos propios de la app con propiedades controladas, para pausar sin reiniciar su progreso; no ejecutan HTML del alumno.

Cinco pruebas de modelo comprueban normalización, CSS/HTML válidos, cálculos y referencias. Seis casos de navegador verifican los doce tipos, medidas reales, cambio de viewport, pausa y fin, movimiento reducido, fuente de solo lectura, exportación, contraste y reflujo a 320 px. La matriz repite los seis casos en Chromium, Firefox y WebKit. La verificación de producción también acciona el experimento Flexbox bajo /css-lab/.

No sustituye la revisión editorial independiente, las sesiones con estudiantes ni la auditoría manual con lector de pantalla, que siguen registradas en HUMAN_VALIDATION.md.
