# ADR 0002: Persistencia local versionada

- Estado: Aceptada
- Fecha: 2026-10-29

## Contexto

El progreso y las preferencias son privados del estudiante y deben funcionar sin cuenta ni servidor. Un cambio de esquema no debe convertir silenciosamente datos antiguos en un estado aparentemente válido.

## Decisión

Un único adaptador de infraestructura leerá y escribirá la raíz `csslab:v1`. Los datos se validarán con Zod; la forma de la raíz conserva subárboles por dominio. Datos inválidos se respaldan antes de usar valores iniciales, las migraciones se prueban y los errores de cuota o de disponibilidad se comunican explícitamente.

## Consecuencias

- Las features no accederán directamente a `localStorage`.
- Exportación e importación usarán el mismo esquema validado.
- Los cambios incompatibles requerirán una migración versionada.
