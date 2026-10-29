# ADR 0001: Aislamiento del laboratorio y evaluación de selectores

- Estado: Aceptada
- Fecha: 2026-10-29

## Contexto

El laboratorio acepta HTML y CSS escrito por estudiantes. La vista previa no debe ejecutar JavaScript ni permitir que el CSS del ejercicio modifique la interfaz de CSS Lab. A la vez, el evaluador debe inspeccionar nodos y comparar resultados de selectores.

## Decisión

La vista previa se renderizará en un `iframe` con `sandbox` sin `allow-scripts` ni `allow-same-origin`. El HTML se validará y saneará antes de generar `srcdoc`; el CSS de usuario quedará confinado al documento del iframe. La evaluación consultará un documento inerte separado y aplicará límites de tamaño y de trabajo. No se habilitará JavaScript del estudiante en v1.

## Consecuencias

- La inspección del DOM del iframe no dependerá de relajar su aislamiento.
- La representación y el documento de evaluación tendrán un contrato común de contenido saneado.
- La seguridad y los selectores modernos se verificarán con pruebas en navegador antes de producir contenido en serie.
