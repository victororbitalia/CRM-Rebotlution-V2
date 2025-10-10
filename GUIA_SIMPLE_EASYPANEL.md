# 🚀 Guía Súper Simple para Desplegar en Easypanel

**Para principiantes - Paso a paso sin complicaciones**

---

## ⚠️ IMPORTANTE: Puerto 3001

**Tu aplicación usa el puerto 3001** (no el 3000 que usan la mayoría).

Cuando despliegues en Easypanel, asegúrate de configurar:
- **Port / Container Port:** `3001`

---

## 🎯 Opción 1: Método Más Fácil (CON GitHub)

### ✅ Lo que necesitas:
- Una cuenta en GitHub (gratis): https://github.com/signup
- Una cuenta en Easypanel (donde está tu servidor)
- 15 minutos de tiempo

### 📝 Pasos:

#### **PASO 1: Subir tu código a GitHub** (Solo primera vez)

1. **Abre PowerShell en tu proyecto** (ya estás aquí)

2. **Copia y pega estos comandos uno por uno:**

```powershell
# Inicializar Git (si no lo has hecho)
git init

# Agregar todos tus archivos
git add .

# Guardar los cambios
git commit -m "Preparar para Easypanel"
```

3. **Crea un repositorio en GitHub:**
   - Ve a: https://github.com/new
   - Ponle un nombre, por ejemplo: `cofradia-crm`
   - Déjalo PÚBLICO (es más fácil)
   - NO marques ninguna opción adicional
   - Click en "Create repository"

4. **GitHub te mostrará comandos. Copia los que dicen "push an existing repository":**
   
   Serán algo así (pero con TU usuario):
   ```powershell
   git remote add origin https://github.com/TU-USUARIO/cofradia-crm.git
   git branch -M main
   git push -u origin main
   ```
   
   **Importante:** Reemplaza `TU-USUARIO` con tu usuario de GitHub

5. **¡Listo!** Tu código está en GitHub 🎉

---

#### **PASO 2: Desplegar en Easypanel** (¡Lo más fácil!)

1. **Entra a tu Easypanel:**
   - Abre tu navegador
   - Ve a la dirección de tu Easypanel (ejemplo: `https://panel.tuservidor.com`)
   - Inicia sesión

2. **Crear una nueva aplicación:**
   - Click en el botón **"+ Create"** o **"New Service"**
   - Selecciona **"App"** o **"Application"**

3. **Conectar GitHub:**
   - En **"Source"** o **"Git"**, selecciona **"GitHub"**
   - Easypanel te pedirá que autorices el acceso
   - Click en **"Authorize Easypanel"** (autorizar)
   - Selecciona tu repositorio: `cofradia-crm` (o el nombre que le pusiste)
   - Branch: **`main`**

4. **Configuración:**
   - ✅ **Build Method:** Docker (lo detecta automáticamente)
   - ✅ **Dockerfile:** `./Dockerfile` (lo encuentra solo)
   - ⚠️ **Port:** `3001` (IMPORTANTE: tu app usa puerto 3001)

5. **Agregar nombre a tu app:**
   - En "App Name" o "Service Name": pon `cofradia` o el nombre que quieras
   - Este será parte de tu URL: `cofradia.easypanel.host`

6. **¡DEPLOY!**
   - Click en el botón grande que dice **"Deploy"** o **"Create"**
   - **Espera 2-5 minutos** mientras Easypanel:
     - Descarga tu código
     - Construye la aplicación
     - La pone en línea

7. **⚠️ IMPORTANTE - Configurar el Puerto:**
   - Después de crear la app, ve a **"Settings"** o **"Configuration"**
   - Busca **"Port"** o **"Container Port"**
   - Asegúrate que esté en: **`3001`** (no 3000)
   - Guarda los cambios

8. **Ver el progreso:**
   - En Easypanel, ve a tu aplicación
   - Click en **"Logs"** para ver qué está pasando
   - Cuando veas "Server started on port 3001" o "ready" = ¡FUNCIONA! ✅

9. **Acceder a tu aplicación:**
   - Easypanel te dará una URL automática
   - Será algo como: `https://cofradia.easypanel.host`
   - Ábrela en tu navegador
   - **¡Tu app está en Internet!** 🎉

---

## 🎯 Opción 2: Sin GitHub (Subiendo ZIP)

Si no quieres usar GitHub (aunque es MUCHO más fácil):

### **PASO 1: Crear el ZIP**

```powershell
# En PowerShell, dentro de tu proyecto:
Compress-Archive -Path * -DestinationPath cofradia.zip -Force -Exclude node_modules,".next",".git"
```

### **PASO 2: Subir a Easypanel**

1. En Easypanel: **"+ Create"** > **"App"**
2. Source: **"Upload ZIP"** o **"File Upload"**
3. Sube el archivo `cofradia.zip`
4. Configuración:
   - Build: Docker
   - **Port: 3001** ⚠️ (IMPORTANTE)
5. Click en **"Deploy"**
6. Ve a Settings y verifica que el puerto sea **3001**
7. ¡Espera y listo!

---

## 🌐 Configurar tu Dominio (Opcional)

