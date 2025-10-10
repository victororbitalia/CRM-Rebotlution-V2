# 📚 Documentación de la API - REBOTLUTION Restaurant CRM

## 🌐 URL Base
```
http://localhost:3001/api
```

En producción, reemplaza `localhost:3001` con tu dominio.

---

## 📋 Índice
1. [Reservas](#reservas)
2. [Mesas](#mesas)
3. [Configuración](#configuración)
4. [Estadísticas](#estadísticas)
5. [Códigos de Estado HTTP](#códigos-de-estado-http)
6. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🎫 Reservas

### 1. Listar todas las reservas
Obtiene una lista de todas las reservas con filtros opcionales.

**Endpoint:** `GET /api/reservations`

**Parámetros de consulta (opcionales):**
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `date` | string | Filtrar por fecha (YYYY-MM-DD) | `2024-10-04` |
| `status` | string | Filtrar por estado | `pending`, `confirmed`, `seated`, `completed`, `cancelled` |
| `tableId` | string | Filtrar por mesa asignada | `table-1` |
| `name` | string | Buscar por nombre del cliente (contiene, case-insensitive) | `ana` |
| `phone` | string | Buscar por teléfono del cliente (contiene) | `+34 600` |
| `time` | string | Filtrar por hora exacta (HH:MM) | `20:00` |

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "res-1",
      "customerName": "María García",
      "customerEmail": "maria@email.com",
      "customerPhone": "+34 612 345 678",
      "date": "2024-10-04T00:00:00.000Z",
      "time": "13:00",
      "guests": 2,
      "tableId": "table-1",
      "status": "confirmed",
      "specialRequests": "Mesa junto a la ventana",
      "createdAt": "2024-10-04T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

**Ejemplo de uso:**
```bash
# Todas las reservas
curl http://localhost:3001/api/reservations

# Reservas de hoy con estado confirmado
curl "http://localhost:3001/api/reservations?date=2024-10-04&status=confirmed"
```

---

### 2. Obtener una reserva específica
Obtiene los detalles de una reserva por su ID.

**Endpoint:** `GET /api/reservations/:id`

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string | ID de la reserva |

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "res-1",
    "customerName": "María García",
    "customerEmail": "maria@email.com",
    "customerPhone": "+34 612 345 678",
    "date": "2024-10-04T00:00:00.000Z",
    "time": "13:00",
    "guests": 2,
    "tableId": "table-1",
    "status": "confirmed",
    "specialRequests": "Mesa junto a la ventana",
    "createdAt": "2024-10-04T10:30:00.000Z"
  }
}
```

**Respuesta de error (404):**
```json
{
  "success": false,
  "error": "Reserva no encontrada"
}
```

**Ejemplo de uso:**
```bash
curl http://localhost:3001/api/reservations/res-1
```

---

### 3. Crear nueva reserva
Crea una nueva reserva en el sistema con validación de capacidad.

**Endpoint:** `POST /api/reservations`

**Body (JSON):**
```json
{
  "customerName": "Juan Pérez",
  "customerEmail": "juan@email.com",
  "customerPhone": "+34 600 123 456",
  "date": "2024-10-05",
  "time": "20:00",
  "guests": 4,
  "preferredLocation": "interior",
  "tableId": "table-3",
  "specialRequests": "Cumpleaños"
}
```

**Campos requeridos:**
| Campo | Tipo | Descripción | Validación |
|-------|------|-------------|------------|
| `customerName` | string | Nombre del cliente | Requerido |
| `customerEmail` | string | Email del cliente | Requerido, formato email válido |
| `customerPhone` | string | Teléfono del cliente | Requerido |
| `date` | string | Fecha de la reserva | Requerido, formato YYYY-MM-DD |
| `time` | string | Hora de la reserva | Requerido, formato HH:MM |
| `guests` | number | Número de comensales | Requerido, entre 1 y 20 |

**Campos opcionales:**
| Campo | Tipo | Descripción | Default |
|-------|------|-------------|---------|
| `tableId` | string | ID de la mesa asignada | `undefined` |
| `preferredLocation` | string | Preferencia de ubicación para asignación automática (`interior`, `exterior`, `terraza`, `privado`, `any`) | `any` o `defaultPreferredLocation` |
| `status` | string | Estado inicial | `pending` |
| `specialRequests` | string | Peticiones especiales | `undefined` |

**Validaciones de Capacidad:**
- ✅ Verifica que el restaurante esté abierto el día solicitado
- ✅ Valida límite de reservas por día (`maxReservations`)
- ✅ Valida límite de comensales totales por día (`maxGuestsTotal`)
- ✅ Verifica disponibilidad de mesa específica (si se proporciona)
- ✅ Valida que la mesa no esté ya reservada en la misma fecha y hora
- ✅ Valida que la fecha no sea pasada (no se permiten reservas en el pasado)
- ✅ Valida `maxAdvanceDays` de la configuración (no se permiten reservas con más anticipación que el permitido)

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": "res-123456789",
    "customerName": "Juan Pérez",
    "customerEmail": "juan@email.com",
    "customerPhone": "+34 600 123 456",
    "date": "2024-10-05T00:00:00.000Z",
    "time": "20:00",
    "guests": 4,
    "tableId": "table-3",
    "status": "pending",
    "specialRequests": "Cumpleaños",
    "createdAt": "2024-10-04T11:00:00.000Z"
  },
  "message": "Reserva creada exitosamente"
}
```

**Respuestas de Error de Capacidad (409):**

**Restaurante cerrado:**
```json
{
  "success": false,
  "error": "El restaurante no está abierto este día"
}
```

**Límite de reservas alcanzado:**
```json
{
  "success": false,
  "error": "No hay disponibilidad para este día. Límite de reservas alcanzado.",
  "details": {
    "maxReservations": 50,
    "currentReservations": 50,
    "availableSlots": 0
  }
}
```

**Límite de comensales alcanzado:**
```json
{
  "success": false,
  "error": "No hay disponibilidad para este día. Límite de comensales alcanzado.",
  "details": {
    "maxGuestsTotal": 100,
    "currentGuests": 95,
    "requestedGuests": 8,
    "availableGuests": 5
  }
}
```

**Error: Fecha pasada:**
```json
{
  "success": false,
  "error": "No se pueden crear reservas en fechas pasadas"
}
```

**Error: Excede máximo de días de antelación:**
```json
{
  "success": false,
  "error": "No se pueden crear reservas con más de 30 días de anticipación"
}
```

**Mesa ya reservada:**
```json
{
  "success": false,
  "error": "La mesa ya está reservada para esta fecha y hora",
  "details": {
    "tableId": "table-1",
    "conflictingTime": "20:00",
    "conflictingReservationId": "reservation-2"
  }
}
```

**Respuesta de error (400):**
```json
{
  "success": false,
  "error": "Faltan datos del cliente (nombre, email, teléfono)"
}
```

**Ejemplo de uso:**
```bash
curl -X POST http://localhost:3001/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Juan Pérez",
    "customerEmail": "juan@email.com",
    "customerPhone": "+34 600 123 456",
    "date": "2024-10-05",
    "time": "20:00",
    "guests": 4,
    "preferredLocation": "interior"
  }'
```

---

### 4. Actualizar reserva (parcial)
Actualiza los datos de una reserva existente. Solo se actualizan los campos enviados; los campos omitidos permanecen sin cambios. Los campos opcionales enviados como `null` se limpian.

**Endpoint:** `PUT /api/reservations/:id`

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string | ID de la reserva |

**Body (JSON):**
```json
{
  "customerName": "Juan Pérez Actualizado",
  "customerEmail": "juan.nuevo@email.com",
  "customerPhone": "+34 600 999 888",
  "date": "2024-10-06",
  "time": "21:00",
  "guests": 6,
  "tableId": "table-5",
  "status": "confirmed",
  "specialRequests": "Aniversario"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "res-1",
    "customerName": "Juan Pérez Actualizado",
    "customerEmail": "juan.nuevo@email.com",
    "customerPhone": "+34 600 999 888",
    "date": "2024-10-06T00:00:00.000Z",
    "time": "21:00",
    "guests": 6,
    "tableId": "table-5",
    "status": "confirmed",
    "specialRequests": "Aniversario",
    "createdAt": "2024-10-04T10:30:00.000Z"
  },
  "message": "Reserva actualizada exitosamente"
}
```

Notas importantes:
- Los campos no incluidos en el body no se modifican.
- Para limpiar un campo opcional como `specialRequests`, envía el valor `null`.
- Si solo vas a cambiar el estado, también puedes usar el endpoint específico `PATCH /api/reservations/:id/status`.

Ejemplos adicionales:

1) Actualizar solo teléfono y hora
```bash
curl -X PUT http://localhost:3001/api/reservations/res-1 \
  -H "Content-Type: application/json" \
  -d '{
    "customerPhone": "+34 600 222 111",
    "time": "22:00"
  }'
```

2) Borrar notas (`specialRequests`)
```bash
curl -X PUT http://localhost:3001/api/reservations/res-1 \
  -H "Content-Type: application/json" \
  -d '{
    "specialRequests": null
  }'
```

**Ejemplo de uso:**
```bash
curl -X PUT http://localhost:3001/api/reservations/res-1 \
  -H "Content-Type: application/json" \
  -d '{
    "guests": 6,
    "status": "confirmed"
  }'
```

---

### 5. Cambiar estado de reserva
Actualiza únicamente el estado de una reserva (endpoint optimizado).

**Endpoint:** `PATCH /api/reservations/:id/status`

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string | ID de la reserva |

**Body (JSON):**
```json
{
  "status": "confirmed"
}
```

**Estados válidos:**
- `pending` - Pendiente de confirmación
- `confirmed` - Confirmada
- `seated` - Cliente sentado en la mesa
- `completed` - Servicio completado
- `cancelled` - Cancelada

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "res-1",
    "customerName": "María García",
    "customerEmail": "maria@email.com",
    "customerPhone": "+34 612 345 678",
    "date": "2024-10-04T00:00:00.000Z",
    "time": "13:00",
    "guests": 2,
    "tableId": "table-1",
    "status": "confirmed",
    "specialRequests": "Mesa junto a la ventana",
    "createdAt": "2024-10-04T10:30:00.000Z"
  },
  "message": "Estado actualizado a: confirmed"
}
```

**Ejemplo de uso:**
```bash
curl -X PATCH http://localhost:3001/api/reservations/res-1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

