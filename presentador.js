// Vista del presentador: notas, repaso, código, preguntas, cronómetro y asistente de IA.
// Manda en la sincronización: lo que se haga aquí lo sigue la ventana del proyector.
(() => {
  const E = window.EXPO, M = window.MOTOR;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const vscode = (f, l) => `vscode://file/${encodeURI(`${E.repo}/${f}`)}${l ? `:${l}` : ''}`;
  const enlace = ([t, f, l]) => `<a class="cod" href="${vscode(f, l)}" title="Abrir en VS Code"><i class="ph-bold ph-code"></i><span>${esc(t)}</span><small>${esc(f)}${l ? `:${l}` : ''}</small></a>`;
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
      const txt = esc(clic ? t.slice(3).trim() : t).replace(/^OJO:/, '<b class="ojo">OJO:</b>');
      return `<li class="${paso === estado.p ? 'ahora' : paso < estado.p ? 'dicho' : ''}">${clic ? '<span class="clic">clic</span>' : ''}${txt}</li>`;
    }).join('');

    const sena = sl.sena.length ? `<div class="sena-chips">${sl.sena.map(n => `<button data-sena="${n}">P${n} · ${esc(E.sena.find(x => x.id === n).p.slice(0, 48))}…</button>`).join('')}</div>` : '';
    $('#notas').innerHTML = `
      <div class="bloque guion"><h3><i class="ph-bold ph-chat-text"></i>Qué decir</h3><ol>${guion}</ol>${sena}</div>
      ${sl.repaso ? `<div class="bloque repaso"><h3><i class="ph-bold ph-book-open-text"></i>Repaso</h3>
        <p><b>Qué es.</b> ${esc(sl.repaso.que)}</p><p><b>Cómo funciona.</b> ${esc(sl.repaso.como)}</p></div>` : ''}
      ${sl.analogia ? `<div class="bloque analogia"><h3><i class="ph-bold ph-lightbulb"></i>Analogía</h3><p>${esc(sl.analogia)}</p></div>` : ''}
      ${sl.codigo.length ? `<div class="bloque"><h3><i class="ph-bold ph-folder-open"></i>En el código <small>clic = abre VS Code en la línea</small></h3><div class="codigos">${sl.codigo.map(enlace).join('')}</div></div>` : ''}
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

  // ---------- Asistente de IA ----------
  const BASE = location.port === '5190' ? '' : 'http://127.0.0.1:5190';
  const historial = [];
  let iaLista = false;
  async function estadoIA() {
    try {
      const r = await fetch(`${BASE}/api/estado`, { cache: 'no-store' });
      const j = await r.json();
      iaLista = j.ok && j.ia;
      $('#ia-estado').textContent = iaLista ? `conectado · ${j.archivos} archivos de código` : 'sin clave de IA';
    } catch {
      iaLista = false;
      $('#ia-estado').textContent = 'apagado: abre con ABRIR PRESENTACION.bat';
    }
    $('#ia-punto').classList.toggle('on', iaLista);
  }
  estadoIA();
  setInterval(estadoIA, 30000);

  function abrirIA() { $('#ia').hidden = false; $('#sena').hidden = true; $('#ia-q').focus(); }
  $('#ia-btn').onclick = () => { if ($('#ia').hidden) abrirIA(); else $('#ia').hidden = true; };
  $('#ia [data-cerrar-ia]').onclick = () => { $('#ia').hidden = true; };
  $('#ia').addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Escape') $('#ia').hidden = true; });
  $('.ia-sugerencias').addEventListener('click', e => { const b = e.target.closest('button'); if (b) enviar(b.textContent); });

  // Convierte la respuesta: [[ruta:línea]] → enlace a VS Code, **negrita**, `código`.
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
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ pregunta, historial, diapo: `${M.estado.s + 1}. ${E.slides[M.estado.s].titulo}` }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Error');
      r.classList.remove('cargando');
      r.innerHTML = formatear(j.texto) + `<small class="seg">${((Date.now() - t0) / 1000).toFixed(1)} s</small>`;
      historial.push({ p: pregunta, r: j.texto });
    } catch (e) {
      r.classList.remove('cargando');
      r.classList.add('error');
      r.textContent = iaLista ? `No respondió (${e.message}). Intenta de nuevo.` : 'El asistente está apagado. Abre la presentación con ABRIR PRESENTACION.bat.';
    }
    chat.scrollTop = chat.scrollHeight;
  }
  $('#ia-form').addEventListener('submit', e => { e.preventDefault(); const q = $('#ia-q').value; $('#ia-q').value = ''; enviar(q); });
})();
