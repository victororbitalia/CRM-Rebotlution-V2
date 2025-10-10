# Guía de Configuraciones del Sistema CRM de Restaurante

## 📋 Introducción

Esta guía explica todas las configuraciones disponibles en el sistema de gestión de reservas del restaurante, su funcionamiento real y cómo impactan en las operaciones diarias.

**Última actualización**: 10 de octubre de 2024 - Se ha implementado el sistema de notificaciones por email.

## 🏢 Pestaña General

### Información Básica del Restaurante

| Configuración | Descripción | Impacto en el Sistema |
|---------------|-------------|---------------------|
| Nombre del Restaurante | Nombre comercial del establecimiento | Se muestra en la interfaz del dashboard |
| Email | Email de contacto del restaurante | Actualmente no se utiliza para notificaciones |
| Teléfono | Teléfono de contacto | Actualmente no se utiliza para notificaciones |
| Dirección | Dirección física del restaurante | Actualmente no se utiliza en el sistema |

**Estado**: Parcialmente implementado. La información se guarda pero solo se muestra en la interfaz.

## 📅 Pestaña Reservas

### Configuración de Reservas

| Configuración | Descripción | Impacto en el Sistema |
|---------------|-------------|---------------------|
| Días máximos de anticipación | Límite de días futuros para reservar | **ACTIVO**: Limita la fecha máxima de reserva |
| Horas mínimas de anticipación | Tiempo mínimo antes de la hora actual | **ACTIVO**: Requiere antelación mínima para reservar |
| Duración por defecto (minutos) | Tiempo estimado de cada reserva | **ACTIVO**: Considerado en validación de horarios |
| Ubicación por defecto de reservas | Preferencia de ubicación al asignar mesa | **ACTIVO**: Usado en asignación automática de mesas |
| Máximo de comensales por reserva | Límite de personas por reserva | **ACTIVO**: Validado al crear reservas |
| Permitir lista de espera | Opción para esperar si no hay disponibilidad | **GUARDADO**: Sin lógica implementada |
| Requiere confirmación manual | Necesidad de aprobar reservas manualmente | **GUARDADO**: Sin lógica implementada |

### Horarios de Apertura

| Configuración | Descripción | Impacto en el Sistema |
|---------------|-------------|---------------------|
| Día de la semana (Abierto/Cerrado) | Control de días laborables | **ACTIVO**: Bloquea reservas en días cerrados |
| Hora de apertura | Hora de inicio del servicio | **ACTIVO**: Valida horarios de reserva |
| Hora de cierre | Hora de fin del servicio | **ACTIVO**: Valida horarios de reserva |

**Nota importante**: El sistema interpreta `00:00` como medianoche (fin del día), no como inicio del día.

### Reglas por Día de la Semana

| Configuración | Descripción | Impacto en el Sistema |
|---------------|-------------|---------------------|
| Máximo de reservas | Límite de reservas por día | **ACTIVO**: Bloquea reservas al alcanzar límite |
| Máximo de comensales | Límite total de personas por día | **ACTIVO**: Bloquea reservas al alcanzar límite |
| Mesas disponibles | Número de mesas operativas por día | **ACTIVO**: Considerado en disponibilidad |

## 🪑 Pestaña Mesas

### Configuración de Mesas

| Configuración | Descripción | Impacto en el Sistema |
|---------------|-------------|---------------------|
| Total de mesas | Número total de mesas del restaurante | **ACTIVO**: Base para cálculos de disponibilidad |
| Mesas reservadas siempre | Mesas no reservables online (walk-ins) | **ACTIVO**: Resta del total para reservas online |
| Porcentaje máximo de ocupación | Límite porcentual de ocupación | **GUARDADO**: Sin lógica implementada |

## 📧 Notificaciones por Email (IMPLEMENTADO)

### Configuraciones Disponibles

| Configuración | Descripción | Impacto en el Sistema |
|---------------|-------------|---------------------|
| Activar notificaciones por email | Habilita/deshabilita el sistema de emails | **ACTIVO**: Controla el envío de emails |
| Enviar email de confirmación | Envía email automático al crear reserva | **ACTIVO**: Envía email de confirmación |

### Funcionamiento

1. Cuando se crea una nueva reserva, el sistema verifica si las notificaciones por email están habilitadas
2. Si también está habilitado "Enviar email de confirmación", se envía automáticamente un email al cliente
3. El email incluye detalles de la reserva (fecha, hora, comensales) e información del restaurante
4. El sistema registra en consola el envío del email (simulado actualmente)

### Tipos de Emails Disponibles

- **Confirmación**: Enviado automáticamente al crear una reserva
- **Recordatorio**: Disponible en la API pero no automatizado aún
- **Personalizado**: Disponible en la API para envíos manuales

## ⚠️ Funcionalidades No Implementadas

Las siguientes configuraciones están disponibles en la interfaz pero su lógica no está implementada actualmente:

### Notificaciones
- Envío de emails recordatorio automáticos
- Notificaciones por SMS
- Configuración de horas de envío de recordatorios

### Políticas
- Sistema de depósitos para reservas
- Políticas de cancelación con penalizaciones
- Gestión de no-shows

### Funciones Avanzadas
- Sistema de overbooking
- Turnos de servicio (almuerzo/cena)
- Lista de espera automatizada

## 🔧 Implementación Reciente

### Sistema de Notificaciones por Email
Se ha implementado un sistema básico de notificaciones por email:
1. API para enviar diferentes tipos de emails (confirmación, recordatorio, personalizado)
2. Integración automática con la creación de reservas
3. Plantillas de email HTML con información del restaurante y detalles de la reserva
4. Validación de configuración antes de enviar emails

### Mejoras en Validación de Horarios
Se ha mejorado la validación de horarios para asegurar que:
1. Las reservas solo se permitan en días marcados como "Abierto"
2. Las horas de reserva respeten los horarios de apertura y cierre
3. La duración de la reserva no exceda el horario de cierre
4. Los mensajes de error sean más claros y específicos
5. Manejo correcto de horarios que cruzan medianoche (ej: cierre a las 01:00)

### Simplificación de la Interfaz
Se ha reestructurado la sección de ajustes para:
1. Consolidar pestañas relacionadas (horarios dentro de reservas)
2. Eliminar pestañas no implementadas temporalmente
3. Añadir sección de notificaciones por email funcionales
4. Añadir avisos sobre funcionalidades deshabilitadas
5. Mejorar la claridad de qué configuraciones están activas

## 🚀 Próximos Pasos Recomendados

1. **Implementar emails recordatorio automáticos**: Programados según configuración
2. **Desarrollar políticas simples**: Cancelaciones con antelación mínima
3. **Activar sistema de overbooking**: Si el negocio lo requiere
4. **Crear turnos de servicio**: Para diferenciar almuerzo/cena
5. **Implementar sistema de depósitos**: Para reservas de grupos grandes

## 📝 Notas Técnicas

- Todas las configuraciones se almacenan en la base de datos como JSON
- Los valores predeterminados se definen en `lib/defaultSettings.ts`
- La API de ajustes permite actualizaciones parciales con PATCH
- La validación de configuraciones se realiza tanto en frontend como backend

---

**Última actualización**: 10 de octubre de 2024
**Versión del sistema**: v2.0