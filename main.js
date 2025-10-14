      function abrirModal(objetoId) {
        // Define la ruta del archivo HTML que tiene el <model-viewer>
        // Si tus ficha están en una carpeta 'ficha', ajusta aquí:
        const rutaFicha = `ficha/objeto_${objetoId}.html`; 

        const modal = document.getElementById('modal-3d');
        const fichaContent = document.getElementById('ficha-content');
        
        // 1. Mostrar el modal inmediatamente
        modal.style.display = 'flex'; 
        fichaContent.innerHTML = 'Cargando...'; // Muestra un mensaje de carga

        // 2. Usar 'fetch' para cargar el contenido de la ficha HTML
        fetch(rutaFicha)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar la ficha: ' + response.statusText);
                }
                return response.text();
            })
            .then(html => {
                // 3. Inyectar todo el HTML (incluyendo el <model-viewer>)
                fichaContent.innerHTML = html; 
            })
            .catch(error => {
                fichaContent.innerHTML = `<p style="color:red;">Error cargando el modelo: ${error.message}</p>`;
                console.error('Error:', error);
            });
    }

    function cerrarModal() {
        const modal = document.getElementById('modal-3d');
        const fichaContent = document.getElementById('ficha-content');

        // Ocultar el modal
        modal.style.display = 'none';
        document.body.style.overflow = '';
        // Limpiar el contenido al cerrar para evitar problemas de memoria y modelos activos
        fichaContent.innerHTML = ''; 
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

function abrirModal(objetoId) {
  let rutaFicha;

  if (objetoId === "intro" || objetoId === 0) {
    // Nueva ruta para la presentación
    rutaFicha = `ficha/presentacion.html`;
  } else {
    rutaFicha = `ficha/objeto_${objetoId}.html`;
  }

  const modal = document.getElementById("modal-3d");
  const fichaContent = document.getElementById("ficha-content");

  modal.style.display = "flex";
  fichaContent.innerHTML = "Cargando...";

  fetch(rutaFicha)
    .then(r => r.ok ? r.text() : Promise.reject(r.statusText))
    .then(html => fichaContent.innerHTML = html)
    .catch(err => fichaContent.innerHTML = `<p style="color:red;">Error: ${err}</p>`);
}

function abrirModal(objetoId) {
  const rutaFicha = (objetoId === 'intro')
    ? 'ficha/presentacion.html'
    : `ficha/objeto_${objetoId}.html`;

  const modal = document.getElementById('modal-3d');
  const fichaContent = document.getElementById('ficha-content');

  modal.style.display = 'flex';
  fichaContent.innerHTML = 'Cargando...';

  fetch(rutaFicha)
    .then(r => r.ok ? r.text() : Promise.reject(r.statusText))
    .then(html => fichaContent.innerHTML = html)
    .catch(err => fichaContent.innerHTML = `<p style="color:red;">Error: ${err}</p>`);
}
