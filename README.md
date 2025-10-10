# 🍽️ REBOTLUTION - Sistema de Gestión de Reservas para Restaurantes

Un sistema profesional y completo para la gestión de reservas de restaurantes, construido con Next.js 14, React, TypeScript y Tailwind CSS. Incluye API REST completa para integraciones.

## ✨ Características Principales

### 📊 Dashboard Interactivo
- Estadísticas en tiempo real (reservas del día, semana, ocupación)
- Visualización de reservas de hoy con cambio de estado
- Actividad reciente del restaurante
- Métricas de ocupación y promedio de comensales

### 📅 Gestión de Reservas
- Crear nuevas reservas con formulario intuitivo
- Filtrar por fecha (hoy, próximas, pasadas) y estado
- Cambiar estado de reservas (pendiente → confirmada → en mesa → completada)
- Eliminar reservas canceladas
- Peticiones especiales y notas
- Validación automática de disponibilidad

### 🪑 Gestión de Mesas
- Visualización por ubicación (interior, exterior, terraza, privado)
- Estado en tiempo real (disponible, ocupada, reservada)
- Capacidad y distribución de mesas
- Asignación de mesas a reservas
- Vista de calendario para planificación
- Sistema de mesas reservadas para walk-ins

### ⚙️ **Configuración Avanzada del Restaurante**
Sistema completo de ajustes que permite personalizar el funcionamiento según las necesidades del negocio:

#### **Información General**
- Nombre, email, teléfono y dirección del restaurante

#### **Configuración de Reservas**
- Días máximos de anticipación para reservar
- Horas mínimas de anticipación
- Duración por defecto de las reservas
- Máximo de comensales por reserva
- Lista de espera cuando no hay disponibilidad
- Confirmación automática o manual

#### **Gestión Inteligente de Mesas**
- **Total de mesas del restaurante**
- **Mesas reservadas siempre para walk-ins** (clientes sin reserva)
- Porcentaje máximo de ocupación
- Overbooking opcional con porcentaje configurable
- Cálculo automático de mesas disponibles

#### **Reglas por Día de la Semana**
Configura diferentes capacidades según el día (¡perfecto para ajustar entre semana vs fin de semana!):
- Máximo de reservas por día
- Máximo de comensales totales
- Mesas disponibles específicas para cada día
- Reglas especiales personalizadas

**Ejemplo de uso:**
- **Lunes-Jueves:** 8 mesas disponibles, máx. 20 reservas (menor demanda)
- **Viernes-Sábado:** 10 mesas disponibles, máx. 30 reservas (fin de semana completo)
- **Siempre:** 2 mesas reservadas para clientes sin reserva

#### **Horarios de Apertura**
- Configurar días abiertos/cerrados
- Horarios de apertura y cierre por día
- Turnos de servicio (almuerzo, cena)

#### **Notificaciones**
- Emails de confirmación
- Recordatorios automáticos
- SMS (configurable)
- Horas antes para enviar recordatorio

#### **Políticas del Restaurante**
- Horas antes para cancelar sin penalización
- Política de no-show
- Depósito requerido (opcional)
- Monto del depósito

### 🔌 API REST Completa
Todos los ajustes y operaciones disponibles vía API para integraciones:
- Endpoints para reservas (CRUD completo)
- Endpoints para mesas y disponibilidad
- Endpoint de estadísticas
- **Endpoints de configuración** (GET, PUT, PATCH)
- **Endpoints por día de la semana**
- Documentación detallada incluida

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 18 o superior
- npm o yarn
- **PostgreSQL 12 o superior** (OBLIGATORIO)

### Desarrollo Local

1. **Configura PostgreSQL:**
   
   Consulta la guía completa: [DATABASE_SETUP.md](./DATABASE_SETUP.md)
   
   ```bash
   # Opción rápida con Docker:
   docker-compose up -d postgres
   ```

2. **Configura variables de entorno:**
   
   Crea un archivo `.env` en la raíz:
   ```env
   DATABASE_URL="postgresql://cofradia:password@localhost:5432/cofradia_db"
   ```

