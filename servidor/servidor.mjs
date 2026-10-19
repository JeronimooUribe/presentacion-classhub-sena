// Servidor local de la presentación de ClassHub.
//  - Sirve los archivos de la presentación en http://127.0.0.1:5190
//  - /api/preguntar: asistente de IA (Claude) con el conocimiento del tablero y acceso de solo lectura al código.
// La clave de Anthropic se lee del .env.local de ClassHub (o de ANTHROPIC_API_KEY); nunca se escribe ni se envía al navegador.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..');
const PUERTO = Number(process.env.PUERTO || 5190);
const REPO = path.resolve(process.env.CLASSHUB_REPO || path.join(RAIZ, '../../Proyectos_programacion/Proyecto_tareas/ClassHub - Codigo'));
const TABLERO = path.resolve(RAIZ, '../tablero');
const MODELOS = (process.env.MODELOS || 'claude-sonnet-5-5,claude-haiku-5-5,claude-sonnet-4-6').split(',');
const ORIGENES = new Set(['https://jeronimoouribe.github.io', `http://127.0.0.1:${PUERTO}`, `http://localhost:${PUERTO}`]);

// ---------- Clave ----------
function leerClave() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY.trim();
  for (const f of [path.join(AQUI, '.env'), path.join(REPO, '.env.local')]) {
    try {
      const m = fs.readFileSync(f, 'utf8').match(/^ANTHROPIC_API_KEY\s*=\s*"?([^"\r\n]+)"?/m);
      if (m) return m[1].trim();
    } catch { /* no existe */ }
  }
  return '';
}
const CLAVE = leerClave();

// ---------- Índice del código (solo lectura) ----------
const EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.sql', '.yml', '.yaml', '.toml', '.md', '.css']);
const NOMBRES = new Set(['Dockerfile', '.env.example', '.dockerignore']);
const SALTAR = new Set(['node_modules', '.next', '.git', 'coverage', '.claude', '.vercel', '.netlify']);
const archivos = new Map(); // ruta relativa → líneas
function indexar(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SALTAR.has(e.name)) continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) { indexar(abs); continue; }
    if (!(EXT.has(path.extname(e.name)) || NOMBRES.has(e.name)) || e.name === 'package-lock.json') continue;
    if (fs.statSync(abs).size > 300_000) continue;
    archivos.set(path.relative(REPO, abs).split(path.sep).join('/'), fs.readFileSync(abs, 'utf8').split(/\r?\n/));
  }
}
try { indexar(REPO); } catch (e) { console.error('No pude leer el repositorio:', REPO, e.message); }

