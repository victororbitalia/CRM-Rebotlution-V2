# Dockerfile optimizado para Next.js 14
# Multi-stage build para reducir el tamaño de la imagen

# Etapa 1: Dependencias
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
# Instalar dependencias sin ejecutar scripts (evita postinstall/prisma generate)
RUN npm ci --no-audit --no-fund --ignore-scripts || npm install --no-audit --no-fund --ignore-scripts

# Etapa 2: Builder
FROM node:18-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

# Copiar dependencias desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Asegurar generación del cliente de Prisma antes del build
RUN npx prisma generate

# Variables de entorno para el build
ENV NEXT_TELEMETRY_DISABLED=1

# Build de la aplicación
RUN npm run build

# Etapa 3: Runner (imagen final)
FROM node:18-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# Asegurar cliente y motores de Prisma en runtime
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Ejecutar migraciones si existen; si no, sincronizar el esquema con db push
CMD ["sh", "-c", "if [ -d prisma/migrations ] && [ \"$(ls -A prisma/migrations 2>/dev/null)\" ]; then npx prisma migrate deploy; else npx prisma db push; fi; node server.js"]

