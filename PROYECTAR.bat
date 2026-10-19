@echo off
title Proyectar ClassHub
powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0servidor\expo.ps1" -SoloProyectar
