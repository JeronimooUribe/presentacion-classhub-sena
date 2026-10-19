// Vista del presentador: notas, repaso, código, preguntas, cronómetro y asistente de IA.
// Manda en la sincronización: lo que se haga aquí lo sigue la ventana del proyector.
(() => {
  const E = window.EXPO, M = window.MOTOR;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Enlace al código en Antigravity IDE. En el portátil el servidor lo abre directo (sin la ventanita del navegador).
  const vscode = (f, l) => `antigravity-ide://file/${encodeURI(`${E.repo}/${f}`)}${l ? `:${l}` : ''}`;
  const enlace = ([t, f, l]) => `<a class="cod" href="${vscode(f, l)}" title="Abrir en Antigravity"><i class="ph-bold ph-code"></i><span>${esc(t)}</span><small>${esc(f)}${l ? `:${l}` : ''}</small></a>`;
  const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // ---------- Notas de la diapositiva ----------
  function notas(estado) {
    const sl = E.slides[estado.s], p = E.equipo[sl.quien];
    document.documentElement.style.setProperty('--c', p.color);
    $('#numero').textContent = `${estado.s + 1} / ${M.total}`;
    $('#titulo').textContent = sl.titulo;
    $('#quien').innerHTML = `<i style="background:${p.color}"></i>${esc(p.n)}`;

    // Cada "[→]" del guion es un clic: se resalta lo que toca decir en el paso actual.
    let paso = 0;
    const guion = sl.guion.map(t => {
      const clic = t.startsWith('[→]');
      if (clic) paso++;
      const txt = esc(clic ? t.slice(3).trim() : t).replace(/^OJO:/, '<b class="ojo">OJO:</b>').replace(/^PASE:/, '<b class="pase">PASA LA PALABRA:</b>');
      return `<li class="${paso === estado.p ? 'ahora' : paso < estado.p ? 'dicho' : ''}">${clic ? '<span class="clic">clic</span>' : ''}${txt}</li>`;
    }).join('');

    const sena = sl.sena.length ? `<div class="sena-chips">${sl.sena.map(n => `<button data-sena="${n}">P${n} · ${esc(E.sena.find(x => x.id === n).p.slice(0, 48))}…</button>`).join('')}</div>` : '';
    $('#notas').innerHTML = `
      <div class="bloque guion"><h3><i class="ph-bold ph-chat-text"></i>Qué decir</h3><ol>${guion}</ol>${sena}</div>
      ${sl.repaso ? `<div class="bloque repaso"><h3><i class="ph-bold ph-book-open-text"></i>Repaso</h3>
        <p><b>Qué es.</b> ${esc(sl.repaso.que)}</p><p><b>Cómo funciona.</b> ${esc(sl.repaso.como)}</p></div>` : ''}
      ${sl.analogia ? `<div class="bloque analogia"><h3><i class="ph-bold ph-lightbulb"></i>Analogía</h3><p>${esc(sl.analogia)}</p></div>` : ''}
      ${sl.codigo.length ? `<div class="bloque"><h3><i class="ph-bold ph-folder-open"></i>En el código <small>clic = abre Antigravity en la línea</small></h3><div class="codigos">${sl.codigo.map(enlace).join('')}</div></div>` : ''}
      ${sl.preguntas.length ? `<div class="bloque"><h3><i class="ph-bold ph-question"></i>Pueden preguntar</h3>${sl.preguntas.map(q => `<details><summary>${esc(q.p)}</summary><p>${esc(q.r)}</p></details>`).join('')}</div>` : ''}`;

    // Puntos de pasos y tira de diapositivas
    $('#puntos').innerHTML = Array.from({ length: sl.pasos + 1 }, (_, i) => `<i class="${i <= estado.p ? 'on' : ''}"></i>`).join('');
    document.querySelectorAll('#tira button').forEach((b, i) => b.classList.toggle('activa', i === estado.s));
    const sig = estado.p < sl.pasos ? { s: estado.s, p: estado.p + 1 } : { s: Math.min(estado.s + 1, M.total - 1), p: 0 };
    const url = `publico.html?fijo=${sig.s}&paso=${sig.p}`;
    if ($('#sig').getAttribute('src') !== url) $('#sig').setAttribute('src', url);
  }

  $('#notas').addEventListener('click', e => {
    const b = e.target.closest('[data-sena]');
    if (b) abrirSena(Number(b.dataset.sena));
  });

  // ---------- Tira de diapositivas ----------
  $('#tira').innerHTML = E.slides.map((sl, i) => `<button style="--c:${E.equipo[sl.quien].color}" title="${esc(sl.titulo)} · ${esc(E.equipo[sl.quien].corto)}">${i + 1}</button>`).join('');
  $('#tira').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) M.ir([...b.parentNode.children].indexOf(b), 0);
  });

  // ---------- Cronómetro ----------
  let corriendo = false, acumulado = 0, desde = 0, inicioDiapo = Date.now(), ultima = -1;
  const total = () => acumulado + (corriendo ? (Date.now() - desde) / 1000 : 0);
  function relojBoton() { $('#reloj-btn').innerHTML = `<i class="ph-fill ph-${corriendo ? 'pause' : 'play'}"></i>`; }
  $('#reloj-btn').onclick = () => { if (corriendo) { acumulado = total(); corriendo = false; } else { desde = Date.now(); corriendo = true; } relojBoton(); };
  $('#reloj-cero').onclick = () => { acumulado = 0; desde = Date.now(); inicioDiapo = Date.now(); relojBoton(); };
  setInterval(() => {
    const t = total();
    $('#total').textContent = mmss(t);
    $('.reloj').classList.toggle('alerta', t > 13 * 60);
    $('.reloj').classList.toggle('pasado', t > 15 * 60);
    const sl = E.slides[M.estado.s], d = (Date.now() - inicioDiapo) / 1000;
    $('#tiempo-diapo').textContent = `${mmss(d)} · sugerido ${mmss(sl.seg)}`;
    $('#tiempo-diapo').classList.toggle('alerta', d > sl.seg + 15);
  }, 500);

  M.al((estado, cambio) => {
    if (cambio || ultima !== estado.s) { inicioDiapo = Date.now(); ultima = estado.s; }
    if (!corriendo && estado.s > 0 && acumulado === 0) { desde = Date.now(); corriendo = true; relojBoton(); }
    notas(estado);
  });
  // ?inicio o #inicio: la exposición arranca en la portada.
  if (/inicio/.test(location.hash + location.search)) M.ir(0, 0);
  notas(M.estado);
  ultima = M.estado.s;

  // ---------- Controles ----------
  $('#atras').onclick = () => M.anterior();
  $('#adelante').onclick = () => M.siguiente();
  M.teclado(k => {
    if (k === '/') { abrirIA(); }
    else if (k === 'Escape') { $('#ia').hidden = true; $('#sena').hidden = true; }
  });

  // Abre la pantalla del público; si el navegador lo permite, directo en la otra pantalla.
  let publico = null;
  $('#btn-proyectar').onclick = async () => {
    let opciones = 'popup,width=1280,height=720';
    try {
      if ('getScreenDetails' in window) {
        const d = await window.getScreenDetails();
        const otra = d.screens.find(s => s !== d.currentScreen);
        if (otra) opciones = `popup,left=${otra.availLeft},top=${otra.availTop},width=${otra.availWidth},height=${otra.availHeight}`;
      }
    } catch { /* sin permiso: se abre normal y se arrastra */ }
    publico = window.open('publico.html', 'classhub-publico', opciones);
    if (publico) aviso('Ventana del público abierta. Si no quedó en el proyector, arrástrala allá. Dentro de ella: un clic = pantalla completa.');
    else aviso('El navegador bloqueó la ventana: permite ventanas emergentes para este sitio.');
  };

  function aviso(t) {
    let a = $('#aviso');
    if (!a) { a = document.createElement('div'); a.id = 'aviso'; a.className = 'aviso'; document.body.appendChild(a); }
    a.textContent = t; a.classList.add('ver');
    clearTimeout(a._t); a._t = setTimeout(() => a.classList.remove('ver'), 6000);
  }

  // ---------- Preguntas SENA ----------
  const quienCorto = i => `<span class="quien-mini" style="--c:${E.equipo[i].color}">${esc(E.equipo[i].corto)}</span>`;
  $('#sena-lista').innerHTML = E.sena.map(q => `
    <article class="sena-item" id="sena-${q.id}">
      <header><span class="n">P${q.id}</span><h3>${esc(q.p)}</h3></header>
      <div class="meta">Responde ${quienCorto(q.quien)}${q.dia.length ? ` · se ve en diap. ${q.dia.join(', ')}` : ''}</div>
      <p>${esc(q.r)}</p>
      ${q.codigo ? `<div class="codigos">${q.codigo.map(enlace).join('')}</div>` : ''}
      ${q.id === 13 ? `<table class="borrar"><thead><tr><th>Línea</th><th>Qué es</th><th>Si se borra…</th></tr></thead><tbody>${E.borrar.map(([f, l, que, efecto]) =>
        `<tr><td><a href="${vscode(f, l)}">${esc(f)}:${l}</a></td><td><code>${esc(que)}</code></td><td>${esc(efecto)}</td></tr>`).join('')}</tbody></table>` : ''}
    </article>`).join('');
  function abrirSena(id) {
    $('#sena').hidden = false; $('#ia').hidden = true;
    if (id) { const el = document.getElementById(`sena-${id}`); el?.scrollIntoView({ block: 'start' }); el?.classList.add('brilla'); setTimeout(() => el?.classList.remove('brilla'), 1600); }
  }
  $('#btn-sena').onclick = () => { if ($('#sena').hidden) abrirSena(); else $('#sena').hidden = true; };

  $('#sena [data-cerrar]').onclick = () => { $('#sena').hidden = true; };

  // ---------- Abrir código en Antigravity ----------
  // Si la presentación corre en el portátil (servidor local), el servidor abre Antigravity en la línea.
  // Desde la nube se usa el enlace antigravity-ide:// tal cual.
  document.addEventListener('click', async e => {
    const a = e.target.closest('a[href^="antigravity-ide://file/"]');
    if (!a || location.port !== '5190') return;
    e.preventDefault();
    const m = decodeURI(a.getAttribute('href').slice('antigravity-ide://file/'.length)).match(/^(.*?)(?::(\d+))?$/);
    const ruta = m[1].startsWith(E.repo + '/') ? m[1].slice(E.repo.length + 1) : m[1];
    try {
      const r = await fetch(`/api/abrir?f=${encodeURIComponent(ruta)}&l=${m[2] || 1}`);
      if (!r.ok) throw new Error((await r.json()).error || r.status);
      aviso(`Abriendo ${ruta}${m[2] ? ':' + m[2] : ''} en Antigravity…`);
    } catch (err) { location.href = a.getAttribute('href'); }
  });

  // ---------- Asistente de IA ----------
  // En el portátil habla con su servidor local; desde la nube, con el asistente desplegado en Railway (pide PIN).
  const NUBE = 'https://asistente-production-0007.up.railway.app';
  const BASE = location.port === '5190' ? '' : NUBE;
  const CLAVE_PIN = 'classhub-expo-pin';
  let pin = '';
  try { pin = localStorage.getItem(CLAVE_PIN) || ''; } catch { /* sin almacenamiento */ }
  const guardarPin = v => { pin = v; try { localStorage.setItem(CLAVE_PIN, v); } catch { /* sin almacenamiento */ } };
  const historial = [];
  let iaLista = false;
  async function estadoIA() {
    try {
      const r = await fetch(`${BASE}/api/estado`, { cache: 'no-store' });
      const j = await r.json();
      iaLista = j.ok && j.ia;
      $('#ia-estado').textContent = !iaLista ? 'sin clave de IA' : `conectado${BASE ? ' (nube)' : ''} · ${j.archivos} archivos${j.pin && !pin ? ' · falta el PIN' : ''}`;
    } catch {
      iaLista = false;
      // Desde la nube el navegador no deja hablar con el portátil: se ofrece saltar a la versión local.
      $('#ia-estado').textContent = BASE ? 'sin conexión con el asistente' : 'apagado: abre con ABRIR PRESENTACION.bat';
    }
    $('#ia-punto').classList.toggle('on', iaLista);
  }
  estadoIA();
  setInterval(estadoIA, 30000);

  function abrirIA() { $('#ia').hidden = false; $('#sena').hidden = true; document.body.classList.add('ia-abierta'); $('#ia-q').focus(); }
  const cerrarIA = () => { $('#ia').hidden = true; document.body.classList.remove('ia-abierta'); };
  $('#ia-btn').onclick = () => { if ($('#ia').hidden) abrirIA(); else cerrarIA(); };
  $('#ia [data-cerrar-ia]').onclick = cerrarIA;
  $('#ia').addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Escape') cerrarIA(); });
  $('.ia-sugerencias').addEventListener('click', e => { const b = e.target.closest('button'); if (b) enviar(b.textContent); });

  // Convierte la respuesta: [[ruta:línea]] → enlace a Antigravity, **negrita**, `código`.
  function formatear(t) {
    return esc(t)
      .replace(/\[\[([^\]:]+?)(?::(\d+))?\]\]/g, (_, f, l) => `<a class="cod-mini" href="${vscode(f.trim(), l)}"><i class="ph-bold ph-code"></i>${esc(f.trim())}${l ? `:${l}` : ''}</a>`)
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  async function enviar(pregunta) {
    pregunta = pregunta.trim();
    if (!pregunta) return;
    const chat = $('#ia-chat');
    chat.querySelector('.ia-sugerencias')?.remove();
    const burbuja = document.createElement('div');
    burbuja.className = 'ia-par';
    burbuja.innerHTML = `<p class="q">${esc(pregunta)}</p><p class="r cargando"><i class="ph-bold ph-circle-notch"></i>Buscando…</p>`;
    chat.appendChild(burbuja);
    chat.scrollTop = chat.scrollHeight;
    const r = burbuja.querySelector('.r');
    const t0 = Date.now();
    try {
      const res = await fetch(`${BASE}/api/preguntar`, {
        method: 'POST', headers: { 'content-type': 'application/json', 'x-pin': pin },
        body: JSON.stringify({ pregunta, historial, diapo: `${M.estado.s + 1}. ${E.slides[M.estado.s].titulo}` }),
      });
      const j = await res.json();
      if (res.status === 401) { pedirPin(r, pregunta); burbuja.querySelector('.q').remove(); return; }
      if (!res.ok) throw new Error(j.error || 'Error');
      r.classList.remove('cargando');
      if (j.respaldo) r.classList.add('respaldo');
      r.innerHTML = formatear(j.texto) + `<small class="seg">${((Date.now() - t0) / 1000).toFixed(1)} s</small>`;
      historial.push({ p: pregunta, r: j.texto });
    } catch (e) {
      r.classList.remove('cargando');
      r.classList.add('error');
      r.textContent = iaLista ? `No respondió (${e.message}). Intenta de nuevo.`
        : BASE ? 'No hay conexión con el asistente. Revisa el internet e intenta de nuevo.'
        : 'El asistente está apagado. Abre el acceso directo "Presentacion ClassHub" del escritorio.';
    }
    burbuja.scrollIntoView({ block: 'start' });
  }
  // Pide el PIN del equipo una sola vez (queda guardado en este navegador) y repite la pregunta.
  function pedirPin(r, pregunta) {
    r.classList.remove('cargando');
    r.innerHTML = '<form class="pin-form"><b>PIN del equipo</b><input inputmode="numeric" autocomplete="off" placeholder="6 dígitos"><button>Entrar</button></form>' + (pin ? '<small class="seg">El PIN guardado no es correcto.</small>' : '');
    const f = r.querySelector('form');
    f.querySelector('input').focus();
    f.addEventListener('submit', ev => { ev.preventDefault(); guardarPin(f.querySelector('input').value.trim()); r.closest('.ia-par').remove(); estadoIA(); enviar(pregunta); });
  }

  $('#ia-form').addEventListener('submit', e => { e.preventDefault(); const q = $('#ia-q').value; $('#ia-q').value = ''; enviar(q); });
})();