---

### 6. Eliminar reserva
Elimina una reserva del sistema.

**Endpoint:** `DELETE /api/reservations/:id`

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string | ID de la reserva |

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "res-1",
    "customerName": "María García",
    "customerEmail": "maria@email.com",
    "customerPhone": "+34 612 345 678",
    "date": "2024-10-04T00:00:00.000Z",
    "time": "13:00",
    "guests": 2,
    "tableId": "table-1",
    "status": "cancelled",
    "createdAt": "2024-10-04T10:30:00.000Z"
  },
  "message": "Reserva eliminada exitosamente"
}
```

**Ejemplo de uso:**
```bash
curl -X DELETE http://localhost:3001/api/reservations/res-1
```

---

## 🪑 Mesas

### 1. Listar todas las mesas
Obtiene una lista de todas las mesas con filtros opcionales.

**Endpoint:** `GET /api/tables`

**Parámetros de consulta (opcionales):**
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `location` | string | Filtrar por ubicación | `interior`, `exterior`, `terraza`, `privado` |
| `available` | boolean | Filtrar por disponibilidad | `true`, `false` |
| `minCapacity` | number | Capacidad mínima requerida | `4` |

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "table-1",
      "number": 1,
      "capacity": 2,
      "location": "interior",
      "isAvailable": true
    },
    {
      "id": "table-2",
      "number": 2,
      "capacity": 4,
      "location": "exterior",
      "isAvailable": false
    }
  ],
  "count": 2
}
```

