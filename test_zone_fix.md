# Script de Prueba para Verificar la Solución de la Tabla Zone

## Pasos para probar localmente

### 1. Preparación del entorno
```bash
# Asegúrate de tener una base de datos PostgreSQL local para pruebas
# O usa la base de datos de desarrollo que ya tienes configurada

# Verifica tu conexión actual
echo $DATABASE_URL
```

### 2. Verificar el estado actual de la base de datos
```bash
# Verificar qué tablas existen actualmente
npx prisma db pull --print
# O conecta directamente a PostgreSQL y ejecuta:
# \dt

# Verificar el estado de las migraciones
npx prisma migrate status
```

### 3. Simular el problema (si la tabla Zone no existe)
```bash
# Si quieres simular el problema exacto, puedes eliminar la tabla Zone:
# psql -d tu_bd -c "DROP TABLE IF EXISTS Zone CASCADE;"

# Intenta acceder a la API de zones para ver el error
curl http://localhost:3000/api/zones
# Deberías recibir un error como: "The table `public.Zone` does not exist"
```

### 4. Aplicar la solución
```bash
# Opción A: Crear la migración (recomendado)
npx prisma migrate dev --name create_zone_table

# Opción B: Usar db push (más rápido pero sin migración)
npx prisma db push
```

### 5. Verificar que la solución funcionó
```bash
# Verificar que la tabla Zone existe
npx prisma db pull --print
# Deberías ver la tabla Zone en el esquema

# Verificar el estado de las migraciones
npx prisma migrate status

# Probar la API de zones
curl http://localhost:3000/api/zones
# Deberías recibir una respuesta exitosa (aunque sea un array vacío)

# Probar crear una zona
curl -X POST http://localhost:3000/api/zones \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zona de Prueba",
    "type": "interior",
    "dimensions": {"width": 200, "height": 300},
    "position": {"x": 100, "y": 100},
    "color": "#f0f0f0"
  }'
```

### 6. Probar la funcionalidad completa de la aplicación
```bash
# Inicia la aplicación
npm run dev

# Navega a la sección de ajustes/reservas
# Intenta guardar configuración
# Debería funcionar sin el error "Error al guardar configuración"
```

## Resultados Esperados

### ✅ Si la prueba es exitosa:
- La tabla `Zone` existe en la base de datos
- La API `/api/zones` responde correctamente
- Puedes crear nuevas zonas sin errores
- La sección de ajustes/reservas guarda configuración sin problemas

### ❌ Si la prueba falla:
- Revisa el error específico que recibes
- Verifica que tu `DATABASE_URL` es correcta
- Asegúrate de tener permisos para modificar la base de datos
- Revisa los logs de Prisma para más detalles

## Comandos Útiles para Debugging

```bash
# Ver todas las tablas de la base de datos
npx prisma db pull --print

# Ver el esquema completo generado desde la BD
npx prisma db pull

# Resetear la base de datos (¡CUIDADO! Borra todos los datos)
npx prisma migrate reset

# Verificar la conexión a la BD
npx prisma db pull --force
```

## Checklist de Verificación

- [ ] La tabla Zone existe en la base de datos
- [ ] La API de zones responde sin errores
- [ ] Se pueden crear nuevas zonas
- [ ] La sección de ajustes/reservas funciona correctamente
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en los logs del servidor

Una vez que todas estas verificaciones pasen, la solución está lista para aplicarse en producción.