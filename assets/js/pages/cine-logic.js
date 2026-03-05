// Lógica para renderizar la sección Cine de la Integridad

let allGuardianesData = [];
let currentCinePage = 1;
const itemsPerCinePage = 8;

async function initCine() {
    const container = document.getElementById('cine-container');
    if (!container) return;

    try {
        const response = await fetch('assets/php/obtenerGuardianes.php?v=' + Date.now());
        if (response.ok) {
            allGuardianesData = await response.json();
        } else {
            console.warn('Error al cargar guardianes desde DB, status:', response.status);
        }
    } catch (error) {
        console.warn('Error fetching guardianes:', error);
    }

    // Fallback si no hay datos de DB, intentar usar cineData global si existe
    if (allGuardianesData.length === 0 && typeof cineData !== 'undefined') {
        allGuardianesData = cineData;
    }

    if (allGuardianesData.length === 0) return;

    renderCineGallery();
}

function renderCineGallery() {
    const container = document.getElementById('cine-container');
    const pagination = document.getElementById('cine-pagination');
    if (!container) return;

    const totalPages = Math.ceil(allGuardianesData.length / itemsPerCinePage);
    
    // Validar página actual
    if (currentCinePage > totalPages) currentCinePage = totalPages;
    if (currentCinePage < 1) currentCinePage = 1;

    const startIndex = (currentCinePage - 1) * itemsPerCinePage;
    const endIndex = startIndex + itemsPerCinePage;
    const dataToUse = allGuardianesData.slice(startIndex, endIndex);

    // Lógica para ajustar columnas según la cantidad de elementos
    const count = dataToUse.length;
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

    const html = dataToUse.map(item => `
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
    
    renderCinePagination(totalPages, pagination);
}

function renderCinePagination(totalPages, container) {
    if (!container) return;
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button onclick="changeCinePage(${i})" 
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                ${i === currentCinePage 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-white text-slate-400 hover:bg-slate-100 border border-slate-200'}">
                ${i}
            </button>
        `;
    }
    container.innerHTML = html;
}

function changeCinePage(page) {
    currentCinePage = page;
    renderCineGallery();
    // Scroll suave hasta el contenedor de cine
    document.getElementById('cine').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initCine);