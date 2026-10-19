# MODO EXPOSICION de ClassHub.
# 1) Cierra todo lo que no se necesita (deja Claude abierto).
# 2) Abre solo lo de la expo: servidor, Antigravity IDE con ClassHub, presentador y proyector en Chrome.
# 3) Si hay proyector conectado, manda la ventana del publico alla en pantalla completa.
# Con -SoloProyectar solo hace el paso 3 (para cuando se conecta el HDMI despues).
param([switch]$SoloProyectar)

$ErrorActionPreference = 'SilentlyContinue'
$aqui = Split-Path -Parent $MyInvocation.MyCommand.Path
$raiz = Split-Path -Parent $aqui
$repo = Join-Path $raiz '..\..\Proyectos_programacion\Proyecto_tareas\ClassHub - Codigo' | Resolve-Path | Select-Object -ExpandProperty Path
$ide = Join-Path $env:LOCALAPPDATA 'Programs\Antigravity IDE\Antigravity IDE.exe'
$chrome = Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'
$node = (Get-Command node -ErrorAction SilentlyContinue).Source; if (-not $node) { $node = 'D:\node.exe' }

Add-Type -AssemblyName System.Windows.Forms
Add-Type @"
using System; using System.Text; using System.Runtime.InteropServices;
public class Win {
  public delegate bool CB(IntPtr h, IntPtr p);
  [DllImport("user32.dll")] public static extern bool EnumWindows(CB cb, IntPtr p);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int w, int hh, uint f);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  public static IntPtr Buscar(string a, string b) {
    IntPtr r = IntPtr.Zero;
    EnumWindows((h, p) => { if (!IsWindowVisible(h)) return true; var s = new StringBuilder(300); GetWindowText(h, s, 300);
      var t = s.ToString(); if (t.Contains(a) && t.Contains(b)) { r = h; return false; } return true; }, IntPtr.Zero);
    return r;
  }
}
"@

function Esperar-Ventana($a, $b, $seg) {
  for ($i = 0; $i -lt $seg * 2; $i++) { $h = [Win]::Buscar($a, $b); if ($h -ne [IntPtr]::Zero) { return $h }; Start-Sleep -Milliseconds 500 }
  return [IntPtr]::Zero
}

function Proyectar {
  $pantallas = [System.Windows.Forms.Screen]::AllScreens
  $pub = Esperar-Ventana 'ClassHub' 'Proyecci' 15
  $pres = Esperar-Ventana 'ClassHub' 'Presentador' 15
  if ($pantallas.Count -lt 2 -or $pub -eq [IntPtr]::Zero) { return $false }
  $otra = $pantallas | Where-Object { -not $_.Primary } | Select-Object -First 1
  $b = $otra.Bounds
  [Win]::ShowWindow($pub, 9) | Out-Null          # restaurar
  [Win]::SetWindowPos($pub, [IntPtr]::Zero, $b.X, $b.Y, $b.Width, $b.Height, 0x0040) | Out-Null
  [Win]::ShowWindow($pub, 3) | Out-Null          # maximizar en el proyector
  [Win]::SetForegroundWindow($pub) | Out-Null
  Start-Sleep -Milliseconds 600
  [System.Windows.Forms.SendKeys]::SendWait('{F11}')   # pantalla completa
  Start-Sleep -Milliseconds 600
  if ($pres -ne [IntPtr]::Zero) { [Win]::ShowWindow($pres, 3) | Out-Null; [Win]::SetForegroundWindow($pres) | Out-Null }
  return $true
}

if ($SoloProyectar) {
  & DisplaySwitch.exe /extend; Start-Sleep -Seconds 4
  Proyectar | Out-Null
  exit
}

# ---------- 1. Cerrar lo que no se necesita ----------
$cerrar = @(
  'WhatsApp', 'WhatsApp.Root', 'OneDrive', 'Spotify', 'SpotifyLauncher', 'steam', 'steamwebhelper', 'ms-teams', 'Teams',
  'ChatGPT', 'ChatGPT Classic', 'codex', 'codex-code-mode-host', 'codex-computer-use-swift', 'copilot-runtime', 'Copilot',
  'Code', 'msedge', 'GeminiAppLauncher', 'GeminiCrashpadHandler', 'ollama app', 'ollama', 'AnyDesk',
  'iCloudCKKS', 'iCloudServices', 'iCloudDrive', 'SystemSettings', 'Antigravity', 'Obsidian', 'Discord', 'Telegram', 'Notion',
  'Postman', 'idea64', 'webstorm64', 'pycharm64', 'clion64', 'GitHubDesktop', 'OUTLOOK', 'olk', 'WINWORD', 'EXCEL',
  'POWERPNT', 'ONENOTE', 'EpicGamesLauncher', 'EADesktop', 'upc', 'PBIDesktop', 'ProcessHacker',
  'Docker Desktop', 'com.docker.backend', 'com.docker.build', 'docker-sandbox',
  'chrome', 'Antigravity IDE'
)
foreach ($n in $cerrar) { Get-Process -Name $n -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue }
Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -like '*servidor.mjs*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
Start-Process -FilePath 'wsl.exe' -ArgumentList '--shutdown' -WindowStyle Hidden   # en segundo plano: no hace esperar
Start-Sleep -Seconds 2

# ---------- 2. Abrir solo lo de la exposicion ----------
& DisplaySwitch.exe /extend
Start-Process -FilePath $node -ArgumentList 'servidor\servidor.mjs' -WorkingDirectory $raiz -WindowStyle Hidden
if (Test-Path $ide) { Start-Process -FilePath $ide -ArgumentList "`"$repo`"" }
for ($i = 0; $i -lt 20; $i++) { try { if ((Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:5190/api/estado' -TimeoutSec 2).StatusCode -eq 200) { break } } catch {}; Start-Sleep -Milliseconds 500 }
Start-Process -FilePath $chrome -ArgumentList '--new-window', '--start-maximized', 'http://127.0.0.1:5190/#inicio'
Start-Sleep -Seconds 3
Start-Process -FilePath $chrome -ArgumentList '--new-window', 'http://127.0.0.1:5190/publico.html'
Start-Sleep -Seconds 3

# ---------- 3. Proyector ----------
Proyectar | Out-Null
