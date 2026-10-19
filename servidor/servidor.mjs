// Servidor local de la presentación de ClassHub.
//  - Sirve los archivos de la presentación en http://127.0.0.1:5190
//  - /api/preguntar: asistente de IA (Claude) con el conocimiento del tablero y acceso de solo lectura al código.
// La clave de Anthropic se lee del .env.local de ClassHub (o de ANTHROPIC_API_KEY); nunca se escribe ni se envía al navegador.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

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

CONCEPTO VIGENTE (manda sobre cualquier texto viejo): ClassHub es un proyecto de los estudiantes y para los estudiantes. En cada salón hay monitores (de tareas, de asistencia…); quien publica las tareas es el MONITOR DE TAREAS o un estudiante elegido por el grupo. En el código ese rol se llama "moderator" (moderador). Los profesores NO son usuarios de la app. Nunca uses la palabra "docente": di siempre "monitor de tareas" (o "monitor"). "Profesor" solo para los profesores reales que dictan la clase. En la app de producción la cuenta de prueba del monitor puede seguir llamándose docente@classhub.demo; en el modo offline es monitor@classhub.demo.

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
    const cuerpo = JSON.stringify({
      model: modelo, max_tokens: 700, tools: HERRAMIENTAS, messages: mensajes,
      system: [{ type: 'text', text: SISTEMA, cache_control: { type: 'ephemeral' } }],
    });
    let r;
    // Un corte de red momentáneo no debe dejar al expositor sin respuesta: hasta 3 intentos.
    for (let intento = 1; ; intento++) {
      try {
        r = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-api-key': CLAVE, 'anthropic-version': '2023-06-01' },
          body: cuerpo,
        });
        break;
      } catch (e) {
        if (intento >= 3) throw new Error('sin conexión a internet (' + e.message + ')');
        await new Promise(ok => setTimeout(ok, 700 * intento));
      }
    }
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


// ---------- Respaldo sin internet ----------
// Si no hay conexión con Claude, se responde con lo ya verificado (presentación + tablero) y una búsqueda en el código.
const SIN_INTERNET = process.env.SIN_INTERNET === '1';
function cargarBase() {
  const caja = { window: {} };
  caja.window.window = caja.window;
  vm.createContext(caja);
  const correr = f => { try { vm.runInContext(fs.readFileSync(f, 'utf8'), caja); } catch { /* opcional */ } };
  for (const f of ['data.js', 'contenido.js', 'esencial.js', 'conceptos.js', 'codigo.js', 'lider.js', 'preguntas-dificiles.js']) correr(path.join(TABLERO, f));
  correr(path.join(RAIZ, 'contenido.js'));
  const E = caja.window.EXPO || {}, T = caja.window.TABLERO || {};
  const base = [];
  const add = (p, r, loc) => { if (p && r) base.push({ p: String(p), r: String(r), loc }); };
  (E.sena || []).forEach(q => add(q.p, q.r, q.codigo?.[0] ? `${q.codigo[0][1]}:${q.codigo[0][2]}` : ''));
  (E.borrar || []).forEach(([f, l, que, efecto]) => add(`qué pasa si borro ${que} ${f} línea ${l}`, `Si se borra ${que}: ${efecto}`, `${f}:${l}`));
  (E.slides || []).forEach(sl => {
    (sl.preguntas || []).forEach(q => add(q.p, q.r));
    if (sl.repaso) add(`${sl.titulo} qué es cómo funciona`, `${sl.repaso.que} ${sl.repaso.como}`, sl.codigo?.[0] ? `${sl.codigo[0][1]}:${sl.codigo[0][2]}` : '');
    (sl.codigo || []).forEach(([t, f, l]) => add(`dónde está ${t}`, `${t}.`, `${f}:${l}`));
  });
  (T.esferas || []).forEach(e => (e.preguntas || []).forEach(q => add(q.p, q.r)));
  (T.codigo?.simulacro || []).forEach(([p, r]) => add(p, r));
  (T.codigo?.funciones || []).forEach(([n, loc, d]) => add(`${n} ${d}`, `${n}: ${d}.`, String(loc).split(' / ')[0]));
  (T.conceptos || []).forEach(c => add(`qué es ${c.nombre}`, `${c.nombre}: ${c.que} ${c.enClassHub || ''}`));
  (T.lider?.stack || []).forEach(x => add(`qué es ${x.n} para qué`, `${x.n}: ${x.que} ${x.uso}`));
  return base;
}
const BASE = cargarBase();
const sinTildes = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const VACIAS = new Set('que como donde cual cuales para por con los las del una uno unos unas sus esta este esto son hay pasa porque cuando entre sobre classhub tiene hace hacen puede pueden nuestro nuestra'.split(' '));
const palabras = t => sinTildes(t).split(/[^a-z0-9_.]+/).filter(w => w.length > 2 && !VACIAS.has(w));

