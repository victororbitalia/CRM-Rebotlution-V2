# 🚀 Guía Rápida: Despliegue en Easypanel

Esta es una guía paso a paso para desplegar REBOTLUTION CRM en Easypanel.

---

## 📋 Pre-requisitos

- ✅ Cuenta en Easypanel
- ✅ Cuenta en GitHub (recomendado)
- ✅ Código del proyecto listo

---

## 🎯 Método Recomendado: GitHub + Easypanel

### Paso 1: Preparar el Repositorio

```bash
# 1. Inicializar git (si no lo has hecho)
git init

# 2. Agregar archivos
git add .

# 3. Hacer commit
git commit -m "Preparar para despliegue en Easypanel"

# 4. Crear repositorio en GitHub
# Ve a: https://github.com/new
# Nombre: cofradia-crm (o el que prefieras)

# 5. Conectar y subir
git remote add origin https://github.com/TU-USUARIO/cofradia-crm.git
git branch -M main
git push -u origin main
```

---

### Paso 2: Configurar en Easypanel

#### 1. Crear Nueva Aplicación

1. **Accede a tu Easypanel:** `https://tu-servidor.com:3000`
2. **Click en "+ Create"**
3. **Selecciona "App"**

#### 2. Conectar GitHub

1. **Source:** Selecciona "GitHub"
2. **Autoriza Easypanel** a acceder a tus repositorios
3. **Selecciona el repositorio:** `cofradia-crm`
4. **Branch:** `main`

#### 3. Configuración de Build

Easypanel detectará automáticamente el `Dockerfile`. Verifica que:

- ✅ **Build Method:** Docker
- ✅ **Dockerfile Path:** `./Dockerfile`
- ✅ **Port:** `3001`

#### 4. Variables de Entorno (Opcional)

En la sección "Environment", agrega:

```
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

#### 5. Deploy

1. **Click en "Deploy"**
2. **Espera** a que se construya la imagen (2-5 minutos)
3. **¡Listo!** Tu app estará disponible

---

### Paso 3: Configurar Dominio

#### Opción A: Subdominio de Easypanel

1. En tu app, ve a **"Domains"**
2. Easypanel te asignará automáticamente: `tu-app.easypanel.host`
3. **¡Listo!** Accede a tu app

#### Opción B: Dominio Personalizado

1. En tu app, ve a **"Domains"**
2. **Click en "Add Domain"**
3. **Ingresa tu dominio:** `restaurante.com`
4. **Configura DNS:**
   - Tipo: `A` o `CNAME`
   - Valor: IP de tu servidor Easypanel
5. **Espera** propagación DNS (5-30 minutos)
6. **SSL automático** con Let's Encrypt

---

## 🔄 Auto-Deploy (Recomendado)

Configura despliegue automático cada vez que hagas push:

1. En tu app, ve a **"Settings"**
2. **Enable "Auto Deploy"**
3. Ahora cada push a `main` desplegará automáticamente

```bash
# Hacer cambios
git add .
git commit -m "Actualización"
git push

# Easypanel desplegará automáticamente
```

---

## 🐳 Alternativa: Subir ZIP

Si no quieres usar GitHub:

### 1. Crear ZIP

```bash
# Excluir node_modules y .next
zip -r cofradia.zip . -x "node_modules/*" ".next/*" ".git/*"
```

### 2. Subir a Easypanel

1. En Easypanel, **Create App**
2. **Source:** Selecciona "Upload"
3. **Sube** `cofradia.zip`
4. Easypanel detectará el Dockerfile
5. **Deploy**

---

## ⚙️ Configuración Avanzada

### Recursos del Servidor

En **"Settings" > "Resources"**:

- **CPU:** 0.5 - 1 CPU (suficiente para empezar)
- **RAM:** 512MB - 1GB (recomendado 1GB)
- **Disk:** 1GB (para la imagen Docker)

### Escalado

Si necesitas más capacidad:

1. Ve a **"Settings" > "Resources"**
2. Aumenta CPU/RAM según necesidad
3. **Save** y reinicia la app

### Health Checks

Easypanel verificará automáticamente que tu app esté funcionando:

- **URL:** `http://localhost:3001`
- **Interval:** 30 segundos
- **Timeout:** 10 segundos

---

## 📊 Monitoreo

### Ver Logs en Tiempo Real

1. Ve a tu app en Easypanel
2. Click en **"Logs"**
3. Ver logs en tiempo real

### Métricas

1. Ve a **"Metrics"**
2. Ver uso de CPU, RAM, Red

---

## 🔐 Seguridad

### SSL/HTTPS

Easypanel configura SSL automáticamente con Let's Encrypt:

- ✅ Certificado gratuito
- ✅ Renovación automática
- ✅ HTTPS forzado

### Variables de Entorno Sensibles

Para datos sensibles (passwords, API keys):

1. Ve a **"Environment"**
2. Marca como **"Secret"**
3. No se mostrarán en logs

---

## 🐛 Solución de Problemas

### Build Falla

**Error:** "Build failed"

**Solución:**
1. Verifica logs de build en Easypanel
2. Asegúrate que `next.config.js` tiene `output: 'standalone'`
3. Verifica que todas las dependencias estén en `package.json`

```bash
# Probar build local
npm run build
```

### App No Inicia

**Error:** "Application crashed"

**Solución:**
1. Revisa logs en Easypanel
2. Verifica que el puerto sea `3001`
3. Verifica variables de entorno

### No Carga Estilos

**Error:** Estilos no se aplican

**Solución:**
Verifica en `next.config.js`:
```javascript
output: 'standalone'
```

### Puerto Incorrecto

**Error:** "Port already in use"

**Solución:**
En Easypanel, verifica que el puerto sea `3001`

---

## 🔄 Actualizar la Aplicación

### Con Auto-Deploy (Recomendado)

```bash
# Hacer cambios en el código
git add .
git commit -m "Nueva funcionalidad"
git push

# Easypanel desplegará automáticamente
```

### Manual

1. Ve a tu app en Easypanel
2. Click en **"Redeploy"**
3. Espera a que se complete

---

## 📈 Próximos Pasos

Después del despliegue:

1. ✅ **Configurar dominio personalizado**
2. ✅ **Habilitar auto-deploy**
3. ✅ **Configurar backups** (en Settings)
4. ✅ **Agregar base de datos** (PostgreSQL)
5. ✅ **Configurar monitoreo**
6. ✅ **Agregar autenticación**

---

## 💾 Base de Datos (OBLIGATORIO)

⚠️ **IMPORTANTE**: PostgreSQL es **OBLIGATORIO** para que la aplicación funcione. No es opcional.

### 1. Crear Base de Datos en Easypanel

1. En Easypanel, **Create** > **Service** > **Database** > **PostgreSQL**
2. **Nombre:** `cofradia-db`
3. **Usuario:** `cofradia` (o el que prefieras)
4. **Password:** Genera una contraseña segura
5. **Base de datos:** `cofradia_db`
6. Click en **Deploy**

### 2. Conectar a tu App

1. Ve a tu aplicación en Easypanel
2. Click en **"Environment"**
3. Agrega la variable:
   ```
   DATABASE_URL=postgresql://cofradia:tu-password@postgres:5432/cofradia_db
   ```
4. **Guarda** y **Redeploy** la app

### 3. Ejecutar Migraciones

Después del deploy, conecta al contenedor y ejecuta:

```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar migraciones
npx prisma migrate deploy
```

**Nota:** Prisma ya está instalado en el proyecto. No necesitas instalarlo.

### 4. Verificar Conexión

Prueba que la BD funcione:
```bash
# Desde tu navegador o terminal
curl https://tu-dominio.com/api/tables
curl https://tu-dominio.com/api/reservations
```

Si obtienes datos, ¡la BD está conectada correctamente! ✅

---

## 🆘 Soporte

### Recursos Útiles

- **Easypanel Docs:** https://easypanel.io/docs
- **Discord de Easypanel:** https://discord.gg/easypanel
- **GitHub del Proyecto:** Tu repositorio

### Comandos Útiles

```bash
# Ver logs
docker logs -f <container-id>

# Reiniciar app
# En Easypanel: Click en "Restart"

# Ver estado
# En Easypanel: Dashboard de la app
```

---

## ✅ Checklist de Despliegue

Antes de desplegar:

- [ ] Código subido a GitHub
- [ ] `Dockerfile` presente
- [ ] `next.config.js` tiene `output: 'standalone'`
- [ ] Variables de entorno configuradas
- [ ] Build local funciona
- [ ] Dominio configurado (opcional)

Después del despliegue:

- [ ] App accesible en el dominio
- [ ] API funciona correctamente
- [ ] Estilos se cargan bien
- [ ] Auto-deploy configurado
- [ ] SSL/HTTPS activo

---

## 🎉 ¡Felicidades!

Tu aplicación REBOTLUTION CRM está ahora en producción con Easypanel.

**URL de tu app:** `https://tu-dominio.com`

**Próximos pasos:**
1. Configura tu restaurante en `/settings`
2. Crea tus primeras reservas
3. Gestiona tus mesas
4. ¡Disfruta de tu CRM!

---

**¿Necesitas ayuda?** Consulta `DEPLOYMENT.md` para más opciones de despliegue.