**Ejemplo de uso:**
```bash
# Todas las mesas
curl http://localhost:3001/api/tables

# Mesas disponibles en el interior con capacidad mínima de 4
curl "http://localhost:3001/api/tables?location=interior&available=true&minCapacity=4"
```

---

### 2. Obtener una mesa específica
Obtiene los detalles de una mesa por su ID.

**Endpoint:** `GET /api/tables/:id`

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string | ID de la mesa |

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "table-1",
    "number": 1,
    "capacity": 2,
    "location": "interior",
    "isAvailable": true
  }
}
```

**Ejemplo de uso:**
```bash
curl http://localhost:3001/api/tables/table-1
```

---

### 3. Actualizar estado de mesa
Actualiza la disponibilidad de una mesa.

**Endpoint:** `PUT /api/tables/:id`

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string | ID de la mesa |

**Body (JSON):**
```json
{
  "isAvailable": false
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "table-1",
    "number": 1,
    "capacity": 2,
    "location": "interior",
    "isAvailable": false
  },
  "message": "Mesa actualizada exitosamente"
}
```

**Ejemplo de uso:**
```bash
curl -X PUT http://localhost:3001/api/tables/table-1 \
  -H "Content-Type: application/json" \
  -d '{"isAvailable": false}'
```

---

### 4. Verificar disponibilidad
Verifica qué mesas están disponibles para una fecha, hora y número de comensales específicos.

**Endpoint:** `GET /api/tables/availability`

**Parámetros de consulta (requeridos):**
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `date` | string | Fecha de la reserva | `2024-10-05` |
| `time` | string | Hora de la reserva | `20:00` |
| `guests` | number | Número de comensales | `4` |

**Parámetros de consulta (opcionales):**
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `location` | string | Ubicación preferida | `interior`, `exterior`, `terraza`, `privado` |

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "available": true,
    "tables": [
      {
        "id": "table-3",
        "number": 3,
        "capacity": 4,
        "location": "interior",
        "isAvailable": true
      },
      {
        "id": "table-5",
        "number": 5,
        "capacity": 6,
        "location": "interior",
        "isAvailable": true
      }
    ],
    "count": 2,
    "requestedFor": {
      "date": "2024-10-05",
      "time": "20:00",
      "guests": 4,
      "location": "any"
    }
  }
}
```