function respuestaSinInternet(pregunta) {
  const pq = palabras(pregunta);
  const puntaje = item => {
    const p = sinTildes(item.p), r = sinTildes(item.r);
    return pq.reduce((a, w) => a + (p.includes(w) ? 3 : 0) + (r.includes(w) ? 1 : 0), 0);
  };
  const orden = BASE.map(x => ({ x, n: puntaje(x) })).sort((a, b) => b.n - a.n);
  const mejor = orden[0];
  let texto;
  if (mejor && mejor.n >= 4) {
    const r = mejor.x.r.length > 420 ? mejor.x.r.slice(0, 420).replace(/\s\S*$/, '') + '…' : mejor.x.r;
    const locs = new Set();
    if (mejor.x.loc) locs.add(mejor.x.loc);
    (mejor.x.r.match(/[\w()[\]./-]+\.(?:tsx?|js|sql|yml|json|toml)(?::\d+)?/g) || []).forEach(l => locs.add(l));
    texto = r + (locs.size ? '\n' + [...locs].slice(0, 3).map(l => `[[${l}]]`).join(' ') : '');
  } else {
    // Sin respuesta guardada: buscar la palabra más rara de la pregunta en el código.
    const clave = pq.filter(w => /[a-z]{4,}/.test(w)).sort((a, b) => b.length - a.length)[0];
    const hallazgos = clave ? buscarCodigo({ patron: clave.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }).split('\n').filter(l => /:\d+:/.test(l)).slice(0, 3) : [];
    texto = hallazgos.length
      ? `No tengo una respuesta guardada; en el código aparece "${clave}" aquí: ` + hallazgos.map(l => `[[${l.split(': ')[0]}]]`).join(' ')
      : 'No tengo una respuesta guardada para eso. Busca en el panel "Preguntas SENA" o en el mapa del código.';
  }
  return { texto: 'Sin internet · respuesta guardada: ' + texto, modelo: 'respaldo local', respaldo: true };
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

  if (url.pathname === '/api/estado') return json(res, 200, { ok: true, ia: Boolean(CLAVE), respaldo: BASE.length, archivos: archivos.size, modelo: MODELOS[0] });

  if (url.pathname === '/api/preguntar' && req.method === 'POST') {
    let cuerpo = '';
    for await (const trozo of req) { cuerpo += trozo; if (cuerpo.length > 20_000) return json(res, 413, { error: 'Pregunta muy larga' }); }
    try {
      const datos = JSON.parse(cuerpo || '{}');
      if (!String(datos.pregunta || '').trim()) return json(res, 400, { error: 'Escribe una pregunta' });
      const t0 = Date.now();
      let r;
      try {
        if (!CLAVE || SIN_INTERNET) throw new Error('sin conexión a internet (modo respaldo)');
        r = await preguntar(datos);
      } catch (e) {
        if (!/conexi|fetch|network|ENOTFOUND|ECONN|EAI_AGAIN|timeout/i.test(e.message)) throw e;
        r = respuestaSinInternet(String(datos.pregunta));
      }
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
  console.log(`Asistente IA: ${CLAVE ? 'listo' : 'SIN CLAVE'} · ${archivos.size} archivos de código · ${BASE.length} respuestas guardadas para usar sin internet`);
});
