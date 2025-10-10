# 💾 Guía de Configuración de Base de Datos - PostgreSQL

Esta guía te ayudará a configurar PostgreSQL para REBOTLUTION CRM.

---

## ⚠️ Importante

**PostgreSQL es OBLIGATORIO** para que la aplicación funcione. La aplicación usa Prisma ORM para gestionar la base de datos.

---

## 📋 Tabla de Contenidos

1. [Desarrollo Local](#desarrollo-local)
2. [Producción con Easypanel](#producción-con-easypanel)
3. [Producción con Docker](#producción-con-docker)
4. [Migraciones de Prisma](#migraciones-de-prisma)
5. [Datos de Prueba (Seed)](#datos-de-prueba-seed)
6. [Solución de Problemas](#solución-de-problemas)

---

## 🖥️ Desarrollo Local

### Opción 1: PostgreSQL Local (Recomendado para desarrollo)

#### En Windows

1. **Descargar PostgreSQL:**
   - Ve a: https://www.postgresql.org/download/windows/
   - Descarga el instalador
   - Ejecuta e instala con las opciones por defecto
   - Anota la contraseña del usuario `postgres`

2. **Crear base de datos:**
   ```bash
   # Abre PowerShell o CMD
   psql -U postgres
   
   # Dentro de psql:
   CREATE DATABASE cofradia_db;
   CREATE USER cofradia WITH PASSWORD 'tu_password_segura';
   GRANT ALL PRIVILEGES ON DATABASE cofradia_db TO cofradia;
   \q
   ```

3. **Configurar variable de entorno:**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   DATABASE_URL="postgresql://cofradia:tu_password_segura@localhost:5432/cofradia_db"
   ```

#### En Linux/Mac

1. **Instalar PostgreSQL:**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # macOS (con Homebrew)
   brew install postgresql
   brew services start postgresql
   ```

2. **Crear base de datos:**
   ```bash
   sudo -u postgres psql
   
   # Dentro de psql:
   CREATE DATABASE cofradia_db;
   CREATE USER cofradia WITH PASSWORD 'tu_password_segura';
   GRANT ALL PRIVILEGES ON DATABASE cofradia_db TO cofradia;
   \q
   ```

3. **Configurar variable de entorno:**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   DATABASE_URL="postgresql://cofradia:tu_password_segura@localhost:5432/cofradia_db"
   ```

### Opción 2: Docker Compose (Más Fácil)

Si ya tienes Docker instalado:

```bash
# El proyecto ya incluye docker-compose.yml con PostgreSQL
docker-compose up -d postgres

# La base de datos estará disponible automáticamente
# DATABASE_URL ya está configurada en docker-compose.yml
```

---

## 🚀 Producción con Easypanel

### Paso 1: Crear Servicio PostgreSQL

1. **Accede a Easypanel**
2. **Click en "+ Create"**
3. **Selecciona "Service" > "Database" > "PostgreSQL"**
4. **Configuración:**
   - **Nombre:** `cofradia-db`
   - **Usuario:** `cofradia`
   - **Password:** Genera una contraseña segura (guárdala)
   - **Base de datos:** `cofradia_db`
   - **Puerto:** `5432` (default)
   - **Versión:** 15 o superior (recomendado)
5. **Click en "Deploy"**
6. **Espera** a que se despliegue (1-2 minutos)

### Paso 2: Conectar a tu Aplicación

1. **Ve a tu aplicación REBOTLUTION**
2. **Click en "Environment"**
3. **Agrega la variable:**
   ```
   DATABASE_URL=postgresql://cofradia:tu-password@postgres:5432/cofradia_db
   ```
   
   **Nota:** Si tu PostgreSQL está en el mismo proyecto Easypanel, usa `postgres` como host. Si está en otro servidor, usa la IP o dominio.

4. **Guarda los cambios**
5. **Redeploy la aplicación**

### Paso 3: Ejecutar Migraciones

Después del redeploy:

1. **Conecta al contenedor:**
   - En Easypanel, ve a tu app
   - Click en "Console" o "Terminal"

2. **Ejecuta las migraciones:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

3. **Verifica que funcione:**
   ```bash
   curl https://tu-dominio.com/api/settings
   ```

---

## 🐳 Producción con Docker

Si despliegas con Docker directamente, el `docker-compose.yml` ya incluye PostgreSQL:

```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: cofradia_db
      POSTGRES_USER: cofradia
      POSTGRES_PASSWORD: tu_password_segura
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    environment:
      DATABASE_URL: postgresql://cofradia:tu_password_segura@postgres:5432/cofradia_db
    depends_on:
      - postgres
```

Solo ejecuta:
```bash
docker-compose up -d
```

---

## 🔄 Migraciones de Prisma

### ¿Qué son las migraciones?

Las migraciones son cambios en el esquema de la base de datos (crear tablas, agregar columnas, etc.).

### Comandos Principales

```bash
# 1. Generar cliente Prisma (después de cambiar schema.prisma)
npx prisma generate

# 2. Aplicar migraciones en producción
npx prisma migrate deploy

# 3. Crear una nueva migración (desarrollo)
npx prisma migrate dev --name descripcion_cambio

# 4. Ver estado de migraciones
npx prisma migrate status

# 5. Resetear BD (¡CUIDADO! Borra todos los datos)
npx prisma migrate reset
```

### Flujo de Trabajo

**Desarrollo:**
```bash
# 1. Modificas prisma/schema.prisma
# 2. Creas migración
npx prisma migrate dev --name agregar_campo_x

# 3. Se aplica automáticamente a tu BD local
```

**Producción:**
```bash
# 1. Subes cambios a GitHub
# 2. Despliegas en Easypanel
# 3. Ejecutas en el contenedor:
npx prisma migrate deploy
```

---

## 🌱 Datos de Prueba (Seed)

### Crear Script de Seed

Crea `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear mesas de ejemplo
  await prisma.table.createMany({
    data: [
      { number: 1, capacity: 2, location: 'interior', isAvailable: true },
      { number: 2, capacity: 4, location: 'interior', isAvailable: true },
      { number: 3, capacity: 4, location: 'terraza', isAvailable: true },
      { number: 4, capacity: 6, location: 'exterior', isAvailable: true },
      { number: 5, capacity: 8, location: 'privado', isAvailable: true },
    ],
  });

  // Crear configuración inicial
  const defaultSettings = {
    restaurantName: 'Cofradia Restaurant',
    email: 'info@cofradia.com',
    phone: '+34 900 123 456',
    address: 'Calle Principal, 123, Madrid',
    // ... resto de configuración
  };

  await prisma.restaurantSettings.create({
    data: {
      id: 'settings-singleton',
      data: defaultSettings,
    },
  });

  console.log('✅ Datos de prueba creados exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Ejecutar Seed

```bash
# Ejecuta el seed
npx prisma db seed

# O manualmente
npx tsx prisma/seed.ts
```

### Configurar en package.json

Agrega en `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

## 🐛 Solución de Problemas

### Error: "Can't reach database server"

**Causa:** La aplicación no puede conectarse a PostgreSQL.

**Solución:**
1. Verifica que PostgreSQL esté corriendo:
   ```bash
   # Docker
   docker ps | grep postgres
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verifica `DATABASE_URL`:
   ```bash
   echo $DATABASE_URL
   ```

3. Verifica conectividad:
   ```bash
   psql "postgresql://cofradia:password@localhost:5432/cofradia_db"
   ```

### Error: "Table does not exist"

**Causa:** Las migraciones no se han aplicado.

**Solución:**
```bash
npx prisma migrate deploy
```

### Error: "Authentication failed"

**Causa:** Usuario o contraseña incorrectos en `DATABASE_URL`.

**Solución:**
1. Verifica las credenciales en PostgreSQL:
   ```sql
   SELECT usename FROM pg_user;
   ```

2. Actualiza `DATABASE_URL` con las credenciales correctas

### Error: "Migration failed"

**Causa:** Conflicto en el esquema de la base de datos.

**Solución:**
```bash
# Ver estado
npx prisma migrate status

# Resolver conflictos
npx prisma migrate resolve --applied "nombre_migracion"

# O resetear (¡borra datos!)
npx prisma migrate reset
```

### Error: "Too many connections"

**Causa:** Demasiadas conexiones abiertas a PostgreSQL.

**Solución:**
1. Configura connection pooling en `lib/prisma.ts`:
   ```typescript
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL,
       },
     },
     log: ['query', 'error', 'warn'],
   });
   ```

2. O usa PgBouncer para gestionar conexiones

### Error: "Database is locked" (SQLite)

**Causa:** Estás usando SQLite en lugar de PostgreSQL.

**Solución:**
Verifica que `DATABASE_URL` apunte a PostgreSQL:
```env
# ✅ CORRECTO
DATABASE_URL="postgresql://user:pass@host:5432/db"

# ❌ INCORRECTO
DATABASE_URL="file:./dev.db"
```

---

## 📊 Monitoreo de Base de Datos

### Ver Estadísticas

```sql
-- Conexiones activas
SELECT count(*) FROM pg_stat_activity;

-- Tamaño de la base de datos
SELECT pg_size_pretty(pg_database_size('cofradia_db'));

-- Tablas y su tamaño
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Backups

**Manual:**
```bash
# Backup
pg_dump -U cofradia cofradia_db > backup.sql

# Restaurar
psql -U cofradia cofradia_db < backup.sql
```

**Automatizado (Linux):**
```bash
# Crea script backup.sh
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U cofradia cofradia_db > /backups/cofradia_$TIMESTAMP.sql

# Agrega a cron
0 2 * * * /path/to/backup.sh
```

**En Easypanel:**
- Easypanel hace backups automáticos si está configurado
- Ve a Database > Backups

---

## 🔐 Seguridad

### Mejores Prácticas

1. **Nunca subas credenciales a GitHub:**
   ```bash
   # Agrega a .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Usa contraseñas fuertes:**
   ```bash
   # Genera contraseñas seguras
   openssl rand -base64 32
   ```

3. **Restringe acceso:**
   ```sql
   -- Solo permite conexiones desde la app
   REVOKE ALL ON DATABASE cofradia_db FROM PUBLIC;
   GRANT ALL ON DATABASE cofradia_db TO cofradia;
   ```

4. **Usa SSL en producción:**
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
   ```

---

## 📚 Recursos Adicionales

- **Prisma Docs:** https://www.prisma.io/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Easypanel Docs:** https://easypanel.io/docs

---

## ✅ Checklist de Configuración

### Desarrollo Local
- [ ] PostgreSQL instalado
- [ ] Base de datos `cofradia_db` creada
- [ ] Usuario `cofradia` creado
- [ ] `.env` configurado con `DATABASE_URL`
- [ ] `npx prisma generate` ejecutado
- [ ] `npx prisma migrate deploy` ejecutado
- [ ] Datos de prueba creados (opcional)

### Producción
- [ ] Servicio PostgreSQL creado en Easypanel
- [ ] `DATABASE_URL` configurada en variables de entorno
- [ ] Aplicación redesplegada
- [ ] Migraciones ejecutadas en contenedor
- [ ] API funcionando correctamente
- [ ] Backups configurados

---

**¡Tu base de datos está lista!** 🎉

Si tienes problemas, revisa la sección de [Solución de Problemas](#solución-de-problemas) o consulta los logs de tu aplicación.