3. **Instala las dependencias:**
   ```bash
   npm install
   ```

4. **Ejecuta las migraciones de Prisma:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

6. **Abre tu navegador en [http://localhost:3001](http://localhost:3001)**

### 🌐 Despliegue en Producción

#### Opción 1: Easypanel (Recomendado) ⚡

**Inicio rápido (5 minutos):**

```bash
# 1. Sube a GitHub
git init
git add .
git commit -m "Listo para producción"
git push

# 2. En Easypanel: Create > App > Conecta GitHub > Deploy
```

📖 **Guía completa:** [EASYPANEL_SETUP.md](./EASYPANEL_SETUP.md)  
⚡ **Inicio rápido:** [QUICK_START.md](./QUICK_START.md)

#### Opción 2: Docker 🐳

```bash
# Construir y ejecutar
docker-compose up -d

# Ver en: http://localhost:3001
```

#### Opción 3: Vercel / Railway / Render

Ver guía completa: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Comandos Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye la aplicación para producción
npm run start    # Inicia el servidor de producción
npm run lint     # Ejecuta el linter
```

## 🏗️ Estructura del Proyecto

```
cofradia/
├── app/                      # App Router de Next.js
│   ├── page.tsx             # Dashboard principal
│   ├── reservations/        # Página de reservas
│   ├── tables/              # Página de mesas
│   ├── settings/            # ⚙️ Página de configuración
│   ├── api/                 # API REST
│   │   ├── reservations/    # Endpoints de reservas
│   │   ├── tables/          # Endpoints de mesas
│   │   ├── stats/           # Endpoint de estadísticas
│   │   └── settings/        # ⚙️ Endpoints de configuración
│   ├── layout.tsx           # Layout principal
│   └── globals.css          # Estilos globales
├── components/              # Componentes reutilizables
│   ├── Navigation.tsx       # Barra de navegación
│   ├── StatCard.tsx         # Tarjetas de estadísticas
│   ├── ReservationCard.tsx  # Tarjeta de reserva
│   └── Icons.tsx            # Iconos SVG
├── context/                 # Context API de React
│   └── RestaurantContext.tsx # Estado global de la app
├── types/                   # Definiciones de TypeScript
│   ├── index.ts             # Tipos principales
│   └── settings.ts          # ⚙️ Tipos de configuración
├── lib/                     # Utilidades y datos
│   ├── mockData.ts          # Datos de ejemplo
│   └── defaultSettings.ts   # ⚙️ Configuración por defecto
├── API_DOCUMENTATION.md     # 📚 Documentación completa de la API
└── package.json             # Dependencias del proyecto
```

## 🎨 Tecnologías Utilizadas

- **Next.js 14** - Framework de React con App Router
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utility-first
- **Context API** - Gestión de estado global
- **API Routes** - Backend integrado

## 📚 Documentación

El proyecto incluye documentación completa:

- 📖 **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Documentación de la API REST
- 💾 **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Configuración de PostgreSQL
- 🚀 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía de despliegue completa
- ⚡ **[QUICK_START.md](./QUICK_START.md)** - Inicio rápido

### Endpoints Principales:

#### Reservas
- `GET /api/reservations` - Listar reservas
- `POST /api/reservations` - Crear reserva
- `PUT /api/reservations/:id` - Actualizar reserva
- `PATCH /api/reservations/:id/status` - Cambiar estado
- `DELETE /api/reservations/:id` - Eliminar reserva

#### Mesas
- `GET /api/tables` - Listar mesas
- `GET /api/tables/availability` - Verificar disponibilidad
- `PUT /api/tables/:id` - Actualizar mesa

#### Configuración ⚙️
- `GET /api/settings` - Obtener configuración
- `PUT /api/settings` - Actualizar configuración completa
- `PATCH /api/settings` - Actualizar configuración parcial
- `GET /api/settings/weekday/:day` - Obtener reglas de un día
- `PUT /api/settings/weekday/:day` - Actualizar reglas de un día

#### Estadísticas
- `GET /api/stats` - Obtener estadísticas del dashboard

## 💡 Casos de Uso de la Configuración

### Ejemplo 1: Restaurante con menor demanda entre semana
```
Lunes-Jueves:
- 8 mesas disponibles (de 10 totales)
- Máx. 20 reservas
- 2 mesas siempre libres para walk-ins

Viernes-Domingo:
- 10 mesas disponibles (capacidad completa)
- Máx. 30 reservas
- Mayor capacidad para fin de semana
```

### Ejemplo 2: Restaurante con política estricta
```
Configuración:
- Reservas con 24h de anticipación mínima
- Cancelación sin penalización: 24h antes
- Depósito requerido: €10 por persona
- Confirmación automática después de 30 minutos
- Email de recordatorio 24h antes
```

### Ejemplo 3: Restaurante flexible
```
Configuración:
- Reservas con 2h de anticipación
- Sin depósito requerido
- Overbooking del 10% (considerando no-shows)
- Lista de espera activada
- Confirmación inmediata
```

## 🔄 Flujo de Trabajo Recomendado

1. **Configurar el restaurante** en `/settings`
   - Información general
   - Horarios de apertura
   - Reglas por día de la semana
   - Políticas y notificaciones

2. **Gestionar mesas** en `/tables`
   - Ver disponibilidad
   - Asignar a reservas
   - Marcar como ocupadas/disponibles

3. **Gestionar reservas** en `/reservations`
   - Crear nuevas reservas
   - Cambiar estados
   - Filtrar y buscar

4. **Monitorear** en el Dashboard
   - Ver estadísticas en tiempo real
   - Reservas de hoy
   - Actividad reciente

## 🔐 Seguridad y Producción

⚠️ **Para producción, debes implementar:**

1. **Base de datos real** (PostgreSQL, MongoDB, etc.)
2. **Autenticación** (JWT, OAuth, NextAuth.js)
3. **Variables de entorno** para configuración sensible
4. **Rate limiting** en la API
5. **HTTPS** obligatorio
6. **Validación** exhaustiva de datos
7. **Backups** automáticos
8. **Logs** y monitoreo

## 🎯 Ventajas del Sistema

### Para el Restaurante
- ✅ Control total de la capacidad
- ✅ Flexibilidad por día de la semana
- ✅ Siempre hay mesas para walk-ins
- ✅ Reduce no-shows con políticas claras
- ✅ Automatización de confirmaciones
- ✅ Estadísticas en tiempo real

### Para Desarrolladores
- ✅ API REST completa
- ✅ Fácil integración con otros sistemas
- ✅ TypeScript para seguridad de tipos
- ✅ Código modular y escalable
- ✅ Documentación detallada

### Para Clientes
- ✅ Proceso de reserva simple
- ✅ Confirmación inmediata
- ✅ Recordatorios automáticos
- ✅ Políticas claras de cancelación

## 🚀 Próximas Mejoras Sugeridas

- [ ] Integración con base de datos real
- [ ] Sistema de autenticación multi-usuario
- [ ] Notificaciones por email/SMS reales
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Calendario interactivo con drag & drop
- [ ] Sistema de pagos (Stripe, PayPal)
- [ ] App móvil con React Native
- [ ] Panel de análisis avanzado
- [ ] Integración con TPV
- [ ] Widget de reservas para web externa

## 📚 Aprendizaje

Este proyecto es ideal para aprender:
- Next.js 14 con App Router
- API Routes y Backend en Next.js
- Context API para estado global
- TypeScript en proyectos reales
- Tailwind CSS para diseño profesional
- Componentes React reutilizables
- Manejo de formularios complejos
- Validaciones y manejo de errores
- Diseño de APIs REST
- Configuración dinámica de aplicaciones

## 🤝 Contribuciones

Este es un proyecto de aprendizaje. Siéntete libre de:
- Agregar nuevas funcionalidades
- Mejorar el diseño
- Optimizar el código
- Agregar tests
- Mejorar la documentación

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado con ❤️ usando Cursor AI**

¡Un sistema completo de gestión de reservas con configuración profesional y API REST!

## 📞 Soporte

Para consultas sobre la API, revisa: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

Para configuración del restaurante, ve a: `/settings` en la aplicación