**Ejemplo de uso:**
```bash
curl "http://localhost:3001/api/tables/availability?date=2024-10-05&time=20:00&guests=4"

# Con ubicación específica
curl "http://localhost:3001/api/tables/availability?date=2024-10-05&time=20:00&guests=4&location=terraza"
```

---

## ⚙️ Configuración

### 1. Obtener configuración actual
Obtiene toda la configuración del restaurante.

**Endpoint:** `GET /api/settings`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "settings-1",
    "restaurantName": "REBOTLUTION Restaurant",
    "email": "info@cofradia.com",
    "phone": "+34 900 123 456",
    "address": "Calle Principal, 123, Madrid",
    "schedule": {
      "monday": {
        "isOpen": true,
        "openTime": "12:00",
        "closeTime": "23:00"
      },
      "tuesday": {
        "isOpen": true,
        "openTime": "12:00",
        "closeTime": "23:00"
      }
      // ... resto de días
    },
    "reservations": {
      "maxAdvanceDays": 30,
      "minAdvanceHours": 2,
      "defaultDuration": 120,
      "maxGuestsPerReservation": 12,
      "minGuestsPerReservation": 1,
      "allowWaitlist": true,
      "requireConfirmation": false,
      "autoConfirmAfterMinutes": 30,
      "defaultPreferredLocation": "any"
    },
    "tables": {
      "totalTables": 10,
      "reservedTablesAlways": 2,
      "maxOccupancyPercentage": 100,
      "allowOverbooking": false,
      "overbookingPercentage": 0
    },
    "weekdayRules": {
      "monday": {
        "day": "monday",
        "maxReservations": 20,
        "maxGuestsTotal": 40,
        "tablesAvailable": 8
      }
      // ... resto de días
    },
    "serviceTurns": [
      {
        "id": "turn-1",
        "name": "Almuerzo",
        "startTime": "12:00",
        "endTime": "16:00",
        "maxReservations": 15,
        "daysOfWeek": [1, 2, 3, 4, 5, 6, 0]
      }
    ],
    "notifications": {
      "emailEnabled": true,
      "smsEnabled": false,
      "reminderHoursBefore": 24,
      "sendConfirmationEmail": true,
      "sendReminderEmail": true
    },
    "policies": {
      "cancellationHours": 24,
      "noShowPolicy": "Se bloqueará la posibilidad de reservar en el futuro",
      "depositRequired": false,
      "depositAmount": 0
    },
    "updatedAt": "2024-10-04T12:00:00.000Z"
  }
}
```

**Ejemplo de uso:**
```bash
curl http://localhost:3001/api/settings
```

---

### 2. Actualizar configuración completa
Actualiza toda la configuración del restaurante.

**Endpoint:** `PUT /api/settings`

**Body (JSON):**
```json
{
  "restaurantName": "Nuevo Nombre",
  "email": "nuevo@email.com",
  "phone": "+34 900 999 888",
  "reservations": {
    "maxAdvanceDays": 60,
    "minAdvanceHours": 4,
    "defaultDuration": 90,
    "maxGuestsPerReservation": 15,
    "minGuestsPerReservation": 1,
    "allowWaitlist": true,
    "requireConfirmation": true,
    "autoConfirmAfterMinutes": 60
  },
  "tables": {
    "totalTables": 12,
    "reservedTablesAlways": 3,
    "maxOccupancyPercentage": 90,
    "allowOverbooking": true,
    "overbookingPercentage": 10
  }
}
```

**Validaciones:**
- `maxAdvanceDays`: Entre 1 y 365
- `maxGuestsPerReservation`: Entre 1 y 50
- `totalTables`: Mínimo 1
- `reservedTablesAlways`: Menor que `totalTables`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "settings-1",
    "restaurantName": "Nuevo Nombre",
    // ... toda la configuración actualizada
    "updatedAt": "2024-10-04T13:00:00.000Z"
  },
  "message": "Configuración actualizada exitosamente"
}
```

