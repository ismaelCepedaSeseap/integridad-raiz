// Lógica para renderizar la sección Cine de la Integridad

function initCine() {
    const container = document.getElementById('cine-container');
    if (!container) return;

    // Lógica para ajustar columnas según la cantidad de elementos
    const count = cineData.length;
    let gridClass = 'grid-cols-1 md:grid-cols-3'; // Por defecto 3 columnas

    if (count === 1) {
        gridClass = 'grid-cols-1 place-items-center'; // Centrado si es solo 1
    } else if (count === 2) {
        gridClass = 'grid-cols-1 md:grid-cols-2'; // 2 columnas
    } else if (count === 4) {
        gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'; // 4 columnas en pantallas grandes, 2 en medianas
    } else if (count >= 5) {
        gridClass = 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'; // Auto-ajuste para más elementos
    }

    // Aplicar clases al contenedor
    container.className = `grid ${gridClass} gap-12 lg:gap-24`;

    const html = cineData.map(item => `
        <div class="text-center">
            <div class="video-mobile-frame border-slate-700" style="height:80%;">
                <video controls poster="${item.posterSrc}">
                    <source src="${item.videoSrc}" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>
            <div onclick="window.location.href='${item.url}'" class="cursor-pointer video-label border-b-4 border-slate-400">
                <h3 class="text-2xl font-black ${item.titleColorClass || 'text-slate-900'} italic">${item.name}</h3>
                <p class="text-green-600 font-bold text-xs uppercase tracking-widest mt-1">${item.slogan}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initCine);