function buscarCodigo({ patron, carpeta = '' }) {
  let re;
  try { re = new RegExp(patron, 'i'); } catch { re = new RegExp(String(patron).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); }
  const out = [];
  for (const [ruta, lineas] of archivos) {
    if (carpeta && !ruta.startsWith(carpeta)) continue;
    lineas.forEach((t, i) => { if (out.length < 40 && re.test(t)) out.push(`${ruta}:${i + 1}: ${t.trim().slice(0, 170)}`); });
  }
  return out.length ? out.join('\n') : 'Sin coincidencias.';
}
function leerArchivo({ ruta, desde = 1, hasta }) {
  const lineas = archivos.get(String(ruta).replace(/^\.?\//, ''));
  if (!lineas) return `No existe "${ruta}". Usa listar_archivos o buscar_codigo.`;
  const a = Math.max(1, Number(desde) || 1);
  const b = Math.min(lineas.length, Number(hasta) || a + 80, a + 150);
  return lineas.slice(a - 1, b).map((t, i) => `${a + i}| ${t}`).join('\n') + `\n(${lineas.length} líneas en total)`;
}
function listarArchivos({ carpeta = '' }) {
  const l = [...archivos.keys()].filter(r => r.startsWith(carpeta)).sort();
  return l.slice(0, 250).join('\n') + (l.length > 250 ? `\n… y ${l.length - 250} más` : '');
}
const HERRAMIENTAS = [
  { name: 'buscar_codigo', description: 'Busca una expresión regular (sin distinguir mayúsculas) en todo el código de ClassHub. Devuelve ruta:línea: texto.',
    input_schema: { type: 'object', properties: { patron: { type: 'string', description: 'Expresión regular de JavaScript, sin barras' }, carpeta: { type: 'string', description: 'Prefijo opcional de carpeta, ej. app/api' } }, required: ['patron'] } },
  { name: 'leer_archivo', description: 'Lee líneas numeradas de un archivo del código de ClassHub (máximo 150 por llamada).',
    input_schema: { type: 'object', properties: { ruta: { type: 'string' }, desde: { type: 'integer' }, hasta: { type: 'integer' } }, required: ['ruta'] } },
  { name: 'listar_archivos', description: 'Lista los archivos del proyecto bajo una carpeta.',
    input_schema: { type: 'object', properties: { carpeta: { type: 'string' } } } },
];
const EJECUTAR = { buscar_codigo: buscarCodigo, leer_archivo: leerArchivo, listar_archivos: listarArchivos };

// ---------- Conocimiento del tablero ----------
function conocimiento() {
  const partes = [];
  for (const f of ['lider.js', 'codigo.js', 'esencial.js', 'preguntas-dificiles.js', 'data.js', 'conceptos.js', 'contenido.js']) {
    try { partes.push(`### tablero/${f}\n` + fs.readFileSync(path.join(TABLERO, f), 'utf8')); } catch { /* opcional */ }
  }
  try { partes.push('### presentacion/contenido.js (diapositivas, guion, preguntas del SENA)\n' + fs.readFileSync(path.join(RAIZ, 'contenido.js'), 'utf8')); } catch { /* opcional */ }
  return partes.join('\n\n');
}
const SISTEMA = `Eres el asistente privado del equipo de ClassHub (Jerónimo Uribe Garcés, Juan Sebastián Carmona, Juan Diego Gaviria y Miguel Ángel Valencia) para su exposición de proyecto de grado en el SENA. Te consultan en vivo, en segundos, desde el portátil del expositor; el público no te ve.

CÓMO RESPONDER (obligatorio):
- Español claro. Máximo 3 frases cortas, menos de 60 palabras. Sin títulos, sin listas, sin saludos ni cierres.
- Si piden una diferencia o comparación: una línea por concepto ("API: …" y "HTTPS: …") y una línea con el ejemplo real en ClassHub.
- Si preguntan dónde está algo, cómo funciona en el código o qué pasa si se borra una línea: busca con las herramientas y LEE el archivo para confirmar la línea antes de citarla. Nunca inventes rutas ni números de línea.
- Cita ubicaciones exactamente así: [[ruta/del/archivo.ts:123]] (máximo 3). El sistema las convierte en enlaces que abren VS Code en esa línea.
- Usa los nombres reales (funciones, tablas, archivos). Si algo no existe en ClassHub, dilo en una frase.
- También puedes explicar conceptos generales de programación del mundo real, en corto, y conectarlos con ClassHub.
- Sé honesto con la deuda técnica (códigos en texto plano, recordatorios sin cron activo, Sentry sin clave, sin pruebas E2E).

Los números de línea son del repositorio local (rama guia-exposicion: cada archivo empieza con una nota de 7 líneas "GUÍA DE EXPOSICIÓN").

CONOCIMIENTO VERIFICADO (tablero de estudio y presentación):
${conocimiento()}`;

async function llamarClaude(mensajes) {
  let ultimoError;
  for (const modelo of MODELOS) {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': CLAVE, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: modelo, max_tokens: 700, tools: HERRAMIENTAS, messages: mensajes,
        system: [{ type: 'text', text: SISTEMA, cache_control: { type: 'ephemeral' } }],
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (r.ok) return { ...j, modelo };
    ultimoError = j.error?.message || `HTTP ${r.status}`;
    if (![404, 400, 529, 500, 503].includes(r.status)) break; // clave mala o límite: no tiene sentido probar otro modelo
  }
  throw new Error(ultimoError);
}

async function preguntar({ pregunta, historial = [], diapo = '' }) {
  const mensajes = [];
  for (const h of historial.slice(-3)) {
    if (h?.p && h?.r) mensajes.push({ role: 'user', content: String(h.p).slice(0, 600) }, { role: 'assistant', content: String(h.r).slice(0, 1200) });
  }
  mensajes.push({ role: 'user', content: (diapo ? `(Diapositiva actual: ${diapo})\n` : '') + String(pregunta).slice(0, 1200) });
  let modelo = '';
  for (let vuelta = 0; vuelta < 7; vuelta++) {
    const res = await llamarClaude(mensajes);
    modelo = res.modelo;
    const usos = res.content.filter(b => b.type === 'tool_use');
    if (res.stop_reason !== 'tool_use' || !usos.length) {
      return { texto: res.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim(), modelo };
    }
    mensajes.push({ role: 'assistant', content: res.content });
    mensajes.push({ role: 'user', content: usos.map(u => ({ type: 'tool_result', tool_use_id: u.id, content: String((EJECUTAR[u.name] || (() => 'Herramienta desconocida'))(u.input || {})).slice(0, 12000) })) });
  }
  return { texto: 'No alcancé a ubicarlo; reformula la pregunta más corta.', modelo };
}

// ---------- HTTP ----------
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.ico': 'image/x-icon', '.webp': 'image/webp' };

function cors(req, res) {
  const o = req.headers.origin;
  if (o && ORIGENES.has(o)) {
    res.setHeader('Access-Control-Allow-Origin', o);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
  }
}
function json(res, code, obj) { res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(obj)); }

const servidor = http.createServer(async (req, res) => {
  cors(req, res);
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const url = new URL(req.url, `http://127.0.0.1:${PUERTO}`);

  if (url.pathname === '/api/estado') return json(res, 200, { ok: true, ia: Boolean(CLAVE), archivos: archivos.size, modelo: MODELOS[0] });

  if (url.pathname === '/api/preguntar' && req.method === 'POST') {
    if (!CLAVE) return json(res, 503, { error: 'No encontré la clave de Anthropic.' });
    let cuerpo = '';
    for await (const trozo of req) { cuerpo += trozo; if (cuerpo.length > 20_000) return json(res, 413, { error: 'Pregunta muy larga' }); }
    try {
      const datos = JSON.parse(cuerpo || '{}');
      if (!String(datos.pregunta || '').trim()) return json(res, 400, { error: 'Escribe una pregunta' });
      const t0 = Date.now();
      const r = await preguntar(datos);
      console.log(`[${new Date().toLocaleTimeString()}] ${((Date.now() - t0) / 1000).toFixed(1)} s · ${r.modelo} · ${String(datos.pregunta).slice(0, 70)}`);
      return json(res, 200, r);
    } catch (e) {
      console.error('Error del asistente:', e.message);
      return json(res, 502, { error: 'El asistente no respondió: ' + e.message });
    }
  }

  // Archivos estáticos de la presentación (sin salir de la carpeta).
  let ruta = decodeURIComponent(url.pathname);
  if (ruta === '/') ruta = '/index.html';
  const abs = path.resolve(RAIZ, '.' + ruta);
  if (!abs.startsWith(RAIZ + path.sep) || abs.startsWith(AQUI)) { res.writeHead(403); return res.end(); }
  fs.readFile(abs, (err, data) => {
    if (err) { res.writeHead(404); return res.end('No encontrado'); }
    res.writeHead(200, { 'content-type': TIPOS[path.extname(abs).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-cache' });
    res.end(data);
  });
});

servidor.listen(PUERTO, '127.0.0.1', () => {
  console.log(`Presentación ClassHub: http://127.0.0.1:${PUERTO}`);
  console.log(`Asistente IA: ${CLAVE ? 'listo' : 'SIN CLAVE'} · ${archivos.size} archivos de código indexados`);
});
