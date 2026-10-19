@echo off
title Pantalla dividida ClassHub
powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0servidor\expo.ps1" -Dividido
