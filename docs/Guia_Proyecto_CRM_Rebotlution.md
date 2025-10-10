### 1. Visión general

- **Objetivo**: CRM de reservas para restaurantes con gestión de mesas, reservas y configuración global.
- **Arquitectura**: Next.js (App Router) + TypeScript + Prisma ORM + PostgreSQL + Docker (multi-stage) + EasyPanel para despliegue.

### 2. Requisitos previos

- **Software**:
  - Node.js 18.x LTS
  - npm 10+ (o pnpm/yarn si adaptas scripts)
  - Docker 24+
  - PostgreSQL 14+ (local o en contenedor)
- **Conocimientos**: fundamentos de Node/TypeScript, SQL, Docker.

### 3. Stack y decisiones técnicas

- **Next.js 14 App Router**: rutas en `app/`, APIs en `app/api/**/route.ts`.
- **Prisma**: tipado fuerte, migraciones versionadas.
- **Postgres**: consistencia, relaciones y tipos nativos.
- **Docker Alpine**: imagen ligera. Añadimos `openssl` para compatibilidad con Prisma.
- **EasyPanel**: integra build desde GitHub con Dockerfile.

### 4. Estructura del repositorio

- Carpetas clave:
  - `app/`: UI y rutas API (reservas, mesas, ajustes, estadísticas).
  - `components/`: componentes reutilizables (p. ej. `ReservationCard`).
  - `context/`: `RestaurantContext`.
  - `lib/`: utilidades (`prisma.ts`, `defaultSettings.ts`).
  - `prisma/`: `schema.prisma` y (opcionalmente) `migrations/`.
  - `types/`: tipos compartidos.
  - `Dockerfile`, `.dockerignore`, `docker-compose.yml`.

### 5. Modelo de dominio

- **Entidades**:
  - `Table`: mesas con `number`, `capacity`, `location`, `isAvailable`.
  - `Reservation`: datos del cliente, fecha/hora, `guests`, `status`, relación opcional a `Table`.
  - `RestaurantSettings`: singleton con `data` JSON y `updatedAt`.
  - `ReservationStatus`: `pending|confirmed|seated|completed|cancelled`.
- **Restricciones**: `Table.number` único; `Reservation.tableId` opcional.

### 6. Esquema de Prisma

- `prisma/schema.prisma` define:
  - `datasource db` con `provider = "postgresql"` y `url = env("DATABASE_URL")`.
  - `generator client` con `provider = "prisma-client-js"`.
- Buenas prácticas:
  - Usar `cuid()` para IDs string o `uuid()` si prefieres.
  - Añadir índices/uniques (`@@unique`/`@unique`).
  - Considerar `@default(now())` para tiempos de creación.

### 7. Endpoints y lógica de negocio

- API en `app/api/**/route.ts`:
  - `app/api/reservations/`: crear/listar reservas.
  - `app/api/reservations/[id]/`: obtener/actualizar/eliminar una reserva.
  - `app/api/reservations/[id]/status`: cambiar estado.
  - `app/api/tables/` y `app/api/tables/[id]`: CRUD mesas.
  - `app/api/tables/availability`: disponibilidad por fecha/hora.
  - `app/api/settings/` y `app/api/settings/weekday/[day]`: configuración.
  - `app/api/stats/`: estadísticas agregadas.
- Contratos: JSON con validación básica; estados de reserva controlados por `ReservationStatus`.

### 8. Configuración de entorno

- Variables importantes:
  - `DATABASE_URL`: `postgresql://USER:PASS@HOST:5432/DB?schema=public`.
  - `PORT`: puerto de Next.js (por defecto `3001` en `Dockerfile`).
  - `HOSTNAME`: `0.0.0.0`.
- Archivos:
  - `.env` local (no commitear) y `env.example` como plantilla.

### 9. Puesta en marcha en local

1) Instalar dependencias:
```bash
npm install
```
2) Configurar `.env` con `DATABASE_URL`.
3) Inicializar DB y crear migración inicial:
```bash
npx prisma migrate dev --name init
```
4) Arrancar en desarrollo:
```bash
npm run dev
```
5) Generar cliente Prisma cuando cambies el esquema:
```bash
npx prisma generate
```

### 10. Migraciones de base de datos

- Flujo recomendado:
  - En local: `npx prisma migrate dev --name <nombre>` (crea y aplica migración + actualiza cliente).
  - Versiona `prisma/migrations/**` en Git.
  - En producción: `npx prisma migrate deploy` (aplica migraciones pendientes).
- Alternativa: `npx prisma db push` sincroniza el schema sin migraciones (útil solo si conscientemente no llevas historial; evita usarlo en producción salvo bootstrap controlado).
- Rollback: crea una nueva migración correctiva; evita editar migraciones ya aplicadas.

