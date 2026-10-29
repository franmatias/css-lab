# ADR 0003: Contenido como paquete independiente

- Estado: Aceptada
- Fecha: 2026-10-29

## Contexto

Lecciones, fichas y retos deben poder crecer y recibir contribuciones sin acoplarse a Vue ni modificar el núcleo de la aplicación.

## Decisión

En el Hito 3, los esquemas, validadores y datos pedagógicos vivirán en `packages/content`, dentro del workspace pnpm. La aplicación consumirá tipos y datos públicos del paquete; el paquete no importará componentes, stores ni utilidades de presentación.

## Consecuencias

- La validación del contenido se ejecutará de forma independiente de la interfaz.
- El paquete se probará con verificaciones de IDs, prerrequisitos y soluciones de referencia.
- El formato público tendrá versionado y documentación propios.
