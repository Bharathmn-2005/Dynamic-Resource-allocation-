@echo off
REM Health check script for Windows
echo.
echo 🏥 Checking service health...
echo.

set /a failed=0

echo Checking Auth Service (8080)...
curl -s http://localhost:8080/actuator/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Auth Service OK
) else (
    echo ❌ Auth Service FAILED
    set /a failed=failed+1
)

echo Checking Booking Service (8082)...
curl -s http://localhost:8082/actuator/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Booking Service OK
) else (
    echo ❌ Booking Service FAILED
    set /a failed=failed+1
)

echo Checking Payment Service (8083)...
curl -s http://localhost:8083/actuator/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Payment Service OK
) else (
    echo ❌ Payment Service FAILED
    set /a failed=failed+1
)

echo Checking Notification Service (8081)...
curl -s http://localhost:8081/actuator/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Notification Service OK
) else (
    echo ❌ Notification Service FAILED
    set /a failed=failed+1
)

echo.
if %failed% EQU 0 (
    echo ✅ All services are healthy!
    exit /b 0
) else (
    echo ❌ %failed% service(s) failed health check
    exit /b 1
)
