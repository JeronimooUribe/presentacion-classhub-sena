// Pantalla del público (proyector). Modos por URL:
//   publico.html            → sigue al presentador y también se maneja sola (teclado, clic, deslizar)
//   publico.html?mini=1     → vista previa dentro del presentador (solo sigue)
//   publico.html?fijo=N&paso=P → una diapositiva fija (vista "siguiente")
(() => {
  const E = window.EXPO, M = window.MOTOR;
  const q = new URLSearchParams(location.search);
  const mini = q.has('mini'), fijo = q.has('fijo');
  const escenario = document.getElementById('escenario');
  const lienzo = document.getElementById('lienzo');
  const pie = document.getElementById('pie');
  const barra = document.getElementById('barra');
  const negro = document.getElementById('negro');
  if (mini || fijo) document.body.classList.add('incrustado');

  // El lienzo mide 1920×1080 y se escala para llenar la ventana sin deformarse.
  function escalar() {
    const k = Math.min(innerWidth / 1920, innerHeight / 1080);
    escenario.style.transform = `translate(-50%, -50%) scale(${k})`;
  }
  addEventListener('resize', escalar);
  escalar();

  function marco(s) {
    const sl = E.slides[s], p = E.equipo[sl.quien];
    pie.innerHTML = s === 0 ? '' : `<span><i style="background:${p.color}"></i>${p.n}</span><span>${s + 1} / ${M.total}</span>`;
    barra.style.width = `${((s + 1) / M.total) * 100}%`;
    barra.style.background = p.color;
  }

  if (fijo) {
    const s = Math.max(0, Math.min(M.total - 1, Number(q.get('fijo')) || 0));
    M.dibujar(lienzo, s, Number(q.get('paso')) || 0, false);
    marco(s);
    return;
  }

  function mostrar(estado, cambio) {
    if (cambio || !lienzo.innerHTML) { M.dibujar(lienzo, estado.s, estado.p); marco(estado.s); }
    else M.paso(lienzo, estado.p);
  }
  M.al(mostrar);
  mostrar(M.estado, true);
  M.enviar({ tipo: 'pedir' });

  M.alMensaje(d => { if (d.tipo === 'negro') negro.hidden = !negro.hidden; });
  if (mini) return;

  M.teclado(k => {
    if (k === 'negro') negro.hidden = !negro.hidden;
    if (k === 'f' || k === 'F') pantallaCompleta();
  });
  function pantallaCompleta() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  }
  // Clic: avanza (y la primera vez entra a pantalla completa). Doble clic: sale.
  let primera = true;
  addEventListener('click', () => {
    if (primera && !document.fullscreenElement && matchMedia('(pointer: fine)').matches) { primera = false; pantallaCompleta(); return; }
    M.siguiente();
  });
  // Celular: deslizar para pasar.
  let x0 = null;
  addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) dx < 0 ? M.siguiente() : M.anterior();
  });
})();