**Respuesta de error (400):**
```json
{
  "success": false,
  "error": "Los días máximos de anticipación deben estar entre 1 y 365"
}
```

**Ejemplo de uso:**
```bash
curl -X PUT http://localhost:3001/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "tables": {
      "totalTables": 12,
      "reservedTablesAlways": 2
    }
  }'
```

---

### 3. Actualizar configuración parcial
Actualiza solo algunos campos de la configuración.

**Endpoint:** `PATCH /api/settings`

**Body (JSON):**
```json
{
  "restaurantName": "REBOTLUTION Actualizado",
  "notifications": {
    "emailEnabled": true,
    "reminderHoursBefore": 48
  }
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    // ... configuración actualizada
  },
  "message": "Configuración actualizada exitosamente"
}
```

**Ejemplo de uso:**
```bash
curl -X PATCH http://localhost:3001/api/settings \
  -H "Content-Type: application/json" \
  -d '{"restaurantName": "Nuevo Nombre"}'
```

---

### 4. Obtener reglas de un día específico
Obtiene la configuración de capacidad y límites para un día de la semana.

**Endpoint:** `GET /api/settings/weekday/:day`

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción | Valores válidos |
|-----------|------|-------------|-----------------|
| `day` | string | Día de la semana | `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday` |

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "day": "friday",
    "maxReservations": 30,
    "maxGuestsTotal": 60,
    "tablesAvailable": 10,
    "specialRules": "Fin de semana - capacidad completa"
  }
}
```

**Ejemplo de uso:**
```bash
# Obtener configuración del viernes
curl http://localhost:3001/api/settings/weekday/friday
```

---

### 5. Actualizar reglas de un día específico
Actualiza la configuración de capacidad para un día de la semana.

**Endpoint:** `PUT /api/settings/weekday/:day`

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `day` | string | Día de la semana |

**Body (JSON):**
```json
{
  "maxReservations": 35,
  "maxGuestsTotal": 70,
  "tablesAvailable": 10,
  "specialRules": "Capacidad máxima fin de semana"
}
```

**Validaciones:**
- `maxReservations`: No puede ser negativo
- `tablesAvailable`: No puede exceder el total de mesas del restaurante

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "day": "friday",
    "maxReservations": 35,
    "maxGuestsTotal": 70,
    "tablesAvailable": 10,
    "specialRules": "Capacidad máxima fin de semana"
  },
  "message": "Configuración de friday actualizada exitosamente"
}
```

**Ejemplo de uso:**
```bash
# Aumentar capacidad del sábado
curl -X PUT http://localhost:3001/api/settings/weekday/saturday \
  -H "Content-Type: application/json" \
  -d '{
    "maxReservations": 40,
    "maxGuestsTotal": 80,
    "tablesAvailable": 10
  }'

# Reducir capacidad del lunes
curl -X PUT http://localhost:3001/api/settings/weekday/monday \
  -H "Content-Type: application/json" \
  -d '{
    "maxReservations": 15,
    "maxGuestsTotal": 30,
    "tablesAvailable": 6
  }'
```

---

## 📊 Estadísticas

### Obtener estadísticas del dashboard
Obtiene métricas y estadísticas generales del restaurante.

**Endpoint:** `GET /api/stats`

**Parámetros de consulta (opcionales):**
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `date` | string | Fecha para calcular estadísticas | `2024-10-04` (default: hoy) |

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "date": "2024-10-04",
    "reservations": {
      "today": 5,
      "week": 12,
      "statusBreakdown": {
        "pending": 2,
        "confirmed": 2,
        "seated": 1,
        "completed": 0,
        "cancelled": 0
      }
    },
    "guests": {
      "average": 3.2,
      "total": 16
    },
    "tables": {
      "total": 10,
      "available": 8,
      "occupied": 2,
      "occupancyRate": 20
    },
    "capacity": {
      "total": 48,
      "available": 38,
      "occupied": 10
    }
  }
}
```

**Ejemplo de uso:**
```bash
# Estadísticas de hoy
curl http://localhost:3001/api/stats

