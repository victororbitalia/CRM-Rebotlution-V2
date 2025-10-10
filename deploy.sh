#!/bin/bash

# Script de ayuda para despliegue de REBOTLUTION CRM
# Uso: ./deploy.sh [opcion]

set -e

echo "🍽️  REBOTLUTION CRM - Script de Despliegue"
echo "========================================"
echo ""

# Función para construir Docker
build_docker() {
    echo "🐳 Construyendo imagen Docker..."
    docker build -t cofradia-crm:latest .
    echo "✅ Imagen construida exitosamente"
}

# Función para ejecutar Docker local
run_docker() {
    echo "🚀 Ejecutando contenedor Docker..."
    docker run -d \
        -p 3001:3001 \
        -e NODE_ENV=production \
        --name cofradia-crm \
        cofradia-crm:latest
    echo "✅ Contenedor ejecutándose en http://localhost:3001"
    echo "📋 Ver logs: docker logs -f cofradia-crm"
}

# Función para Docker Compose
compose_up() {
    echo "🐳 Iniciando con Docker Compose..."
    docker-compose up -d
    echo "✅ Aplicación ejecutándose en http://localhost:3001"
    echo "📋 Ver logs: docker-compose logs -f"
}

# Función para detener Docker
stop_docker() {
    echo "🛑 Deteniendo contenedor..."
    docker stop cofradia-crm 2>/dev/null || true
    docker rm cofradia-crm 2>/dev/null || true
    echo "✅ Contenedor detenido"
}

# Función para detener Docker Compose
compose_down() {
    echo "🛑 Deteniendo Docker Compose..."
    docker-compose down
    echo "✅ Servicios detenidos"
}

# Función para preparar para GitHub
prepare_github() {
    echo "📦 Preparando para GitHub..."
    
    if [ ! -d ".git" ]; then
        git init
        echo "✅ Git inicializado"
    fi
    
    git add .
    echo "✅ Archivos agregados"
    
    read -p "📝 Mensaje del commit: " commit_message
    git commit -m "$commit_message"
    echo "✅ Commit creado"
    
    echo ""
    echo "📌 Próximos pasos:"
    echo "1. Crea un repositorio en GitHub"
    echo "2. Ejecuta: git remote add origin https://github.com/tu-usuario/cofradia.git"
    echo "3. Ejecuta: git branch -M main"
    echo "4. Ejecuta: git push -u origin main"
}

# Función para verificar build
check_build() {
    echo "🔍 Verificando build local..."
    npm run build
    echo "✅ Build exitoso"
}

# Función para limpiar
clean() {
    echo "🧹 Limpiando archivos temporales..."
    rm -rf .next
    rm -rf node_modules
    echo "✅ Limpieza completada"
}

# Menú principal
show_menu() {
    echo "Selecciona una opción:"
    echo ""
    echo "1) 🔨 Construir imagen Docker"
    echo "2) 🚀 Ejecutar Docker local"
    echo "3) 🐳 Iniciar con Docker Compose"
    echo "4) 🛑 Detener Docker"
    echo "5) 🛑 Detener Docker Compose"
    echo "6) 📦 Preparar para GitHub"
    echo "7) 🔍 Verificar build"
    echo "8) 🧹 Limpiar archivos temporales"
    echo "9) ❌ Salir"
    echo ""
}

# Si se pasa un argumento, ejecutar directamente
if [ $# -eq 1 ]; then
    case $1 in
        build)
            build_docker
            ;;
        run)
            run_docker
            ;;
        up)
            compose_up
            ;;
        stop)
            stop_docker
            ;;
        down)
            compose_down
            ;;
        github)
            prepare_github
            ;;
        check)
            check_build
            ;;
        clean)
            clean
            ;;
        *)
            echo "❌ Opción no válida: $1"
            echo "Uso: ./deploy.sh [build|run|up|stop|down|github|check|clean]"
            exit 1
            ;;
    esac
    exit 0
fi

# Menú interactivo
while true; do
    show_menu
    read -p "Opción: " option
    
    case $option in
        1)
            build_docker
            ;;
        2)
            run_docker
            ;;
        3)
            compose_up
            ;;
        4)
            stop_docker
            ;;
        5)
            compose_down
            ;;
        6)
            prepare_github
            ;;
        7)
            check_build
            ;;
        8)
            clean
            ;;
        9)
            echo "👋 ¡Hasta luego!"
            exit 0
            ;;
        *)
            echo "❌ Opción no válida"
            ;;
    esac
    
    echo ""
    read -p "Presiona Enter para continuar..."
    clear
done



