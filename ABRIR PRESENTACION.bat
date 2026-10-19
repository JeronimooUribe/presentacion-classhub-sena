@echo off
title Presentacion ClassHub
cd /d "%~dp0"
set NODO=node
where node >nul 2>nul || set NODO=D:\node.exe
start "Servidor de la presentacion (no cerrar)" /min "%NODO%" servidor\servidor.mjs
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5190/"
