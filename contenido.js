// Contenido de la presentación de ClassHub.
// Cada diapositiva tiene dos caras: `publico` (lo que ve el proyector: poco texto, grande y animado)
// y los campos del presentador (guion, repaso, analogía, código y preguntas), que solo ve el equipo.
// Las líneas de código corresponden a la rama guia-exposicion (la que tiene las notas).

window.EXPO = {
  repo: 'C:/Users/Jerónimo/Desktop/Programacion/Proyectos_programacion/Proyecto_tareas/ClassHub - Codigo',
  app: 'https://classhub-production.up.railway.app',

  equipo: [
    { n: 'Jerónimo Uribe Garcés', corto: 'Jerónimo', color: '#4C8DFF', tema: 'Cómo se conecta todo', icono: 'ph-graph' },
    { n: 'Juan Sebastián Carmona', corto: 'Juan Sebastián', color: '#22C9A6', tema: 'Lo que ves', icono: 'ph-device-mobile' },
    { n: 'Juan Diego Gaviria', corto: 'Juan Diego', color: '#FFB020', tema: 'Datos e inteligencia', icono: 'ph-database' },
    { n: 'Miguel Ángel Valencia', corto: 'Miguel Ángel', color: '#B07CFF', tema: 'Nube y calidad', icono: 'ph-cloud-check' },
  ],

  slides: [
    // ───────────────────────────── INICIO ─────────────────────────────
    {
      titulo: 'Portada', quien: 0, seg: 25, pasos: 0, sena: [],
      publico: () => `
        <div class="s portada">
          <img class="logo-ch pop" src="img/logo.png" alt="Logo de ClassHub">
          <h1 class="mega a" style="--d:.25s">ClassHub</h1>
          <p class="sub a" style="--d:.55s">Las tareas del colegio, en un solo lugar</p>
          <div class="equipo-fila a" style="--d:.85s">${EXPO.equipo.map(p => `<span style="--c:${p.color}">${p.n}</span>`).join('')}</div>
        </div>`,
      guion: [
        'Saludo: "Buenos días. Somos Jerónimo, Juan Sebastián, Juan Diego y Miguel Ángel."',
        '"Les presentamos ClassHub, nuestro proyecto de grado."',
        'Pasar rápido: la portada no se explica.',
      ],
      repaso: { que: 'ClassHub es una aplicación web full-stack: el monitor de tareas de cada salón publica las tareas y los estudiantes las ven y marcan su avance desde el celular.', como: 'Next.js + TypeScript (frontend y backend), MySQL (datos), desplegada en Railway con Docker.' },
      analogia: '',
      codigo: [['package.json: todas las librerías', 'package.json', 1]],
      preguntas: [],
    },
    {
      titulo: 'El problema', quien: 0, seg: 40, pasos: 2, sena: [1],
      publico: () => `
        <div class="s gancho">
          <h1 class="t1 centro pregunta a" data-hasta="1">¿Qué tarea había<br>para mañana?</h1>
          <div class="burbujas" data-p="1" data-hasta="1">
            <span style="--x:5%;--y:46%;--r:-4deg">¿Alguien copió la tarea?</span>
            <span style="--x:58%;--y:44%;--r:3deg">¿Para cuándo era?</span>
            <span style="--x:12%;--y:62%;--r:2deg">No vine ayer 😅</span>
            <span style="--x:50%;--y:61%;--r:-3deg">¿En hoja o en el cuaderno?</span>
            <span style="--x:8%;--y:78%;--r:-2deg">El profe lo dijo en clase…</span>
            <span style="--x:50%;--y:78%;--r:3deg">Se perdió en el WhatsApp 🙃</span>
          </div>
          <div class="solucion" data-p="2">
            <div class="tel grande"><img src="img/app/app-03-estudiante-tablero.png" alt=""></div>
            <div class="sol-texto">
              <p class="t2">El monitor publica <b>una vez</b>.</p>
              <p class="t2">Todo el grupo <b>lo ve</b>.</p>
              <div class="chips">
                <span class="chip"><i class="ph-bold ph-student"></i>Estudiantes</span>
                <span class="chip"><i class="ph-bold ph-clipboard-text"></i>Monitores de tareas</span>
                <span class="chip"><i class="ph-bold ph-shield-star"></i>Administradores</span>
              </div>
            </div>
          </div>
        </div>`,
      guion: [
        'Pregunta al público, con pausa: "¿Cuántos se han enterado de una tarea el mismo día de entregarla?"',
        '[→] "Las tareas se dictan en clase y quedan regadas: cuaderno, WhatsApp, el que no vino no se entera."',
        '[→] "En cada salón ya existe el monitor de tareas. Con ClassHub, él (o quien el grupo elija) publica la tarea una vez y todo el grupo la ve en el celular; cada uno marca su avance."',
        '"Es un proyecto de los estudiantes, para los estudiantes: los profesores no tienen que usar nada nuevo."',
        'Nombrar los 3 usuarios: estudiantes, monitores de tareas y administradores.',
      ],
      repaso: { que: 'El problema: no había una fuente única de tareas; nadie sabía qué estaba pendiente ni qué estaba hecho.', como: 'Usuarios: estudiantes (ven y marcan), monitores de tareas: en el código el rol se llama moderator (publican tareas, avisos y horario) y administradores (gestionan usuarios, grupos y materias). En producción: 49 cuentas reales y 90 grupos.' },
      analogia: 'Es pasar de "el que copió en el cuaderno" a una cartelera digital única que cada estudiante lleva en el bolsillo.',
      codigo: [['Tablero del estudiante', 'app/(app)/dashboard/page.tsx', 8]],
      preguntas: [],
    },
    {
      titulo: 'El recorrido', quien: 0, seg: 30, pasos: 0, sena: [],
      publico: () => `
        <div class="s indice">
          <h1 class="t1 a">El recorrido</h1>
          <div class="indice-grid">
            ${EXPO.equipo.map((p, i) => `
              <div class="tarjeta-ind a" style="--d:${0.25 + i * 0.18}s;--c:${p.color}">
                <span class="num">${i + 1}</span>
                <i class="ph-bold ${p.icono}"></i>
                <b>${p.tema}</b>
                <small>${p.corto}</small>
              </div>`).join('')}
          </div>
        </div>`,
      guion: [
        '"Lo vamos a contar en 4 partes:"',
        '"Yo les explico cómo se conecta todo: la arquitectura, la API y la seguridad."',
        '"Juan Sebastián, lo que se ve. Juan Diego, los datos y la inteligencia artificial. Miguel Ángel, la nube y la calidad."',
        '"Al final pueden probar ClassHub en su celular."',
      ],
      repaso: { que: 'El índice muestra el orden y quién expone cada parte.', como: '3 diapositivas por persona en el cuerpo. Jerónimo abre y cierra.' },
      analogia: '',
      codigo: [],
      preguntas: [],
    },

    // ───────────────────────────── 1 · JERÓNIMO ─────────────────────────────
    {
      titulo: 'Cómo se conecta todo', quien: 0, seg: 60, pasos: 3, sena: [3, 4],
      publico: () => `
        <div class="s arqui">
          <h1 class="t1 a">Cómo se conecta todo</h1>
          <div class="arq-fila">
            <div class="nodo" data-p="0" style="--c:#4C8DFF">
              <i class="ph-bold ph-device-mobile"></i><b>Cliente</b><span>Navegador · React</span>
              <em><i class="ph-bold ph-fork-knife"></i>la mesa</em>
            </div>
            <div class="via" data-p="1"><div class="linea ida"><i></i><i></i><i></i></div><small>API · el mesero</small><div class="linea vuelta"><i></i><i></i><i></i></div></div>
            <div class="nodo" data-p="1" style="--c:#22C9A6">
              <i class="ph-bold ph-cpu"></i><b>Servidor</b><span>Node.js · Next.js</span>
              <em><i class="ph-bold ph-cooking-pot"></i>la cocina</em>
            </div>
            <div class="via" data-p="2"><div class="linea ida"><i></i><i></i><i></i></div><small>SQL</small><div class="linea vuelta"><i></i><i></i><i></i></div></div>
            <div class="nodo" data-p="2" style="--c:#FFB020">
              <i class="ph-bold ph-database"></i><b>Base de datos</b><span>MySQL 8</span>
              <em><i class="ph-bold ph-archive"></i>la despensa</em>
            </div>
          </div>
          <p class="t2 centro" data-p="3">Todo en <b>TypeScript</b> · todo en <b>Railway</b></p>
        </div>`,
      guion: [
        '"ClassHub tiene tres piezas, como un restaurante."',
        '[→] "El cliente es el celular: muestra las pantallas, hechas con React. Es la mesa: pide."',
        '[→] "El servidor corre en Node.js: recibe el pedido por la API, revisa permisos y prepara la respuesta. Es la cocina."',
        '[→] "La base de datos MySQL guarda todo. Es la despensa. El cliente NUNCA habla directo con la base: siempre pasa por la API."',
        '[→] "Un solo lenguaje, TypeScript, en el frontend y el backend, y todo publicado en Railway."',
      ],
      repaso: {
        que: 'Arquitectura cliente-servidor en 3 capas: frontend (React en el navegador), backend (API de Next.js corriendo en Node.js) y base de datos (MySQL).',
        como: 'El frontend llama con fetch(\'/api/...\'); el middleware revisa la sesión; la ruta (route.ts) consulta MySQL con lib/db.ts y responde JSON. Next.js junta frontend y backend en un solo proyecto.',
      },
      analogia: 'Restaurante: la mesa (cliente) pide, el mesero (API) lleva el pedido con un formato fijo, la cocina (servidor) prepara y la despensa (base de datos) guarda los ingredientes. El cliente nunca entra a la despensa.',
      codigo: [
        ['Frontend: el tablero pide las tareas', 'app/(app)/dashboard/page.tsx', 43],
        ['Backend: la ruta que responde', 'app/api/tasks/route.ts', 13],
        ['Conexión a MySQL (pool de 10)', 'lib/db.ts', 12],
      ],
      preguntas: [
        { p: '¿Por qué Next.js y no un frontend y un backend separados?', r: 'Porque junta los dos en un solo proyecto y un solo lenguaje: menos piezas que mantener y publicar. Las pantallas son page.tsx y la API son route.ts, en la misma carpeta app/.' },
        { p: '¿Qué pasa si se cae la base de datos?', r: 'Las rutas detectan el error con isDbDown y responden 503 "servicio no disponible" en vez de un error genérico. /api/health también lo reporta. (lib/api-auth.ts:59)' },
        { p: '¿Cuántos usuarios aguanta?', r: 'No hicimos pruebas de carga, así que no inventamos un número. La sesión va en el token (sin estado en el servidor) y la base tiene índices y un pool de 10 conexiones.' },
      ],
    },
    {
      titulo: 'API y HTTPS', quien: 0, seg: 60, pasos: 3, sena: [3, 4, 6],
      publico: () => `
        <div class="s api">
          <h1 class="t1 a">API: el menú del servidor</h1>
          <div class="verbos" data-p="0">
            <span class="verbo" style="--c:#22C9A6"><b>GET</b>leer</span>
            <span class="verbo" style="--c:#4C8DFF"><b>POST</b>crear</span>
            <span class="verbo" style="--c:#FFB020"><b>PATCH</b>cambiar</span>
            <span class="verbo" style="--c:#FF5C7A"><b>DELETE</b>borrar</span>
          </div>
          <div class="viaje">
            <i class="ph-bold ph-device-mobile extremo"></i>
            <div class="carril">
              <div class="peticion" data-p="1"><code>GET /api/v1/tasks</code></div>
              <div class="respuesta" data-p="2"><code>200 OK · [ { "title": "Taller…" } ]</code></div>
            </div>
            <i class="ph-bold ph-cpu extremo"></i>
          </div>
          <div class="https" data-p="3"><i class="ph-fill ph-lock-key"></i><span><b>HTTPS</b> = HTTP + candado: el viaje va cifrado</span></div>
        </div>`,
      guion: [
        '"La API es el menú: solo se puede pedir lo que está en la carta, con un formato fijo."',
        '"Cada pedido tiene un verbo: GET lee, POST crea, PATCH cambia, DELETE borra. Tenemos 37 rutas."',
        '[→] "Ejemplo real: al abrir el tablero, el celular manda GET /api/v1/tasks."',
        '[→] "El servidor responde 200 OK con la lista de tareas en JSON."',
        '[→] "Y todo viaja por HTTPS: es el mismo HTTP, pero cifrado, con candado. Nadie en el camino puede leerlo."',
      ],
      repaso: {
        que: 'API = el conjunto de direcciones (rutas) que ofrece el servidor. HTTP = el protocolo, el idioma del pedido. HTTPS = HTTP cifrado con TLS. API y HTTPS no son lo mismo: la API es QUÉ se pide; HTTPS es CÓMO viaja.',
        como: 'En Next.js cada carpeta de app/api es una dirección y su route.ts exporta funciones con el nombre del verbo (GET, POST…). /api/v1 es la versión 1: reexporta las rutas para poder cambiarlas sin romper a los clientes.',
      },
      analogia: 'La API es el menú del restaurante; HTTP es el idioma en que se hace el pedido; HTTPS es entregar ese pedido en un sobre sellado que solo la cocina puede abrir.',
      codigo: [
        ['GET: listar tareas', 'app/api/tasks/route.ts', 13],
        ['POST: crear tarea', 'app/api/tasks/route.ts', 37],
        ['PATCH: cambiar estado', 'app/api/tasks/[id]/status/route.ts', 17],
        ['/api/v1 reexporta la ruta', 'app/api/v1/tasks/route.ts', 1],
      ],
      preguntas: [
        { p: '¿Cuál es la diferencia entre API y HTTPS?', r: 'La API es qué se puede pedir (las rutas, como GET /api/v1/tasks). HTTPS es cómo viaja el pedido: el protocolo HTTP cifrado. Una API puede viajar por HTTP o por HTTPS; la nuestra va por HTTPS.' },
        { p: '¿Por qué /api/v1?', r: 'Es versionado: si mañana cambiamos el formato, creamos v2 y lo que ya usa v1 no se rompe.' },
        { p: '¿Por qué los ids son textos largos (UUID)?', r: 'Porque no se pueden adivinar: con números alguien probaría /tasks/1, /tasks/2… Se generan con crypto.randomUUID() en createTask.' },
      ],
    },
    {
      titulo: 'Seguridad', quien: 0, seg: 65, pasos: 3, sena: [6, 11],
      publico: () => `
        <div class="s segu">
          <h1 class="t1 a">El portero y la pulsera</h1>
          <div class="jwt" data-p="0">
            <span class="p1">eyJhbGciOi…</span><span class="pt">.</span><span class="p2">eyJyb2xlIjoic3R1ZGVudCJ9…</span><span class="pt">.</span><span class="p3">SflKxwRJ…</span>
          </div>
          <div class="jwt-et" data-p="0"><span class="p1">encabezado</span><span class="p2">quién eres · rol · vence en 1 h</span><span class="p3">firma</span></div>
          <div class="puertas">
            <div class="puerta ok" data-p="1"><i class="ph-bold ph-student"></i><span>/dashboard</span><b><i class="ph-fill ph-check-circle"></i>pasa</b></div>
            <div class="puerta no" data-p="2"><i class="ph-bold ph-student"></i><span>/api/admin</span><b><i class="ph-fill ph-prohibit"></i>403</b></div>
          </div>
          <div class="chips centro" data-p="3">
            <span class="chip"><i class="ph-bold ph-lock-simple"></i>10 intentos → bloqueo 15 min</span>
            <span class="chip"><i class="ph-bold ph-cookie"></i>Cookie HttpOnly</span>
            <span class="chip"><i class="ph-bold ph-check-square"></i>Zod valida todo</span>
          </div>
        </div>`,
      guion: [
        '"Al iniciar sesión, el servidor les entrega una pulsera digital: un JWT. Dice quién eres, tu rol y vence en una hora. Va firmada: si alguien la cambia, la firma no cuadra."',
        '[→] "Antes de CADA página o API, el portero, el middleware, revisa la pulsera. Estudiante a su tablero: pasa."',
        '[→] "Estudiante pidiendo /api/admin: 403, prohibido (y si abre la página /admin, lo devuelve a su tablero). Segunda capa: cada API vuelve a revisar el rol con requireRole."',
        '[→] "Además: 10 intentos fallidos bloquean 15 minutos, la cookie es HttpOnly (el JavaScript no la puede leer) y Zod valida cada dato antes de tocar la base."',
        'PASE: "Eso es lo que no se ve. Ahora Juan Sebastián les muestra lo que sí ven en el celular."',
      ],
      repaso: {
        que: 'JWT (JSON Web Token): un token firmado con el usuario, su rol y su vencimiento (1 hora). Se guarda en la cookie st_session, HttpOnly. Un segundo token de 30 días lo renueva solo, con rotación.',
        como: 'middleware.ts corre antes de cada petición: lee la cookie, verifica la firma con jose y compara el rol con la ruta. Sin sesión redirige al login; sin permiso responde 403. Luego cada API llama requireSession() o requireRole() (defensa en profundidad).',
      },
      analogia: 'Pulsera de concierto: te la ponen en la entrada después de mostrar la boleta (correo y código), dice tu zona (rol), vence al final del día (1 hora) y es difícil de falsificar (firma). El portero (middleware) la revisa en cada puerta.',
      codigo: [
        ['El portero (middleware)', 'middleware.ts', 37],
        ['403 en /api/admin', 'middleware.ts', 82], ['/admin → vuelve al tablero', 'middleware.ts', 72],
        ['Crear el JWT de 1 hora', 'lib/auth.ts', 30],
        ['Cookie HttpOnly', 'lib/auth.ts', 55],
        ['Límite de intentos', 'lib/rate-limit.ts', 12],
        ['Validación con Zod', 'lib/schemas.ts', 69],
      ],
      preguntas: [
        { p: '¿Por qué la sesión va en una cookie y no en localStorage?', r: 'Porque la cookie HttpOnly no la puede leer el JavaScript de la página: un script malicioso (XSS) no puede robar la sesión. En localStorage sí podría.' },
        { p: '¿Por qué dos capas de permisos? ¿No es repetido?', r: 'A propósito: defensa en profundidad. Si una capa falla, la otra protege. El bug de junio fue justo en el middleware y las rutas seguían validando.' },
        { p: '¿Qué es la rotación de tokens?', r: 'Cada vez que se usa el token de 30 días, se invalida y se entrega uno nuevo. Si alguien usa uno viejo robado, se detecta. (lib/tokens.ts:86)' },
        { p: '¿Cómo evitan la inyección SQL?', r: 'Todas las consultas usan parámetros "?" con mysql2: el dato nunca se pega dentro del SQL. Ej: WHERE t.group_id = ? (lib/services/tasks.ts:67)' },
      ],
    },

    // ───────────────────────────── 2 · JUAN SEBASTIÁN ─────────────────────────────
    {
      titulo: 'Frontend', quien: 1, seg: 55, pasos: 2, sena: [3, 7],
      publico: () => `
        <div class="s front">
          <div class="col-izq">
            <h1 class="t1 a">Pantallas hechas<br>con piezas</h1>
            <div class="piezas">
              <span class="pieza a" style="--d:.4s">&lt;Sidebar /&gt;</span>
              <span class="pieza a" style="--d:.6s">&lt;TaskCard /&gt;</span>
              <span class="pieza a" style="--d:.75s">&lt;TaskCard /&gt;</span>
              <span class="pieza a" style="--d:.9s">&lt;TaskStatusButton /&gt;</span>
            </div>
            <p class="t3" data-p="1"><code>'use client'</code> → corre en tu celular</p>
            <p class="t3" data-p="2"><code>app/(app)/dashboard</code> → <b>/dashboard</b></p>
            <div class="logos-fila a" style="--d:1s">
              <i class="logo" style="--i:url(img/logos/react.svg);--c:#61DAFB"></i><i class="logo" style="--i:url(img/logos/nextdotjs.svg)"></i><i class="logo" style="--i:url(img/logos/tailwindcss.svg);--c:#38BDF8"></i><i class="logo" style="--i:url(img/logos/typescript.svg);--c:#3178C6"></i>
            </div>
          </div>
          <div class="tel grande a" style="--d:.3s"><img src="img/app/app-03-estudiante-tablero.png" alt=""></div>
        </div>`,
      guion: [
        '"Lo que ven en el celular está hecho con React: cada pantalla se arma con piezas reutilizables, como LEGO. Una TaskCard se repite por cada tarea."',
        '[→] "¿Cómo se sabe que un archivo es frontend? Empieza con \'use client\': corre en el navegador del celular."',
        '[→] "Y con Next.js la carpeta es la dirección: app/(app)/dashboard es la página /dashboard."',
        '"El estilo es Tailwind: diseño pensado primero para el celular, que se adapta a tablet y computador."',
      ],
      repaso: {
        que: 'Frontend = lo que corre en el navegador. React construye pantallas con componentes; Next.js organiza las páginas por carpetas; Tailwind da el estilo con clases; TypeScript le pone tipos a todo.',
        como: 'Las pantallas están en app/(app) (con sesión) y app/(auth) (sin sesión); las piezas en components/. Cada pantalla pide los datos con fetch a la API y los dibuja. Los paréntesis de (app) no salen en la dirección.',
      },
      analogia: 'LEGO: no se fabrica cada pantalla desde cero; se arman con las mismas piezas (TaskCard, botones, menú) y cambiar una pieza la cambia en todas partes.',
      codigo: [
        ["'use client' en el tablero", 'app/(app)/dashboard/page.tsx', 8],
        ['La pieza TaskCard', 'components/TaskCard.tsx', 24],
        ['Botón de estado', 'components/TaskStatusButton.tsx', 33],
        ['Estilos (Tailwind)', 'tailwind.config.ts', 1],
      ],
      preguntas: [
        { p: '¿Cómo tuvieron en cuenta el celular?', r: 'Diseño mobile-first con Tailwind: primero para pantalla pequeña y luego se amplía con sm:, md:, lg: (89 usos). Además es una PWA instalable.' },
        { p: '¿Qué es un componente?', r: 'Una función de React que devuelve una parte de la pantalla (JSX). Se reutiliza con datos distintos: TaskCard recibe una tarea y la dibuja.' },
      ],
    },
    {
      titulo: 'Tres roles', quien: 1, seg: 55, pasos: 2, sena: [1, 2],
      publico: () => `
        <div class="s roles">
          <h1 class="t1 a">3 roles · 3 vistas</h1>
          <div class="roles-fila">
            <div class="rol" data-p="0" style="--c:#4C8DFF"><div class="tel"><img src="img/app/app-03-estudiante-tablero.png" alt=""></div><b>Estudiante</b><span>ve y marca</span></div>
            <div class="rol" data-p="1" style="--c:#22C9A6"><div class="tel"><img src="img/app/app-07-monitor-nueva-tarea.png" alt=""></div><b>Monitor</b><span>publica</span></div>
            <div class="rol ancho" data-p="2" style="--c:#B07CFF"><div class="pc"><img src="img/app/app-08-admin-panel.png" alt=""></div><b>Administrador</b><span>controla</span></div>
          </div>
        </div>`,
      guion: [
        '"Cada usuario ve solo lo que necesita."',
        '"El estudiante ve las tareas de su grupo, filtra por materia y marca pendiente, en proceso o completada. Gana puntos y sube de rango."',
        '[→] "El monitor de tareas, o quien el grupo elija, publica las tareas con materia, fecha, prioridad e imágenes; también avisos y el horario."',
        '[→] "El administrador maneja usuarios, materias, grupos, el acceso y el sistema: 5 pestañas."',
      ],
      repaso: {
        que: 'Roles: student (0), moderator = monitor de tareas (1) y admin (2). El rol va dentro del JWT.',
        como: 'El middleware redirige según el rol (un estudiante en /admin vuelve a /dashboard). Las funciones responden a los requisitos: publicar por grupo, saber qué falta, comunicar (avisos, horario, push) y controlar (panel admin).',
      },
      analogia: 'Como el salón real: cada estudiante tiene su cuaderno, el monitor de tareas escribe en el tablero del salón y el administrador tiene las llaves de todo.',
      codigo: [
        ['Panel admin: 5 pestañas', 'app/(app)/admin/page.tsx', 352],
        ['Pantalla del monitor (moderator)', 'app/(app)/moderator/page.tsx', 1],
        ['Puntos (+3 / +10)', 'lib/points.ts', 21],
        ['Los 6 rangos', 'lib/ranks.ts', 25],
      ],
      preguntas: [
        { p: '¿Un monitor puede borrar tareas de otro grupo?', r: 'No. deleteTask compara el grupo de la tarea con el del monitor; updateTask usa WHERE id = ? AND group_id = ?. Solo el admin puede todo. (lib/services/tasks.ts:136)' },
        { p: '¿Para qué los puntos y rangos?', r: 'Para motivar: +10 al completar, +3 en proceso, +2 al entrar cada día; el monitor gana +5 por tarea publicada. Los puntos definen 6 rangos.' },
      ],
    },
    {
      titulo: 'Se instala y avisa', quien: 1, seg: 50, pasos: 2, sena: [2, 7],
      publico: () => `
        <div class="s pwa">
          <div class="col-izq">
            <h1 class="t1 a">Se instala.<br>Y avisa.</h1>
            <p class="t3 item" data-p="0"><i class="ph-bold ph-download-simple"></i>Se instala como app <code>manifest.json</code></p>
            <p class="t3 item" data-p="1"><i class="ph-bold ph-bell-ringing"></i>Avisa con la app cerrada <code>sw.js</code></p>
            <p class="t3 item" data-p="2"><i class="ph-bold ph-devices"></i>Celular · tablet · PC</p>
          </div>
          <div class="bloqueo a" style="--d:.3s">
            <div class="hora">7:30</div><div class="fecha">lunes</div>
            <div class="noti" data-p="1"><img src="img/logo.png" alt=""><div><b>ClassHub · Nueva tarea</b><span>Matemáticas: Taller de ecuaciones</span></div></div>
          </div>
        </div>`,
      guion: [
        '"ClassHub es una PWA: una página web que se instala en el celular con ícono y pantalla completa, sin tienda de apps. Eso lo define manifest.json."',
        '[→] "Cuando el monitor publica una tarea, al grupo le llega una notificación aunque la app esté cerrada. La recibe un service worker, sw.js, que queda despierto en segundo plano."',
        '[→] "Y se adapta a cualquier pantalla: celular, tablet o computador."',
        'OJO: no decir que "recuerda" las entregas solo; los recordatorios automáticos no están activos.',
        'PASE: "Todo eso se guarda en algún lado. Juan Diego les explica los datos y la inteligencia artificial."',
      ],
      repaso: {
        que: 'PWA (Progressive Web App): web instalable. Service worker: script que el navegador mantiene en segundo plano. Web Push: notificaciones del servidor al celular, firmadas con claves VAPID.',
        como: 'El celular se suscribe (lib/push-client.ts → /api/push/subscribe → tabla push_subscriptions). Al crear una tarea, notifyNewTask envía con web-push (lib/push-server.ts) y public/sw.js la muestra.',
      },
      analogia: 'El service worker es como un portero de noche en el celular: la app puede estar cerrada, pero él sigue despierto para recibir el aviso y tocar el timbre.',
      codigo: [
        ['Instalable: "standalone"', 'public/manifest.json', 6],
        ['sw.js recibe el push', 'public/sw.js', 12],
        ['Envía la notificación', 'lib/push-server.ts', 118],
        ['Avisar tarea nueva', 'lib/push-server.ts', 136],
      ],
      preguntas: [
        { p: '¿Les recuerda a los estudiantes cuando se vence una tarea?', r: 'Hoy avisa cuando se publica una tarea nueva. El código de recordatorios existe pero no tiene un programador (cron) activo: es una mejora pendiente. Con honestidad.' },
        { p: '¿Funciona en iPhone?', r: 'Sí como web. Las notificaciones push en iPhone requieren agregar ClassHub a la pantalla de inicio (iOS 16.4 o más).' },
        { p: '¿Y la accesibilidad?', r: 'La página declara el idioma (lang="es") y usa etiquetas aria en botones y ventanas (aria-label, aria-modal, aria-expanded). No hicimos una auditoría formal WCAG: es una mejora.' },
      ],
    },

    // ───────────────────────────── 3 · JUAN DIEGO ─────────────────────────────
    {
      titulo: 'Base de datos', quien: 2, seg: 65, pasos: 2, sena: [5, 11],
      publico: () => `
        <div class="s bd">
          <h1 class="t1 a">MySQL: datos conectados</h1>
          <div class="er">
            <svg viewBox="0 0 1500 600" class="er-lineas" aria-hidden="true">
              <path d="M270 145 L270 280" /><path d="M420 90 L1080 90" /><path d="M1230 145 L1230 280" />
              <path d="M420 125 L1080 300" /><path d="M300 390 L640 490" /><path d="M1200 390 L860 490" /><path d="M420 335 L1080 335" />
            </svg>
            <div class="tabla" style="left:120px;top:36px">groups</div>
            <div class="tabla" style="left:1080px;top:36px">subjects</div>
            <div class="tabla" style="left:120px;top:280px">users</div>
            <div class="tabla" style="left:1080px;top:280px">tasks</div>
            <div class="tabla puente" style="left:570px;top:490px">task_status</div>
            <div class="er-nota" data-p="1">une estudiante + tarea</div>
          </div>
          <div class="cifra a" style="--d:.4s"><b class="contar" data-n="17">0</b><span>tablas</span></div>
          <p class="t3 centro abajo" data-p="2"><code>WHERE group_id = ?</code> → sin inyección SQL</p>
        </div>`,
      guion: [
        '"Usamos MySQL, una base relacional: los datos están en tablas conectadas por llaves. Son 17 tablas."',
        '"Todo gira alrededor del grupo: un grupo tiene estudiantes, materias y tareas. Esas conexiones son llaves foráneas."',
        '[→] "La tabla clave es task_status: une a cada estudiante con cada tarea y guarda su estado. Así cada uno marca lo suyo."',
        '[→] "Y las consultas usan parámetros con signo de pregunta: el dato nunca se pega dentro del SQL, así no hay inyección."',
      ],
      repaso: {
        que: 'Base relacional: tablas con filas y columnas; la llave primaria (id, UUID) identifica cada fila y la llave foránea apunta a otra tabla. Hay 9 llaves foráneas reales.',
        como: 'groups 1–N users, groups 1–N subjects, groups 1–N tasks, subjects 1–N tasks; task_status es la tabla puente N–M entre users y tasks (llave única por estudiante y tarea). La estructura está en database/schema.sql y cambia con 8 migraciones versionadas.',
      },
      analogia: 'Como hojas de cálculo que se conectan por un número de identificación: la hoja de tareas no repite el nombre del grupo, solo guarda su id y apunta a la hoja de grupos.',
      codigo: [
        ['Tabla users', 'database/schema.sql', 29],
        ['Tabla tasks (con sus FK)', 'database/schema.sql', 56],
        ['Tabla puente task_status', 'database/schema.sql', 78],
        ['Consulta con JOIN y "?"', 'lib/services/tasks.ts', 52],
        ['Migraciones 001 a 008', 'database/migrations', 0],
      ],
      preguntas: [
        { p: '¿Por qué MySQL y no una base NoSQL?', r: 'Porque los datos son muy relacionados (usuarios, grupos, materias, tareas) y se consultan juntos con JOIN. Una base relacional garantiza esas relaciones con llaves foráneas.' },
        { p: '¿Qué es una llave foránea?', r: 'Una columna que apunta al id de otra tabla. Ej: tasks.group_id apunta a groups.id; si se borra el grupo, ON DELETE CASCADE borra sus tareas.' },
        { p: '¿Cómo protegen lo que está guardado?', r: 'La base está en Railway y solo se llega por la API con permisos; las claves viven en variables de entorno; respaldo diario a la 1 a. m.; tokens de recuperación guardados como hash. Deuda: los códigos están en texto plano.' },
      ],
    },
    {
      titulo: 'Asistente de IA', quien: 2, seg: 50, pasos: 2, sena: [2, 3],
      publico: () => `
        <div class="s ia">
          <h1 class="t1 a">Del dictado al formulario</h1>
          <div class="ia-fila">
            <div class="globo a" style="--d:.3s"><i class="ph-bold ph-student"></i><p class="escribe-txt">"Para el viernes, taller de ecuaciones, urgente, en hoja"</p></div>
            <div class="ia-centro" data-p="1"><i class="logo grande-logo" style="--i:url(img/logos/claude.svg);--c:#D97757"></i><span>Claude</span></div>
            <div class="formu" data-p="2">
              <div><small>Título</small><b>Taller de ecuaciones</b></div>
              <div><small>Prioridad</small><b class="rojo">Urgente</b></div>
              <div><small>Tipo</small><b>Taller</b></div>
              <div><small>Entrega</small><b>Viernes</b></div>
            </div>
          </div>
          <p class="t3 centro abajo" data-p="2">El monitor revisa y publica</p>
        </div>`,
      guion: [
        '"Llenar formularios es lento. Entonces el monitor escribe la tarea tal como el profe la dijo en clase."',
        '[→] "Ese texto va a nuestro servidor, que se lo manda a Claude, la IA de Anthropic, con instrucciones de devolver SOLO un JSON."',
        '[→] "Ese JSON llena el formulario: título, prioridad, tipo, fecha. El monitor revisa y publica. La IA ayuda, no decide."',
      ],
      repaso: {
        que: 'Se usa la API de Anthropic (modelo claude-haiku-4-5), que se paga por uso. La clave vive en una variable de entorno de Railway, nunca en el código.',
        como: 'AITaskAssistant.tsx envía el texto a POST /api/ai/assist. La ruta llama a Claude con un mensaje SYSTEM que exige un JSON con title, description, subject_name, priority, tag, delivery_method y due_date_hint; ese JSON llena CreateTaskModal.',
      },
      analogia: 'Un secretario que pasa en limpio el dictado a la planilla; el monitor revisa antes de publicar.',
      codigo: [
        ['Ruta de la IA (POST)', 'app/api/ai/assist/route.ts', 70],
        ['Instrucciones SYSTEM', 'app/api/ai/assist/route.ts', 25],
        ['Modelo usado', 'app/api/ai/assist/route.ts', 115],
        ['Botón del asistente', 'components/AITaskAssistant.tsx', 59],
      ],
      preguntas: [
        { p: '¿Y si la IA se equivoca?', r: 'Solo llena el formulario: el monitor lo ve, corrige y decide si publica. Nada se publica solo.' },
        { p: '¿Cuánto cuesta y dónde está la clave?', r: 'Se paga por uso y es muy poco por tarea (modelo Haiku, el más económico). La clave está en las variables de entorno de Railway: process.env.ANTHROPIC_API_KEY, nunca en el código.' },
      ],
    },
    {
      titulo: 'Imágenes', quien: 2, seg: 45, pasos: 2, sena: [6],
      publico: () => `
        <div class="s img">
          <h1 class="t1 a">La foto va a la nube</h1>
          <div class="img-fila">
            <div class="paso-img a" style="--d:.3s"><i class="ph-bold ph-image"></i><div class="checks">
              <span><i class="ph-fill ph-check-circle"></i>≤ 5 MB</span><span><i class="ph-fill ph-check-circle"></i>JPEG · PNG · WebP</span><span><i class="ph-fill ph-check-circle"></i>máx. 3</span></div></div>
            <i class="ph-bold ph-arrow-right flecha" data-p="1"></i>
            <div class="paso-img" data-p="1"><i class="logo grande-logo" style="--i:url(img/logos/cloudinary.svg);--c:#4C8DFF"></i><b>Cloudinary</b></div>
            <i class="ph-bold ph-arrow-right flecha" data-p="2"></i>
            <div class="paso-img" data-p="2"><i class="ph-bold ph-database"></i><code class="url">res.cloudinary.com/…</code></div>
          </div>
          <p class="t2 centro abajo" data-p="2">MySQL solo guarda <b>el link</b></p>
        </div>`,
      guion: [
        '"El monitor puede adjuntar fotos a una tarea (por ejemplo, la foto del tablero). Antes de aceptarlas, el servidor revisa: máximo 5 MB, máximo 3, y que de verdad sean imágenes."',
        '"Esto último lo hace mirando los primeros bytes reales del archivo (magic bytes): un archivo disfrazado de .jpg no pasa."',
        '[→] "La foto se sube a Cloudinary, un servicio en la nube especializado en imágenes."',
        '[→] "Cloudinary devuelve un link, y en MySQL solo guardamos ese link. La base queda liviana."',
        'PASE: "¿Y cómo llega todo esto a internet? Miguel Ángel les cuenta."',
      ],
      repaso: {
        que: 'Cloudinary: servicio en la nube que guarda imágenes y las entrega rápido (CDN). Magic bytes: la firma que tiene al inicio cada tipo de archivo.',
        como: 'POST /api/upload (app/api/upload/route.ts): valida tamaño, tipo, firma y un límite de 15 subidas por hora, sube con uploadToCloudinary (carpeta classhub/tasks) y devuelve la URL que se guarda en la tarea.',
      },
      analogia: 'Un guardarropa: dejas el abrigo (la foto) y te dan una ficha (el link). En la base solo guardamos la ficha, no el abrigo.',
      codigo: [
        ['Límite de 5 MB', 'app/api/upload/route.ts', 16],
        ['Firmas de archivo (magic bytes)', 'app/api/upload/route.ts', 20],
        ['Verificación de la firma', 'app/api/upload/route.ts', 146],
        ['Subida a Cloudinary', 'app/api/upload/route.ts', 37],
      ],
      preguntas: [
        { p: '¿Por qué no guardan las imágenes en MySQL?', r: 'Porque una base relacional no es para archivos pesados: la haría lenta y costosa de respaldar. Cloudinary las optimiza y las sirve rápido; la base solo guarda la URL.' },
      ],
    },

    // ───────────────────────────── 4 · MIGUEL ÁNGEL ─────────────────────────────
    {
      titulo: 'Docker', quien: 3, seg: 50, pasos: 2, sena: [3, 12],
      publico: () => `
        <div class="s docker">
          <h1 class="t1 a">La app, en una caja</h1>
          <div class="caja a" style="--d:.3s">
            <i class="logo" style="--i:url(img/logos/docker.svg);--c:#4C9BFF"></i>
            <div class="caja-dentro"><span>Node 20</span><span>Next.js</span><span>código</span></div>
          </div>
          <div class="etapas" data-p="1">
            <span><b>1</b>Instalar</span><i class="ph-bold ph-arrow-right"></i><span><b>2</b>Compilar</span><i class="ph-bold ph-arrow-right"></i><span><b>3</b>Ejecutar</span>
          </div>
          <p class="t2 centro" data-p="2">Igual en mi PC <b>y</b> en la nube</p>
        </div>`,
      guion: [
        '"Docker empaqueta la app con todo lo que necesita (Node 20, las librerías y el código) en un contenedor."',
        '[→] "El Dockerfile tiene 3 etapas: instalar dependencias, compilar y ejecutar. La última solo lleva lo necesario, con un usuario sin privilegios."',
        '[→] "Así funciona igual en cualquier computador y en Railway."',
        'Si preguntan por código adaptado: "Este Dockerfile lo adaptamos del ejemplo oficial de Next.js."',
      ],
      repaso: {
        que: 'Imagen = la receta empacada (lo que produce el Dockerfile). Contenedor = esa imagen corriendo. Docker Compose levanta varios contenedores juntos (app + MySQL).',
        como: 'FROM node:20-alpine en 3 etapas (deps, builder, runner). next.config.ts usa output "standalone" para que la etapa final solo copie lo necesario y arranque con node server.js.',
      },
      analogia: 'Un contenedor de barco: la misma caja sellada viaja en cualquier barco, tren o camión sin abrirla. Lo de adentro no cambia.',
      codigo: [
        ['Etapa 1: instalar', 'Dockerfile', 6],
        ['Etapa 2: compilar', 'Dockerfile', 12],
        ['Etapa 3: ejecutar', 'Dockerfile', 29],
        ['Variables de compilación (adaptación)', 'Dockerfile', 17],
        ['output: standalone', 'next.config.ts', 49],
      ],
      preguntas: [
        { p: '¿Qué diferencia hay entre imagen y contenedor?', r: 'La imagen es el paquete, la plantilla; el contenedor es esa imagen en ejecución. De una imagen salen muchos contenedores.' },
        { p: '¿Por qué un usuario "nextjs" en el Dockerfile?', r: 'Para no ejecutar la app como administrador (root): si alguien la vulnera, tiene menos permisos.' },
      ],
    },
    {
      titulo: 'Del PC a internet', quien: 3, seg: 50, pasos: 0, sena: [3, 9],
      publico: () => `
        <div class="s tubo">
          <h1 class="t1 a">De mi PC a internet</h1>
          <div class="tuberia">
            ${[['git', 'Commit'], ['github', 'Push'], ['githubactions', 'Pruebas'], ['railway', 'Railway'], ['', 'En línea']].map(([l, t], i) => `
              <div class="etapa a" style="--d:${0.3 + i * 0.35}s">
                ${l ? `<i class="logo" style="--i:url(img/logos/${l}.svg)"></i>` : '<i class="ph-bold ph-globe-hemisphere-west"></i>'}
                <span>${t}</span>
              </div>${i < 4 ? '<div class="tramo"><i></i></div>' : ''}`).join('')}
          </div>
          <p class="t2 centro a" style="--d:2.2s">Cada cambio a <code>main</code> se publica <b>solo</b></p>
          <p class="t3 centro url-app a" style="--d:2.5s">classhub-production.up.railway.app</p>
        </div>`,
      guion: [
        '"Así llega un cambio a internet. Se guarda con Git en un commit y se sube a GitHub."',
        '"GitHub Actions corre las pruebas automáticas. Si algo falla, el cambio no entra."',
        '"Cuando llega a la rama main, Railway construye la imagen con el Dockerfile y la publica en classhub-production.up.railway.app. La app y la base MySQL viven juntas en Railway y se hablan por red interna."',
        '"Empezamos en Netlify, pero perdió las variables de conexión y quedó caído; por eso migramos a Railway."',
      ],
      repaso: {
        que: 'Railway: plataforma en la nube (PaaS) que aloja la app y la base sin manejar servidores. Git guarda versiones; GitHub guarda el repositorio; GitHub Actions automatiza.',
        como: 'railway.toml dice que construya con el Dockerfile y arranque con node server.js. Las claves (DB_PASSWORD, JWT_SECRET, ANTHROPIC_API_KEY…) son variables de entorno en Railway. Cuesta entre 0 y 5 USD al mes.',
      },
      analogia: 'Arrendar un local con luz, agua y vigilancia incluidos en vez de construir el edificio: nosotros solo traemos la caja (el contenedor) y Railway la conecta.',
      codigo: [
        ['Configuración de Railway', 'railway.toml', 7],
        ['La CI en GitHub Actions', '.github/workflows/ci.yml', 41],
        ['Variables que necesita', '.env.example', 1],
      ],
      preguntas: [
        { p: '¿Por qué Railway y no Vercel o Netlify?', r: 'Netlify perdió las variables de conexión a la base y quedó caído. En Railway están la app y la base juntas, por red interna, y se publica sola desde GitHub.' },
        { p: '¿Dónde está la contraseña de la base?', r: 'No está en el código, a propósito: vive en las variables de Railway. El código solo lee process.env.DB_PASSWORD.' },
      ],
    },
    {
      titulo: 'Calidad', quien: 3, seg: 60, pasos: 2, sena: [8, 9, 11],
      publico: () => `
        <div class="s calidad">
          <h1 class="t1 a"><b class="contar" data-n="140">0</b> pruebas antes de publicar</h1>
          <div class="cuadros">${Array.from({ length: 140 }, (_, i) => `<i style="--d:${(0.4 + i * 0.012).toFixed(3)}s"></i>`).join('')}</div>
          <div class="chips centro">
            <span class="chip grande" data-p="1"><i class="ph-bold ph-bug"></i>Bug real → prueba → arreglado</span>
            <span class="chip grande" data-p="2"><i class="ph-bold ph-moon-stars"></i>Respaldo cada noche</span>
          </div>
        </div>`,
      guion: [
        '"Tenemos 140 pruebas automáticas con Vitest: sesión, permisos, validaciones, límites. En cada cambio, GitHub Actions corre revisión de estilo, tipos, las pruebas, la compilación y una auditoría de seguridad."',
        '[→] "Esto nos salvó: desde junio, los estudiantes y monitores no veían sus tareas. Una prueba reprodujo el error (el middleware respondía 403), lo arreglamos y la prueba pasó."',
        '[→] "Además, cada noche se saca un respaldo de la base con mysqldump."',
        'PASE: "Jerónimo, ¿cerramos?"',
      ],
      repaso: {
        que: 'Prueba automática: código que revisa que otro código haga lo que debe. CI (integración continua): correr todas las revisiones solas en cada cambio.',
        como: 'Vitest en __tests__/ con la base simulada. ci.yml: lint → tsc → npm test → build → npm audit. db-backup.yml: mysqldump a la 1:00 a. m. (cron 0 6 * * * UTC), guardado 30 días.',
      },
      analogia: 'El control de calidad de una fábrica: cada producto pasa por la banda de revisión antes de salir; si una revisión falla, no sale.',
      codigo: [
        ['Pruebas del middleware', '__tests__/middleware.test.ts', 1],
        ['Pasos de la CI', '.github/workflows/ci.yml', 41],
        ['Respaldo diario', '.github/workflows/db-backup.yml', 11],
        ['Arreglo del bug de junio (portero)', 'middleware.ts', 82],
      ],
      preguntas: [
        { p: '¿Por qué no hay pruebas de punta a punta (E2E)?', r: 'No alcanzamos: es lo siguiente. Las 140 son unitarias y de rutas. El recorrido completo de los 3 roles se probó a mano contra una copia real de la base antes de la exposición.' },
        { p: '¿Cómo se enteran si algo falla en producción?', r: 'Registros de Railway con un id por petición (x-request-id) y /api/health. Sentry está programado pero sin clave, hoy no está activo.' },
      ],
    },

    // ───────────────────────────── CIERRE ─────────────────────────────
    {
      titulo: 'Pruébalo', quien: 0, seg: 40, pasos: 1, sena: [10],
      publico: () => `
        <div class="s pruebalo">
          <div class="qr-lado a" style="--d:.2s"><img src="img/qr-probar.png" alt="QR para probar ClassHub">
            <div class="cuenta"><span>Correo</span><b>estudiante@classhub.demo</b><span>Código</span><b>demo2026</b></div></div>
          <div class="manual a" style="--d:.5s">
            <p><i>1</i>Escanea el QR</p><p><i>2</i>Escribe el correo y el código</p><p><i>3</i>Marca una tarea: pendiente → completada</p>
          </div>
          <div class="numeros">
            ${[[17, 'tablas'], [37, 'rutas de API'], [140, 'pruebas'], [105, 'archivos'], [74, 'commits'], [3, 'roles']].map(([n, t], i) => `
              <div class="numero a" style="--d:${0.3 + i * 0.12}s"><b class="contar" data-n="${n}">0</b><span>${t}</span></div>`).join('')}
          </div>
          <div class="siguiente" data-p="1"><b>Lo que sigue</b><span>Recordatorios automáticos</span><span>Códigos con hash</span><span>Pruebas E2E</span></div>
        </div>`,
      guion: [
        '"Pueden probarlo ya: escaneen el QR y entren con el correo y el código que ven en pantalla. Es una cuenta de prueba para todos."',
        '"Dentro: vean sus tareas, filtren por materia y marquen una como completada."',
        '"En números: 17 tablas, 37 rutas de API, 140 pruebas, 105 archivos de código y 74 commits."',
        '[→] "Lo que sigue: activar los recordatorios automáticos, guardar los códigos con hash (bcrypt ya está en el código) y pruebas de punta a punta."',
      ],
      repaso: { que: 'Cifras verificadas el 2026-10-18 contra el repositorio y la base.', como: 'El QR abre el login de producción; la cuenta del estudiante de prueba está en el LEEME de ClassHub - Exposicion.' },
      analogia: '',
      codigo: [],
      preguntas: [],
    },
    {
      titulo: 'Gracias', quien: 0, seg: 25, pasos: 0, sena: [],
      publico: () => `
        <div class="s portada final">
          <img class="logo-ch pop" src="img/logo.png" alt="">
          <h1 class="mega a" style="--d:.25s">¿Preguntas?</h1>
          <div class="equipo-fila a" style="--d:.6s">${EXPO.equipo.map(p => `<span style="--c:${p.color}">${p.n}</span>`).join('')}</div>
          <p class="sub a" style="--d:.9s">Gracias</p>
        </div>`,
      guion: [
        '"Empezamos preguntando cómo hacer que nadie pierda una tarea. Hoy la respuesta está funcionando."',
        '"Next.js y TypeScript, MySQL, desplegada en Railway, con 140 pruebas y respaldo diario. Gracias. Respondemos sus preguntas."',
        'Durante preguntas: Jerónimo reparte. "Eso lo trabajó [nombre], que les explica."',
      ],
      repaso: { que: 'Abre el panel "Preguntas SENA" para tener las 13 respuestas a la mano.', como: 'Si piden ver código: abre el enlace del panel y Antigravity va directo a la línea.' },
      analogia: '',
      codigo: [],
      preguntas: [],
    },
  ],

  // Las preguntas oficiales de la profe, con respuesta puntual.
  sena: [
    { id: 1, p: '¿Qué problema o necesidad busca resolver el sistema y quiénes son sus usuarios?', quien: 0, dia: [2, 8],
      r: 'Las tareas se dictaban en clase y quedaban dispersas (cuaderno, WhatsApp); no había una fuente única ni se sabía qué estaba hecho. Usuarios: estudiantes (ven y marcan su avance), monitores de tareas elegidos en cada salón, rol moderator (publican tareas, avisos y horario) y administradores (gestionan usuarios, grupos y materias). Es un proyecto de los estudiantes: los profesores no son usuarios. Hoy: 49 cuentas reales y 90 grupos.' },
    { id: 2, p: '¿Cuáles son las principales funcionalidades y cómo responden a los requisitos?', quien: 1, dia: [8, 9, 11, 12],
      r: 'Publicar tareas por grupo → el monitor de tareas crea tareas con materia, fecha, prioridad e imágenes. Saber qué falta → tablero con filtros, calendario y estados (pendiente, en proceso, completada). Comunicar → avisos, horario y notificaciones push. Controlar → panel admin con 5 pestañas. Acceso seguro → login con correo institucional y roles. Extras: IA para crear tareas y puntos con rangos para motivar.', codigo: [['Tablero', 'app/(app)/dashboard/page.tsx', 8], ['Crear tarea', 'lib/services/tasks.ts', 85]] },
    { id: 3, p: '¿Qué tecnologías, lenguajes y herramientas usaron y por qué?', quien: 0, dia: [4, 7, 10, 13, 14],
      r: 'TypeScript en todo (un solo lenguaje; los tipos atrapan errores antes). Next.js + React (frontend y backend en un solo proyecto). MySQL (datos muy relacionados). Tailwind (diseño adaptable rápido). Zod (validar), jose (JWT), Cloudinary (imágenes), Claude (IA), Vitest (pruebas), GitHub Actions (CI y respaldo), Docker + Railway (publicar con app y base juntas, 0–5 USD al mes).', codigo: [['package.json', 'package.json', 1]] },
    { id: 4, p: '¿Cómo está organizada la arquitectura del sistema?', quien: 0, dia: [4, 5],
      r: 'Cliente-servidor en 3 capas: frontend (React en el navegador: app/(app), components/), backend (API REST de Next.js en Node.js: app/api, lib/, middleware.ts) y base de datos (MySQL: database/, lib/db.ts). Se hablan con fetch y JSON, y SQL con parámetros. Servicios externos: Cloudinary, Claude, Resend y Web Push. Todo en un contenedor Docker en Railway.', codigo: [['El portero', 'middleware.ts', 37], ['Conexión a MySQL', 'lib/db.ts', 12]] },
    { id: 5, p: '¿Cómo diseñaron la base de datos y qué relación hay entre sus tablas?', quien: 2, dia: [10],
      r: 'MySQL 8, 17 tablas, diseñada alrededor del grupo: groups 1–N users, groups 1–N subjects, groups 1–N tasks y subjects 1–N tasks. task_status es la tabla puente N–M entre users y tasks: un estado por estudiante y tarea. Ids UUID, 9 llaves foráneas reales (con ON DELETE CASCADE o SET NULL) y 8 migraciones versionadas.', codigo: [['Tabla tasks', 'database/schema.sql', 56], ['Tabla task_status', 'database/schema.sql', 78]] },
    { id: 6, p: '¿Qué medidas implementaron para validar los datos y proteger la información?', quien: 0, dia: [6, 12],
      r: 'Zod valida toda entrada (si no cumple, 400). Consultas con parámetros "?" (sin inyección SQL). JWT firmado de 1 hora en cookie HttpOnly, renovación de 30 días con rotación. Dos capas de permisos (middleware y requireRole). 10 intentos fallidos → bloqueo de 15 min. Imágenes: tamaño, tipo y magic bytes. Encabezados de seguridad (CSP, HSTS, X-Frame-Options) y HTTPS. Registro solo con correo institucional.', codigo: [['Zod', 'lib/schemas.ts', 69], ['Encabezados de seguridad', 'next.config.ts', 13], ['Límite de intentos', 'lib/rate-limit.ts', 12]] },
    { id: 7, p: '¿Cómo tuvieron en cuenta la facilidad de uso, el diseño móvil y la accesibilidad?', quien: 1, dia: [7, 9],
      r: 'Mobile-first con Tailwind (se adapta con sm:, md:, lg:), PWA instalable, cada rol ve solo lo suyo, el estado se marca en un toque, colores por materia y la IA le ahorra escritura al monitor. Accesibilidad: idioma declarado (lang="es") y etiquetas aria en botones y ventanas. Honestos: no hicimos una auditoría formal WCAG; es una mejora.', codigo: [['lang="es"', 'app/layout.tsx', 34]] },
    { id: 8, p: '¿Qué pruebas realizaron y cómo solucionaron los errores?', quien: 3, dia: [15],
      r: '140 pruebas automáticas con Vitest (sesión, permisos, validaciones, límites, middleware), con la base simulada. La CI de GitHub Actions corre en cada cambio lint, tipos (tsc), pruebas, compilación y npm audit. Pruebas manuales de los 3 roles contra una copia de la base. Método: reproducir el error con una prueba, arreglarlo y verificar que pase (así se arregló el bug de junio, commit d7f9562).', codigo: [['Pruebas del middleware', '__tests__/middleware.test.ts', 1], ['La CI', '.github/workflows/ci.yml', 41]] },
    { id: 9, p: '¿Cuál fue la principal dificultad técnica y cómo la resolvieron?', quien: 0, dia: [14, 15],
      r: 'Que las tareas dejaron de verse: desde junio el middleware respondía 403 en /api/v1 a todo el que no fuera admin. Lo resolvimos reproduciéndolo con una prueba, corrigiendo la regla del middleware y publicando con la CI en verde. Otras: Netlify perdió las variables (→ migramos a Railway) y la hora de Colombia (parseDueAt corrige +5 horas).', codigo: [['Regla del portero', 'middleware.ts', 82], ['Hora de Colombia', 'lib/dates.ts', 25]] },
    { id: 10, p: 'Si continuaran el proyecto, ¿qué mejoras agregarían y por qué?', quien: 3, dia: [16],
      r: 'Recordatorios automáticos de entrega (el código existe; falta activar el programador). Guardar los códigos con hash (bcrypt ya está; falta la migración) para no tenerlos en texto plano. Pruebas de punta a punta. Calificaciones. Activar Sentry para monitorear errores. Ver tareas sin conexión con el service worker.' },
    { id: 11, p: '¿Cómo protegen la información almacenada?', quien: 2, dia: [10, 15],
      r: 'La base MySQL está en Railway y solo se accede por la API con permisos por rol y por grupo (WHERE group_id = ?). Las credenciales viven en variables de entorno, nunca en el código. Respaldo automático cada noche (mysqldump, guardado 30 días). Los tokens de recuperación se guardan como hash. Todo viaja por HTTPS. Deuda honesta: los códigos de estudiante están en texto plano; la migración a bcrypt es lo siguiente.', codigo: [['Respaldo diario', '.github/workflows/db-backup.yml', 11], ['Filtro por grupo', 'lib/services/tasks.ts', 67]] },
    { id: 12, p: '¿Pueden explicar una parte del código adaptada de otra fuente?', quien: 3, dia: [13],
      r: 'El Dockerfile: lo adaptamos del ejemplo oficial "with-docker" de Next.js (3 etapas, salida standalone, usuario sin privilegios nextjs y CMD node server.js). Nuestra adaptación: agregamos variables de entorno "placeholder" en la etapa de compilación (líneas 17–25), porque lib/env.ts exige DB_* y JWT_SECRET y sin ellas la compilación fallaba. Los valores reales los pone Railway al ejecutar. También usamos documentación oficial y asistentes de IA como apoyo: todo lo revisamos, probamos y entendemos.', codigo: [['Dockerfile: etapa de compilación', 'Dockerfile', 17], ['lib/env.ts exige JWT_SECRET', 'lib/env.ts', 32], ['Usuario sin privilegios', 'Dockerfile', 35]] },
    { id: 13, p: 'Si eliminamos algunas líneas de su código, ¿qué pasa?', quien: 0, dia: [],
      r: 'Primero leemos la nota de arriba del archivo (dice qué es y si es frontend o backend) y la línea. Casi todo lo detecta TypeScript al compilar o las pruebas en la CI, antes de llegar a producción. Las líneas críticas y su efecto están en la tabla de abajo.' },
  ],

  // "¿Y si borro esta línea?": líneas críticas y su efecto (verificado en la rama guia-exposicion).
  borrar: [
    ['app/(app)/dashboard/page.tsx', 8, "'use client'", 'Next.js la trata como pantalla de servidor; useState no se permite ahí → error al compilar.'],
    ['lib/auth.ts', 30, ".setExpirationTime('1h')", 'El token nunca vence: si lo roban, sirve para siempre. Compila igual: peligro silencioso.'],
    ['lib/auth.ts', 55, 'httpOnly: true', 'El JavaScript de la página podría leer la cookie de sesión (riesgo de robo por XSS).'],
    ['middleware.ts', 18, "'/login' (en PUBLIC)", 'El login exigiría sesión para entrar → redirección infinita; nadie puede iniciar sesión.'],
    ['middleware.ts', 82, '403 Sin permisos', 'El portero ya no bloquea /api/admin a quien no es admin, pero requireRole("admin") en cada ruta admin sigue protegiendo (segunda capa).'],
    ['app/api/tasks/route.ts', 38, "requireRole('moderator')", 'session queda sin definir → TypeScript falla al compilar. Si se cambiara por requireSession, un estudiante podría crear tareas.'],
    ['app/api/tasks/[id]/status/route.ts', 23, 'TaskStatusSchema.safeParse', 'parsed se usa después → error de compilación. Sin validación llegaría cualquier estado a la base.'],
    ['app/api/tasks/[id]/status/route.ts', 40, 'ON DUPLICATE KEY UPDATE', 'La segunda vez que un estudiante marca la misma tarea falla por llave duplicada (error 500).'],
    ['lib/services/tasks.ts', 67, 'WHERE t.group_id = ?', 'Si borran la línea entera: quedan 2 valores para 1 "?" y MySQL da error → el tablero no carga tareas. Si además quitan groupId de los parámetros: cada estudiante vería las tareas de TODOS los grupos.'],
    ['app/api/upload/route.ts', 138, 'file.size > MAX_SIZE_BYTES', 'Se aceptarían imágenes gigantes (más gasto en Cloudinary).'],
    ['app/api/upload/route.ts', 146, 'verifyMagicBytes', 'Se podría subir un archivo disfrazado con extensión de imagen.'],
    ['lib/db.ts', 19, 'connectionLimit: 10', 'mysql2 usa su valor por defecto, que también es 10: no cambia nada visible.'],
    ['next.config.ts', 49, "output: 'standalone'", 'No se genera .next/standalone y el Dockerfile falla → Railway no puede publicar.'],
    ['lib/rate-limit.ts', 12, 'WINDOW_MINUTES = 15', 'La variable se usa más abajo → error de compilación; con otro valor, cambia la ventana de bloqueo.'],
  ],
};
