// Motor compartido: estado (diapositiva + paso), sincronización entre ventanas y dibujo de una diapositiva.
// Las ventanas del mismo origen se hablan por BroadcastChannel; el estado también queda en localStorage.
(() => {
  const E = window.EXPO;
  const CLAVE = 'classhub-expo-estado';
  const canal = 'BroadcastChannel' in window ? new BroadcastChannel('classhub-expo') : null;
  const oyentes = [];
  const total = E.slides.length;
  const limitar = (n, a, b) => Math.max(a, Math.min(b, n));

  const leer = () => { try { return JSON.parse(localStorage.getItem(CLAVE)); } catch { return null; } };
  const guardar = e => { try { localStorage.setItem(CLAVE, JSON.stringify(e)); } catch { /* sin almacenamiento */ } };

  let estado = leer() || { s: 0, p: 0 };
  if (!(estado.s >= 0 && estado.s < total)) estado = { s: 0, p: 0 };

  function avisar(cambio) { oyentes.forEach(f => f(estado, cambio)); }

  const M = window.MOTOR = {
    total,
    get estado() { return estado; },
    al(f) { oyentes.push(f); },
    ir(s, p = 0, emitir = true) {
      s = limitar(s, 0, total - 1);
      p = limitar(p, 0, E.slides[s].pasos);
      const cambio = s !== estado.s;
      estado = { s, p };
      guardar(estado);
      if (emitir && canal) canal.postMessage({ tipo: 'estado', s, p });
      avisar(cambio);
    },
    siguiente() {
      const { s, p } = estado;
      if (p < E.slides[s].pasos) M.ir(s, p + 1);
      else if (s < total - 1) M.ir(s + 1, 0);
    },
    anterior() {
      const { s, p } = estado;
      if (p > 0) M.ir(s, p - 1);
      else if (s > 0) M.ir(s - 1, E.slides[s - 1].pasos);
    },
    enviar(msg) { if (canal) canal.postMessage(msg); },
    alMensaje(f) { if (canal) canal.addEventListener('message', ev => f(ev.data)); },

    // Teclas de presentador y de clicker (los clickers mandan PageDown / PageUp).
    teclado(extra) {
      document.addEventListener('keydown', e => {
        if (e.target.closest && e.target.closest('input, textarea, [contenteditable]')) return;
        const k = e.key;
        if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); M.siguiente(); }
        else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); M.anterior(); }
        else if (k === 'Home') M.ir(0, 0);
        else if (k === 'End') M.ir(total - 1, 0);
        else if (k === 'b' || k === 'B' || k === '.') M.enviar({ tipo: 'negro' }), extra && extra('negro');
        else if (extra) extra(k, e);
      });
    },

    // Dibuja la diapositiva s en el lienzo y aplica su paso.
    dibujar(lienzo, s, p, animar = true) {
      const sl = E.slides[s];
      const persona = E.equipo[sl.quien];
      lienzo.style.setProperty('--c', persona.color);
      lienzo.innerHTML = sl.publico();
      lienzo.dataset.diapo = s + 1;
      if (!animar) lienzo.classList.add('quieto'); else lienzo.classList.remove('quieto');
      // Doble frame: así la transición de los pasos visibles desde el inicio se alcanza a ver.
      requestAnimationFrame(() => requestAnimationFrame(() => M.paso(lienzo, p)));
      M.contar(lienzo, animar);
    },
    paso(lienzo, p) {
      lienzo.dataset.paso = p;
      lienzo.querySelectorAll('[data-p]').forEach(el => el.classList.toggle('on', Number(el.dataset.p) <= p));
      lienzo.querySelectorAll('[data-hasta]').forEach(el => el.classList.toggle('fuera', p > Number(el.dataset.hasta)));
    },
    contar(lienzo, animar) {
      lienzo.querySelectorAll('.contar').forEach(el => {
        const fin = Number(el.dataset.n);
        if (!animar) { el.textContent = fin; return; }
        const dur = 1400, ini = performance.now() + 350;
        const paso = t => {
          const x = limitar((t - ini) / dur, 0, 1);
          el.textContent = Math.round(fin * (1 - Math.pow(1 - x, 3)));
          if (x < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
      });
    },
  };

  if (canal) {
    canal.addEventListener('message', ev => {
      const d = ev.data || {};
      if (d.tipo === 'estado') {
        const cambio = d.s !== estado.s;
        estado = { s: d.s, p: d.p };
        guardar(estado);
        avisar(cambio);
      } else if (d.tipo === 'pedir') {
        canal.postMessage({ tipo: 'estado', ...estado });
      }
    });
  }
})();
