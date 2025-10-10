# ⚠️ Configuración del Puerto 3001 en Easypanel

## 🎯 Tu App USA el Puerto 3001

Tu aplicación REBOTLUTION está configurada para usar el puerto **3001** (porque el 3000 ya está ocupado en tu servidor).

---

## 📝 Cómo Configurar el Puerto en Easypanel

### Durante la Creación (Primera vez):

1. **Crea tu app normalmente** (GitHub o ZIP)
2. **Antes de Deploy**, busca la sección de configuración
3. Encontrarás un campo que dice:
   - **"Port"**
   - **"Container Port"**
   - **"Application Port"**
   - O similar
4. **Cambia el valor a:** `3001`
5. **Guarda** y luego haz **"Deploy"**

---

### Si Ya Desplegaste (Cambiar después):

1. Ve a tu aplicación en Easypanel
2. Click en **"Settings"** o **"Configuration"**
3. Busca la sección **"Ports"** o **"Networking"**
4. Verás algo como:
   ```
   Container Port: [3000]  ← Cambiar esto
   ```
5. **Cambia a:** `3001`
6. **Guarda** los cambios
7. **Reinicia** la aplicación:
   - Click en **"Restart"** o **"Redeploy"**

---

## 🔍 Verificar que Esté Correcto

### En los Logs:

Cuando tu app inicie correctamente, verás en los logs:

```
✓ Ready on port 3001
```

O similar. Si ves otro puerto o errores, verifica la configuración.

---

## 🎯 Mapeo de Puertos en Easypanel

Easypanel usa dos puertos:

1. **Puerto del Contenedor (Container Port):** `3001` ← Este es el que configuraste
2. **Puerto Externo (Public Port):** `80` o `443` ← Easypanel lo maneja automáticamente

**Tú solo necesitas configurar el puerto 3001** en la configuración del contenedor.

---

## 🐛 Problemas Comunes

### Error: "Port 3000 already in use"

**Causa:** Easypanel está intentando usar el puerto 3000 (por defecto)

**Solución:**
1. Ve a Settings de tu app
2. Cambia Container Port a: `3001`
3. Guarda y reinicia

---

### Error: "Application crashed" o "Failed to start"

**Posible causa:** Puerto mal configurado

**Solución:**
1. Revisa los logs en Easypanel
2. Si ves algo sobre "EADDRINUSE" o "port":
   - Ve a Settings
   - Verifica que Container Port = `3001`
   - Guarda y reinicia

---

### La app se inicia pero no puedo acceder

**Solución:**
1. Verifica en Settings:
   ```
   Container Port: 3001 ✅
   ```
2. Verifica que el estado sea "Running" (verde)
3. Espera 1-2 minutos después de Deploy
4. Intenta acceder de nuevo

---

## ✅ Checklist de Puerto

Antes de desplegar:
- [ ] Mi Dockerfile tiene `EXPOSE 3001` ✅ (ya está)
- [ ] Mi Dockerfile tiene `ENV PORT 3001` ✅ (ya está)

Durante el despliegue:
- [ ] Configuré Container Port = `3001` en Easypanel
- [ ] Guardé la configuración
- [ ] Deploy completado sin errores

Verificación:
- [ ] Los logs dicen "Ready on port 3001" o similar
- [ ] Estado de la app: "Running" (verde)
- [ ] Puedo acceder a la URL

---

## 🎉 Todo Configurado

Si seguiste estos pasos:
- ✅ Tu app usa puerto 3001 internamente
- ✅ Easypanel expone tu app en tu dominio (puerto 80/443 automáticamente)
- ✅ ¡Todo funciona! 🚀

---

## 📸 Ejemplo Visual de Configuración

En Easypanel verás algo similar a:

```
┌─────────────────────────────────────┐
│  App Configuration                  │
├─────────────────────────────────────┤
│  Name: cofradia                     │
│  Image: Built from Dockerfile       │
│  Container Port: [3001] ← AQUÍ     │
│  Public Port: Auto (80/443)         │
└─────────────────────────────────────┘
```

**Solo necesitas cambiar el Container Port a 3001.**

---

## 💡 ¿Por Qué Puerto 3001?

- Tu puerto **3000 ya está ocupado** en tu Easypanel
- Por eso configuramos la app para usar **3001**
- Es completamente normal y funciona igual de bien
- Easypanel se encarga del resto automáticamente

---

**¡Listo!** Ahora tu app funcionará perfectamente en el puerto 3001. 🎯

