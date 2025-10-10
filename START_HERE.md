# 🎯 EMPIEZA AQUÍ - Despliegue en Easypanel

## ✅ Tu Proyecto Está 100% Listo

Todos los archivos necesarios han sido creados. 

⚠️ **IMPORTANTE**: Esta aplicación **requiere PostgreSQL**. Asegúrate de configurar la base de datos antes de desplegar.

📖 **Guía de Base de Datos:** [DATABASE_SETUP.md](./DATABASE_SETUP.md)

---

## 🚀 OPCIÓN 1: GitHub + Easypanel (5 minutos) ⭐ RECOMENDADO

### Paso 1: Sube a GitHub

Abre la terminal en tu proyecto y ejecuta:

```bash
git init
git add .
git commit -m "Listo para Easypanel"
```

Luego crea un repositorio en GitHub:
- Ve a: https://github.com/new
- Nombre: `cofradia-crm`
- Click en "Create repository"

Conecta y sube:
```bash
git remote add origin https://github.com/TU-USUARIO/cofradia-crm.git
git branch -M main
git push -u origin main
```

### Paso 2: Despliega en Easypanel

1. **Accede a tu Easypanel:** `https://tu-servidor.com:3000`
2. **Click en "Create"** → **"App"**
3. **Source:** Selecciona **"GitHub"**
4. **Autoriza** Easypanel a acceder a tus repos
5. **Selecciona** tu repositorio: `cofradia-crm`
6. **Branch:** `main`
7. **Click en "Deploy"**

### ¡Listo! 🎉

Tu app estará disponible en: `https://tu-app.easypanel.host`

---

## 🐳 OPCIÓN 2: Docker Local (2 minutos)

Si quieres probar localmente primero:

### Windows:
```bash
deploy.bat up
```

### Linux/Mac:
```bash
./deploy.sh up
```

### O manualmente:
```bash
docker-compose up -d
```

Accede a: `http://localhost:3001`

---

## 📦 OPCIÓN 3: Subir ZIP a Easypanel

Si no quieres usar GitHub:

### 1. Crear ZIP

**Windows (PowerShell):**
```powershell
Compress-Archive -Path * -DestinationPath cofradia.zip -Force
```

**Linux/Mac:**
```bash
zip -r cofradia.zip . -x "node_modules/*" ".next/*" ".git/*"
```

### 2. Subir a Easypanel

1. En Easypanel: **Create** → **App**
2. **Source:** Selecciona **"Upload"**
3. **Sube** `cofradia.zip`
4. **Deploy**

---

## 📚 Documentación Disponible

| Archivo | Para Qué |
|---------|----------|
| 📖 **QUICK_START.md** | Inicio super rápido |
| 📘 **EASYPANEL_SETUP.md** | Guía completa Easypanel |
| 📙 **DEPLOYMENT.md** | Todas las opciones |
| ✅ **DEPLOYMENT_CHECKLIST.md** | Verificar todo |
| 📊 **DEPLOYMENT_SUMMARY.md** | Resumen de archivos |

---

## 🔍 Verificar Antes de Desplegar

```bash
# Verifica que el build funcione
npm run build

# Debe completarse sin errores ✅
```

---

## ⚙️ Variables de Entorno (OBLIGATORIO)

En Easypanel, configura estas variables:

```
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
DATABASE_URL=postgresql://cofradia:password@postgres:5432/cofradia_db
```

⚠️ **IMPORTANTE**: `DATABASE_URL` es **OBLIGATORIO**. La app no funcionará sin PostgreSQL.

Ver guía completa: [DATABASE_SETUP.md](./DATABASE_SETUP.md)

---

## ✅ Checklist Rápido

Antes de desplegar:

- [x] `Dockerfile` existe ✅
- [x] `next.config.js` tiene `output: 'standalone'` ✅
- [x] `.dockerignore` existe ✅
- [ ] Código subido a GitHub (si usas GitHub)
- [ ] Build local funciona: `npm run build`

---

## 🆘 ¿Problemas?

### Build falla
```bash
npm run build
# Ver el error y corregir
```

### Docker falla
```bash
docker-compose logs
# Ver logs de error
```

### No sabes qué hacer
👉 Lee: **QUICK_START.md** (solo 2 minutos de lectura)

---

## 🎯 Mi Recomendación

**Para Easypanel:**

1. ✅ **Usa GitHub** (más fácil para actualizaciones)
2. ✅ **Sigue QUICK_START.md** (5 minutos)
3. ✅ **Habilita auto-deploy** (cada push despliega automático)

**Ventajas:**
- Actualizaciones con solo `git push`
- Rollback fácil si algo falla
- Historial de versiones
- CI/CD automático

---

## 🚀 Siguiente Paso

**Elige tu opción:**

- 👉 **Opción 1 (GitHub):** Lee `QUICK_START.md`
- 👉 **Opción 2 (Docker):** Ejecuta `docker-compose up -d`
- 👉 **Opción 3 (ZIP):** Crea el ZIP y sube a Easypanel

---

## 📞 Ayuda

- **Documentación completa:** `EASYPANEL_SETUP.md`
- **Todas las opciones:** `DEPLOYMENT.md`
- **Checklist:** `DEPLOYMENT_CHECKLIST.md`

---

## 🎉 ¡Tu CRM Está Listo!

**Archivos creados:** ✅  
**Configuración lista:** ✅  
**Documentación completa:** ✅  

**Solo falta:** Desplegar (5 minutos)

---

**¿Listo?** 👉 Empieza con tu opción favorita arriba ⬆️