Si tienes un dominio propio (como `mirestaurante.com`):

1. En Easypanel, ve a tu aplicación
2. Click en **"Domains"**
3. Click en **"Add Domain"**
4. Escribe tu dominio: `mirestaurante.com`
5. Easypanel te dará una IP o CNAME
6. Ve a donde compraste tu dominio (GoDaddy, Namecheap, etc.)
7. Crea un registro DNS:
   - Tipo: `A` (si te dio una IP) o `CNAME`
   - Nombre: `@` (para usar el dominio principal)
   - Valor: La IP o dirección que te dio Easypanel
8. Espera 10-30 minutos
9. ¡Tu app estará en tu dominio! 🎉
10. Easypanel activará HTTPS automáticamente

---

## 🔄 Actualizar tu App (Después del primer despliegue)

### Con GitHub (Automático):

1. **Habilita Auto-Deploy (una sola vez):**
   - En Easypanel, ve a tu app
   - **"Settings"** > **"Auto Deploy"**
   - Actívalo ✅

2. **Cada vez que hagas cambios:**
   ```powershell
   # Haz tus cambios en el código
   # Luego:
   git add .
   git commit -m "Descripción de lo que cambiaste"
   git push
   ```
   
3. **¡Easypanel actualiza automáticamente!** 🎉
   - No tienes que hacer nada más
   - En 2-3 minutos verás los cambios en tu app

### Manual:

1. En Easypanel, ve a tu app
2. Click en **"Redeploy"** o **"Rebuild"**
3. Espera 2-3 minutos
4. ¡Listo!

---

## ❓ ¿Problemas? Soluciones Rápidas

### 😵 "Build Failed" (Falló la construcción)

**Qué hacer:**
1. En Easypanel, click en **"Logs"**
2. Lee el último error (estará en rojo)
3. Si dice algo sobre "module" o "package":
   ```powershell
   # En tu computadora:
   npm install
   npm run build
   ```
   Si funciona local, sube de nuevo a GitHub

### 😵 "Application Crashed" (La app se cerró)

**Qué hacer:**
1. Ve a **"Logs"** en Easypanel
2. Si dice algo del puerto:
   - Verifica en Easypanel que el puerto sea **3001** (NO 3000)
   - Ve a Settings → Port → Cambia a 3001
3. Si no entiendes el error, cópialo y búscalo en Google

### 😵 No puedo acceder a mi app

**Qué hacer:**
1. En Easypanel, verifica que el estado sea **"Running"** (verde)
2. Si está detenido, click en **"Start"**
3. Verifica la URL en **"Domains"**
4. Espera 1-2 minutos después del deploy

### 😵 Los estilos no se ven

**Qué hacer:**
1. Refresca la página con `Ctrl + Shift + R` (limpia caché)
2. Si sigue igual, en Easypanel click en **"Redeploy"**

---

## 📱 Ver tu App

Una vez desplegada, prueba estas URLs (reemplaza con tu dominio):

- **Inicio:** `https://tu-app.easypanel.host`
- **Reservas:** `https://tu-app.easypanel.host/reservations`
- **Mesas:** `https://tu-app.easypanel.host/tables`
- **Ajustes:** `https://tu-app.easypanel.host/settings`

---

## ✅ Checklist Rápido

Antes de desplegar:
- [ ] Tengo cuenta en GitHub
- [ ] Tengo cuenta en Easypanel
- [ ] Mi código está en GitHub (Opción 1) o tengo el ZIP (Opción 2)

Durante el despliegue:
- [ ] Creé la app en Easypanel
- [ ] Conecté GitHub o subí el ZIP
- [ ] Click en "Deploy"
- [ ] Vi los logs (sin errores graves)
- [ ] Estado de la app: "Running" ✅

Después del despliegue:
- [ ] Puedo acceder a la URL
- [ ] La página de inicio carga
- [ ] Los estilos se ven bien
- [ ] Configuré auto-deploy (opcional)
- [ ] Configuré mi dominio (opcional)

---

## 🎉 ¡Felicidades!

Tu aplicación **REBOTLUTION CRM** está ahora en Internet y funcionando 24/7.

**¿Qué sigue?**

1. 🏠 Ve a **`/settings`** en tu app
2. 📝 Configura tu restaurante (nombre, horarios, etc.)
3. 🪑 Agrega tus mesas en **`/tables`**
4. 📅 Empieza a crear reservas en **`/reservations`**

---

## 🆘 ¿Necesitas más ayuda?

- **Documentación completa:** Lee `EASYPANEL_SETUP.md`
- **Easypanel Docs:** https://easypanel.io/docs
- **Mi primer despliegue falló:** Es normal, revisa los logs y busca el error específico

---

## 💡 Consejo Pro

**Usa GitHub + Auto-Deploy:**
- Haz cambios en tu código
- `git push`
- ¡Tu app se actualiza sola en 2 minutos!
- No tienes que entrar a Easypanel cada vez

**Esto te ahorrará MUCHO tiempo** 🚀

---

**¡Éxito con tu despliegue!** Si sigues estos pasos exactamente, tu app estará funcionando en menos de 15 minutos. 💪
