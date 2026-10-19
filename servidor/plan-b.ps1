# Plan B de la exposición: deja ClassHub corriendo en el portátil (sin internet) por si se cae la red.
# Lo lanza ABRIR PRESENTACION.bat en segundo plano; no muestra ventanas.
param([string]$Repo)

$docker = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
docker info *> $null
if (-not $?) {
  if (-not (Test-Path $docker)) { exit 0 }
  Start-Process $docker
  for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 3
    docker info *> $null
    if ($?) { break }
  }
}
docker compose -f (Join-Path $Repo 'docker-compose.yml') up -d --no-build *> $null
