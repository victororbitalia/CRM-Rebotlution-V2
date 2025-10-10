@echo off
REM Script de ayuda para despliegue en Windows
REM Uso: deploy.bat [opcion]

echo.
echo ============================================
echo   REBOTLUTION CRM - Script de Despliegue
echo ============================================
echo.

if "%1"=="build" goto build
if "%1"=="up" goto up
if "%1"=="down" goto down
if "%1"=="logs" goto logs
if "%1"=="check" goto check
if "%1"=="github" goto github
if "%1"=="clean" goto clean
if "%1"=="" goto menu
goto invalid

:menu
echo Selecciona una opcion:
echo.
echo 1. Construir imagen Docker
echo 2. Iniciar con Docker Compose
echo 3. Detener Docker Compose
echo 4. Ver logs
echo 5. Verificar build
echo 6. Preparar para GitHub
echo 7. Limpiar archivos temporales
echo 8. Salir
echo.
set /p option="Opcion: "

if "%option%"=="1" goto build
if "%option%"=="2" goto up
if "%option%"=="3" goto down
if "%option%"=="4" goto logs
if "%option%"=="5" goto check
if "%option%"=="6" goto github
if "%option%"=="7" goto clean
if "%option%"=="8" goto end
goto invalid

:build
echo.
echo Construyendo imagen Docker...
docker build -t cofradia-crm:latest .
if %errorlevel% equ 0 (
    echo.
    echo [OK] Imagen construida exitosamente
) else (
    echo.
    echo [ERROR] Fallo al construir la imagen
)
goto end

:up
echo.
echo Iniciando con Docker Compose...
docker-compose up -d
if %errorlevel% equ 0 (
    echo.
    echo [OK] Aplicacion ejecutandose en http://localhost:3001
    echo Ver logs: docker-compose logs -f
) else (
    echo.
    echo [ERROR] Fallo al iniciar
)
goto end

:down
echo.
echo Deteniendo Docker Compose...
docker-compose down
if %errorlevel% equ 0 (
    echo.
    echo [OK] Servicios detenidos
) else (
    echo.
    echo [ERROR] Fallo al detener
)
goto end

:logs
echo.
echo Mostrando logs...
docker-compose logs -f
goto end

:check
echo.
echo Verificando build local...
call npm run build
if %errorlevel% equ 0 (
    echo.
    echo [OK] Build exitoso
) else (
    echo.
    echo [ERROR] Build fallo
)
goto end

:github
echo.
echo Preparando para GitHub...
echo.

if not exist .git (
    git init
    echo [OK] Git inicializado
)

git add .
echo [OK] Archivos agregados

set /p commit_message="Mensaje del commit: "
git commit -m "%commit_message%"
echo [OK] Commit creado

echo.
echo Proximos pasos:
echo 1. Crea un repositorio en GitHub
echo 2. Ejecuta: git remote add origin https://github.com/tu-usuario/cofradia.git
echo 3. Ejecuta: git branch -M main
echo 4. Ejecuta: git push -u origin main
goto end

:clean
echo.
echo Limpiando archivos temporales...
if exist .next rmdir /s /q .next
if exist node_modules rmdir /s /q node_modules
echo [OK] Limpieza completada
goto end

:invalid
echo.
echo [ERROR] Opcion no valida
echo Uso: deploy.bat [build^|up^|down^|logs^|check^|github^|clean]
goto end

:end
echo.
pause



