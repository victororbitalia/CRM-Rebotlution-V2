# ✅ Checklist de Despliegue

## 📦 Archivos Necesarios

- [x] `Dockerfile` - Creado ✅
- [x] `.dockerignore` - Creado ✅
- [x] `docker-compose.yml` - Creado ✅
- [x] `next.config.js` - Actualizado con `output: 'standalone'` ✅
- [x] `.gitignore` - Actualizado ✅
- [x] `env.example` - Creado ✅

## 🔧 Configuración

- [ ] Variables de entorno configuradas
- [ ] Dominio configurado (opcional)
- [ ] SSL/HTTPS habilitado
- [ ] Base de datos conectada (cuando sea necesario)

## 🧪 Pruebas Locales

Antes de desplegar, verifica:

```bash
# 1. Build funciona
npm run build

# 2. Docker funciona
docker-compose up -d

# 3. Accede a http://localhost:3001
# Verifica que todo funcione
```

- [ ] Build local exitoso
- [ ] Docker local funciona
- [ ] Todas las páginas cargan
- [ ] API responde correctamente
- [ ] Estilos se aplican correctamente

## 📤 Subir a GitHub

```bash
git init
git add .
git commit -m "Listo para producción"
git remote add origin https://github.com/TU-USUARIO/cofradia-crm.git
git branch -M main
git push -u origin main
```

- [ ] Código subido a GitHub
- [ ] Repositorio público o privado configurado
- [ ] README actualizado

## 🚀 Despliegue en Easypanel

### Paso 1: Crear App
- [ ] Acceder a Easypanel
- [ ] Click en "Create" > "App"
- [ ] Conectar repositorio de GitHub

### Paso 2: Configuración
- [ ] Build method: Docker detectado
- [ ] Port: 3000 configurado
- [ ] Variables de entorno agregadas

### Paso 3: Deploy
- [ ] Click en "Deploy"
- [ ] Esperar build (2-5 minutos)
- [ ] Verificar logs sin errores

### Paso 4: Verificación
- [ ] App accesible en el dominio
- [ ] Dashboard carga correctamente
- [ ] API funciona: `/api/stats`
- [ ] Reservas funciona: `/reservations`
- [ ] Mesas funciona: `/tables`
- [ ] Ajustes funciona: `/settings`

## 🔐 Seguridad

- [ ] Variables sensibles como "Secret"
- [ ] HTTPS habilitado (automático en Easypanel)
- [ ] Autenticación configurada (futuro)
- [ ] Rate limiting configurado (futuro)

## 📊 Post-Despliegue

- [ ] Auto-deploy habilitado
- [ ] Monitoreo configurado
- [ ] Logs revisados
- [ ] Backups configurados
- [ ] Dominio personalizado (opcional)

## 🎯 Configuración Inicial

Una vez desplegado, configura tu restaurante:

1. [ ] Ve a `/settings`
2. [ ] Configura información general
3. [ ] Ajusta horarios de apertura
4. [ ] Configura reglas por día de semana
5. [ ] Establece políticas de reservas
6. [ ] Configura mesas disponibles

## 📈 Próximos Pasos

- [ ] Conectar base de datos real
- [ ] Implementar autenticación
- [ ] Configurar emails de notificación
- [ ] Agregar sistema de pagos (opcional)
- [ ] Configurar backups automáticos

## 🆘 En Caso de Problemas

### Build Falla
```bash
# Verificar localmente
npm run build

# Ver logs en Easypanel
# Revisar que next.config.js tenga: output: 'standalone'
```

### App No Inicia
```bash
# Verificar variables de entorno
# Verificar puerto: 3000
# Revisar logs en Easypanel
```

### Estilos No Cargan
```javascript
// Verificar en next.config.js:
output: 'standalone'
```

## ✅ Despliegue Completado

Una vez que todo esté marcado:

🎉 **¡Tu CRM está en producción!**

**URL:** `https://tu-dominio.com`

**Próximos pasos:**
1. Configura tu restaurante en `/settings`
2. Crea tus primeras reservas
3. Gestiona tus mesas
4. ¡Empieza a usar tu CRM!

---

**Fecha de despliegue:** _______________  
**URL de producción:** _______________  
**Desplegado por:** _______________



