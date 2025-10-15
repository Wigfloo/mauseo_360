// ===== MÉTRICAS: SOLO VISITAS =====
const METRICS_KEY = 'museo360_metrics_v1';

function loadMetrics(){
  try { return JSON.parse(localStorage.getItem(METRICS_KEY)) || {}; }
  catch { return {}; }
}
function saveMetrics(m){ localStorage.setItem(METRICS_KEY, JSON.stringify(m)); }

// cuenta una visita cada carga del museo
(() => {
  const m = loadMetrics();
  m.site = m.site || { visits: 0, lastVisit: null };
  m.site.visits += 1;
  m.site.lastVisit = new Date().toISOString();
  saveMetrics(m);
})();



// MODIFICA tu abrirModal para registrar vistas
function abrirModal(objetoId) {
  const rutaFicha = (objetoId === 'intro')
    ? 'ficha/presentacion.html'
    : `ficha/objeto_${objetoId}.html`;

  const modal = document.getElementById('modal-3d');
  const fichaContent = document.getElementById('ficha-content');

  // métricas: vista de ficha
  const m = loadMetrics();
  const key = (objetoId === 'intro') ? 'intro' : `objeto_${objetoId}`;
  m.vistas = m.vistas || {};
  m.vistas[key] = (m.vistas[key] || 0) + 1;
  saveMetrics(m);
  startFichaTimer(key);

  modal.style.display = 'flex';
  fichaContent.innerHTML = 'Cargando...';

  fetch(rutaFicha)
    .then(r => { if (!r.ok) throw new Error('No se pudo cargar la ficha: ' + r.statusText); return r.text(); })
    .then(html => {
      fichaContent.innerHTML = html;
      if (objetoId === 'intro') initPresentacion?.(fichaContent);
    })
    .catch(err => {
      fichaContent.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
      console.error(err);
    });
}

function cerrarModal() {
  const modal = document.getElementById('modal-3d');
  const fichaContent = document.getElementById('ficha-content');
  modal.style.display = 'none';
  fichaContent.innerHTML = '';
  stopFichaTimer(); // <-- suma el tiempo a métricas
  const m = loadMetrics();
  const key = (objetoId === 'intro') ? 'intro' : `objeto_${objetoId}`;
  m.vistas = m.vistas || {};
  m.vistas[key] = (m.vistas[key] || 0) + 1;
  saveMetrics(m);
  startFichaTimer(key);
}


    function cerrarModal() {
        const modal = document.getElementById('modal-3d');
        const fichaContent = document.getElementById('ficha-content');

        // Ocultar el modal
        modal.style.display = 'none';
        document.body.style.overflow = '';
        // Limpiar el contenido al cerrar para evitar problemas de memoria y modelos activos
        fichaContent.innerHTML = ''; 
        stopFichaTimer();
    }
    

//para borrar el cuadro blanco de h5p
document.addEventListener("DOMContentLoaded", () => {
  // Este observer se encarga de vigilar si H5P mete sus cuadros blancos
  const observer = new MutationObserver(() => {
    const popups = document.querySelectorAll(".h5p-text-dialog, .h5p-text-overlay, .h5p-dialog-wrapper");
    popups.forEach(p => {
      // Eliminamos el elemento completo del DOM
      p.remove();
      console.log("💣 Popup H5P eliminado:", p);
    });
  });

  // Observamos todo el body para detectar cualquier intento de popup nuevo
  observer.observe(document.body, { childList: true, subtree: true });
});


//Abrir modal y cargar ficha

function abrirModal(objetoId) {
  const rutaFicha = (objetoId === 'intro')
    ? 'ficha/presentacion.html'
    : `ficha/objeto_${objetoId}.html`;

  const modal = document.getElementById('modal-3d');
  const fichaContent = document.getElementById('ficha-content');

  modal.style.display = 'flex';
  fichaContent.innerHTML = 'Cargando...';

  //menu de fichas
  fetch(rutaFicha)
    .then(r => {
      if (!r.ok) throw new Error('No se pudo cargar la ficha: ' + r.statusText);
      return r.text();
    })
    .then(html => {
      fichaContent.innerHTML = html;

      // 👉 si es la presentación, engancha los eventos del submenú
      if (objetoId === 'intro') {
        initPresentacion(fichaContent);
      }
    })
    .catch(err => {
      fichaContent.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
      console.error(err);
    });
}


function cerrarModal() {
  const modal = document.getElementById('modal-3d');
  const fichaContent = document.getElementById('ficha-content');
  modal.style.display = 'none';
  fichaContent.innerHTML = '';
  pararGuia(); // 👉 corta audio/tts al cerrar
}
// ==== GUIA AUDITIVA (MP3 o TTS) ====
let guiaAudio = null;
let guiaTTSUtter = null;

function initGuiaAudioEnFicha(container){
  crearControlesGuia(container, () => iniciarGuia(container));
}
// Inicializa la ficha de presentación (submenú)
function initPresentacion(container){
  const intro = container.querySelector('#vista-intro');
  const menu  = container.querySelector('#vista-menu');
  const btnComenzar = container.querySelector('#btn-comenzar');
  const btnVolver   = container.querySelector('#btn-volver');

  if (!btnComenzar || !intro || !menu) return; // si no es la presentación, salimos

  btnComenzar.addEventListener('click', () => {
    intro.style.display = 'none';
    menu.classList.add('visible');
    menu.setAttribute('aria-hidden','false');
  });

  if (btnVolver){
    btnVolver.addEventListener('click', () => {
      menu.classList.remove('visible');
      menu.setAttribute('aria-hidden','true');
      intro.style.display = 'block';
    });
  }

  // Botones de las tarjetas: abrir fichas
  container.querySelectorAll('.card .go').forEach(b=>{
    b.addEventListener('click', () => {
      const id = parseInt(b.getAttribute('data-obj'), 10);
      if (!isNaN(id)) abrirModal(id);
    });
  });
}