# Estadísticas de una fecha específica
curl "http://localhost:3001/api/stats?date=2024-10-05"
```

---

## 🔢 Códigos de Estado HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| `200` | OK | Operación exitosa (GET, PUT, PATCH, DELETE) |
| `201` | Created | Recurso creado exitosamente (POST) |
| `400` | Bad Request | Datos inválidos o faltantes |
| `404` | Not Found | Recurso no encontrado |
| `500` | Internal Server Error | Error del servidor |

---

## 💡 Ejemplos de Uso

### Flujo completo: Crear y gestionar una reserva

```bash
# 1. Verificar disponibilidad
curl "http://localhost:3001/api/tables/availability?date=2024-10-05&time=20:00&guests=4"

# 2. Crear reserva con mesa asignada
curl -X POST http://localhost:3001/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Ana López",
    "customerEmail": "ana@email.com",
    "customerPhone": "+34 611 222 333",
    "date": "2024-10-05",
    "time": "20:00",
    "guests": 4,
    "tableId": "table-3"
  }'

# 3. Confirmar la reserva
curl -X PATCH http://localhost:3001/api/reservations/res-123/status \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'

# 4. Marcar mesa como ocupada
curl -X PUT http://localhost:3001/api/tables/table-3 \
  -H "Content-Type: application/json" \
  -d '{"isAvailable": false}'

# 5. Cliente llega - cambiar estado a "seated"
curl -X PATCH http://localhost:3001/api/reservations/res-123/status \
  -H "Content-Type: application/json" \
  -d '{"status": "seated"}'

# 6. Servicio completado
curl -X PATCH http://localhost:3001/api/reservations/res-123/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# 7. Liberar mesa
curl -X PUT http://localhost:3001/api/tables/table-3 \
  -H "Content-Type: application/json" \
  -d '{"isAvailable": true}'
```

### Consultas útiles

```bash
# Ver todas las reservas de hoy
curl "http://localhost:3001/api/reservations?date=$(date +%Y-%m-%d)"

# Ver reservas pendientes
curl "http://localhost:3001/api/reservations?status=pending"

# Ver mesas disponibles
curl "http://localhost:3001/api/tables?available=true"

# Ver estadísticas del día
curl http://localhost:3001/api/stats
```

---

## 🔐 Notas de Seguridad

⚠️ **IMPORTANTE**: Esta API actualmente NO tiene autenticación. Para producción, debes implementar:

1. **Autenticación**: JWT, OAuth, API Keys
2. **Rate Limiting**: Limitar número de peticiones
3. **CORS**: Configurar orígenes permitidos
4. **Validación**: Sanitizar todos los inputs
5. **HTTPS**: Usar siempre en producción

---

## 🗃️ Base de Datos

✅ **ESTADO ACTUAL**: La API usa PostgreSQL con Prisma ORM para persistencia de datos.

### Configuración Requerida

**Variables de entorno necesarias:**
```bash
DATABASE_URL=postgresql://usuario:password@localhost:5432/cofradia_db
```

**Modelos principales:**
- `Reservation` - Reservas del restaurante
- `Table` - Mesas disponibles
- `RestaurantSettings` - Configuración general (almacenada como JSON)

### Migraciones

Antes de usar la API, ejecuta las migraciones:
```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar migraciones
npx prisma migrate deploy

# (Opcional) Crear datos de prueba
npx prisma db seed
```

### Para Producción

1. ✅ **PostgreSQL configurado** (versión 12 o superior)
2. ✅ **DATABASE_URL** configurada en variables de entorno
3. ✅ **Migraciones aplicadas** con `prisma migrate deploy`
4. ✅ **Backups automáticos** configurados en tu servidor
5. ✅ **Connection pooling** para mejor rendimiento

---

## 📞 Soporte

Para dudas o problemas con la API, consulta el código fuente en:
- `/app/api/reservations/`
- `/app/api/tables/`
- `/app/api/stats/`

---

**Versión de la API**: 1.0.0  
**Última actualización**: Octubre 2024
