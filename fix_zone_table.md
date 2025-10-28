# Solución para el error "Table `public.Zone` does not exist"

## Problema
La aplicación está fallando al intentar guardar configuración en la sección de ajustes/reservas porque la tabla `Zone` no existe en la base de datos, aunque está definida en el esquema de Prisma.

## Causa Raíz
Aunque el modelo `Zone` está definido en `prisma/schema.prisma`, no hay una migración que cree esta tabla. La única migración existente solo añade una columna a la tabla `Reservation`.

## Solución

### Opción 1: Crear una migración para la tabla Zone (Recomendado)

1. **Ejecuta este comando en tu entorno local:**
   ```bash
   npx prisma migrate dev --name create_zone_table
   ```

2. **Esto creará una nueva migración en `prisma/migrations/`** que incluirá:
   - Creación de la tabla `Zone`
   - Cualquier otra tabla que falte según el esquema

3. **Verifica la migración creada** en `prisma/migrations/` para asegurar que incluye todo lo necesario.

4. **Aplica la migración en producción:**
   - Conéctate al contenedor de tu aplicación en Easypanel
   - Ejecuta: `npx prisma migrate deploy`

### Opción 2: Usar db push (Más rápido pero menos recomendado para producción)

1. **Conéctate al contenedor de tu aplicación en Easypanel**

2. **Ejecuta:**
   ```bash
   npx prisma db push
   ```

   Esto sincronizará el esquema directamente con la base de datos sin crear una migración.

## Verificación

Después de aplicar cualquiera de las soluciones:

1. **Verifica que la tabla Zone existe:**
   ```bash
   npx prisma migrate status
   ```

2. **Prueba la aplicación** intentando guardar configuración en la sección de ajustes/reservas.

## Prevención

Para evitar este problema en el futuro:

1. **Siempre crea migraciones** cuando modifiques `prisma/schema.prisma`:
   ```bash
   npx prisma migrate dev --name descripcion_del_cambio
   ```

2. **Asegúrate de que el Dockerfile ejecute las migraciones** automáticamente en cada despliegue (ya está configurado para hacerlo).

3. **Verifica el estado de las migraciones** después de cada despliegue:
   ```bash
   npx prisma migrate status
   ```

## Notas Adicionales

- El Dockerfile ya está configurado para ejecutar `npx prisma migrate deploy` automáticamente al iniciar, pero solo funcionará si las migraciones existen.
- Si creas una nueva base de datos en el futuro, asegúrate de ejecutar todas las migraciones existentes.

## Actualización del Dockerfile (Opcional pero recomendado)

El Dockerfile actual tiene un problema: si existen migraciones (aunque estén incompletas), ejecutará `migrate deploy` pero no creará las tablas que faltan según el esquema.

Para solucionar esto, modifica la línea 62 del Dockerfile:

**Actual:**
```dockerfile
CMD ["sh", "-c", "if [ -d prisma/migrations ] && [ \"$(ls -A prisma/migrations 2>/dev/null)\" ]; then npx prisma migrate deploy; else npx prisma db push; fi; node server.js"]
```

**Mejorado:**
```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy; npx prisma db push; node server.js"]
```

Esta versión mejorada:
1. Primero aplica todas las migraciones existentes
2. Luego sincroniza el esquema completo con la base de datos (creando tablas faltantes)
3. Finalmente inicia la aplicación

## Pasos para aplicar la solución completa

### 1. En tu entorno local:
```bash
# Crear la migración para la tabla Zone
npx prisma migrate dev --name create_zone_table

# Verificar que se creó correctamente
npx prisma migrate status
```

### 2. Sube los cambios a tu repositorio:
```bash
git add .
git commit -m "Fix: Add Zone table migration"
git push
```

### 3. En producción (Easypanel):
1. Espera a que se despliegue la nueva versión
2. Conéctate al contenedor de la aplicación
3. Verifica que las migraciones se aplicaron:
   ```bash
   npx prisma migrate status
   ```

### 4. Si el problema persiste después del despliegue:
Ejecuta manualmente en el contenedor:
```bash
npx prisma db push
```

## Verificación final

Después de aplicar los pasos anteriores:

1. La tabla `Zone` debería existir en tu base de datos
2. La aplicación debería poder guardar configuración en ajustes/reservas sin errores
3. Puedes verificarlo intentando crear una nueva zona en la sección de ajustes

## Solución alternativa (rápida pero temporal)

Si necesitas una solución rápida mientras implementas la migración proper:

1. Conéctate al contenedor de tu aplicación en Easypanel
2. Ejecuta:
   ```bash
   npx prisma db push
   ```
3. Esto sincronizará el esquema actual con la base de datos, creando la tabla Zone

Esta solución es temporal porque no crea una migración, pero resolverá el problema inmediato.