### 11. Construcción y despliegue con Docker

- Dockerfile multi-stage (puntos clave):
  - Etapa `deps`: instala deps con `--ignore-scripts` para evitar `postinstall`.
  - Etapa `builder`: copia código, ejecuta `npx prisma generate`, build de Next.
  - Etapa `runner`: copia `.next/standalone`, `.next/static`, `prisma/` y binarios de Prisma desde `node_modules`.
  - Instala `openssl` en todas las etapas para compatibilidad con Prisma.
  - `CMD`: si hay migraciones → `migrate deploy`; si no → `db push`; luego `node server.js`.

Ejemplo de comandos manuales dentro del contenedor en producción:
```bash
# Aplicar migraciones versionadas
npx prisma migrate deploy

# O sincronizar schema si no hay migraciones
npx prisma db push
```

### 12. Despliegue con EasyPanel

- Fuente: GitHub `Owner/Repository`, rama `main`, `Build Path` `/`.
- Build: selecciona "Dockerfile" y especifica `Dockerfile` en el campo File.
- Variables: define `DATABASE_URL`, `PORT=3001` si mantienes el `Dockerfile` actual.
- Red: expone puerto 3001. Healthcheck opcional sobre `/`.

### 13. Operación y mantenimiento

- Ejecutar comandos en el contenedor:
```bash
docker ps
docker exec -it <container> sh
```
- Backups Postgres: `pg_dump` y `pg_restore` o herramientas del proveedor.
- Logs: revisa salida del contenedor y de EasyPanel.
- Dependencias: actualiza periódicamente `next`, `prisma`, `@prisma/client`.

### 14. Problemas comunes y soluciones

- **`prisma generate` falla en `npm install`**:
  - Causa: el `postinstall` corre antes de copiar `prisma/schema.prisma`.
  - Solución: instalar con `--ignore-scripts` en la etapa `deps` y ejecutar `npx prisma generate` en `builder`.
- **OpenSSL/engines en Alpine**:
  - Causa: Prisma necesita OpenSSL.
  - Solución: `apk add --no-cache openssl` en todas las etapas.
- **Faltan binarios WASM/engine en runtime**:
  - Causa: no se copiaron `@prisma`, `.prisma`, `prisma` desde `node_modules`.
  - Solución: copiar esas rutas en la etapa `runner` y/o usar `ENV PRISMA_CLIENT_ENGINE_TYPE=library`.
- **`.dockerignore` excluye archivos críticos**:
  - Asegúrate de no ignorar `Dockerfile` ni `prisma/`.
- **No hay migraciones en producción**:
  - `migrate deploy` no crea tablas sin migraciones. Usa `db push` inicial o genera migraciones en local y súbelas.
- **`DATABASE_URL` incorrecta**:
  - Verifica host/puerto/credenciales/esquema. Comprueba conectividad desde el contenedor.

### 15. Seguridad y buenas prácticas

- No commitees `.env`; usa `env.example`.
- Usuario no-root en `runner` (`nextjs`).
- Minimiza superficie: solo copia lo necesario a la imagen final.
- Limita permisos del usuario de DB (no superusuario en producción).

### 16. Rendimiento y escalabilidad

- Usa pooling (p. ej. PgBouncer) si esperas alta concurrencia.
- Ajusta Next.js para producción (compilación, imágenes, caché).
- Evita N+1 queries; usa `include`/`select` de Prisma sabiamente.

### 17. Guías rápidas (cheatsheets)

- Comandos locales:
```bash
npm run dev
npx prisma migrate dev --name init
npx prisma migrate deploy
npx prisma db push
npx prisma generate
```
- Contenedor:
```bash
docker exec -it <container> sh
npx prisma migrate deploy
npx prisma db push
```
- Despliegue (resumen):
  - Configura EasyPanel (Dockerfile + variables).
  - Build & deploy.
  - Verifica logs y DB.

### 18. Anexos

- Archivos clave: `Dockerfile`, `.dockerignore`, `prisma/schema.prisma`, `lib/prisma.ts`, `env.example`.
- Glosario: App Router, ORM, migración, engine Prisma (library/wasm), Alpine vs Debian.
- FAQ onboarding:
  - ¿Cómo creo una nueva tabla? Edita `schema.prisma`, ejecuta `migrate dev`, commitea migraciones.
  - ¿Cómo arreglo "Prisma schema not found" en build? Instala con `--ignore-scripts` y genera en `builder`.
  - ¿Cómo forzar engine library? `ENV PRISMA_CLIENT_ENGINE_TYPE=library` o `engineType = "library"` en `generator`.




