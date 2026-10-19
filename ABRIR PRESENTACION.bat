@echo off
title Presentacion ClassHub
cd /d "%~dp0"
set "NODO=node"
where node >nul 2>nul || set "NODO=D:\node.exe"
set "REPO=%~dp0..\..\Proyectos_programacion\Proyecto_tareas\ClassHub - Codigo"
set "AG=%LOCALAPPDATA%\Programs\Antigravity IDE\Antigravity IDE.exe"

rem 1. Servidor de la presentacion y del asistente (si ya esta encendido, no pasa nada)
start "Servidor de la presentacion (no cerrar)" /min "%NODO%" servidor\servidor.mjs

rem 2. El codigo de ClassHub abierto en Antigravity IDE
if exist "%AG%" start "" "%AG%" "%REPO%"

rem 3. La vista del presentador
timeout /t 3 /nobreak >nul
set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if exist "%CHROME%" (start "" "%CHROME%" --new-window "http://127.0.0.1:5190/") else (start "" "http://127.0.0.1:5190/")
