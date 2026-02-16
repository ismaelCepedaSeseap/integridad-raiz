// Lógica para la página cine.html

// Estado de la aplicación
let currentFilter = 'todos';
let currentPage = 1;
const itemsPerPage = 6;

// Elementos del DOM (se inicializan al cargar)
let videoGallery;
let paginationContainer;
let videoCounter;
let emptyState;
let filtersContainer;

// Función de inicialización
async function initCinePage() {
    videoGallery = document.getElementById('video-gallery');
    paginationContainer = document.getElementById('pagination');
    videoCounter = document.getElementById('video-counter');
    emptyState = document.getElementById('empty-state');
    filtersContainer = document.getElementById('filters-container');

    await renderFilters(); // Esperar a que se rendericen los filtros
    setupModal();
    
    // Verificar parámetros URL
    const urlParams = new URLSearchParams(window.location.search);
    const estado = urlParams.get('estado');
    
    if (estado) {
        // Asegurarse de que el estado esté en minúsculas para coincidir con el ID del filtro
        filterVideos(estado.toLowerCase());
    } else {
        updateGallery();
    }
}

// Renderizar filtros dinámicamente
async function renderFilters() {
    if (!filtersContainer) return;

    try {
        const response = await fetch('assets/php/obtenerEstadosActivos.php');
        if (!response.ok) throw new Error('Error al obtener estados');
        const estados = await response.json();

        // Construir la lista de filtros incluyendo "Todos"
        const filters = [
            { id: 'todos', label: 'Todos' },
            ...estados.map(estado => ({
                id: estado.nombre.toLowerCase(), // Normalizar a minúsculas para coincidir con los datos
                label: estado.nombre
            }))
        ];

        filtersContainer.innerHTML = filters.map(filter => `
            <button onclick="filterVideos('${filter.id}')" 
                    class="filter-pill ${filter.id === 'todos' ? 'active' : ''}" 
                    id="filter-${filter.id}">
                ${filter.label}
            </button>
        `).join('');
    } catch (error) {
        console.error('Error cargando filtros:', error);
        // Fallback a datos estáticos si falla la API
        if (typeof filtersData !== 'undefined') {
             filtersContainer.innerHTML = filtersData.map(filter => `
                <button onclick="filterVideos('${filter.id}')" 
                        class="filter-pill ${filter.id === 'todos' ? 'active' : ''}" 
                        id="filter-${filter.id}">
                    ${filter.label}
                </button>
            `).join('');
        }
    }
}

// Lógica de filtrado
function filterVideos(state) {
    currentFilter = state;
    currentPage = 1; // Reiniciar a la primera página

    // Actualizar estado visual de los botones
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.classList.remove('active');
    });
    
    const activePill = document.getElementById('filter-' + state);
    if(activePill) activePill.classList.add('active');

    updateGallery();
}

// Actualizar galería y paginación
function updateGallery() {
    // 1. Filtrar videos
    const filteredVideos = videosPageData.filter(video => {
        return currentFilter === 'todos' || video.state.toLowerCase() === currentFilter.toLowerCase();
    });

    // 2. Manejar estado vacío
    if (filteredVideos.length === 0) {
        if(emptyState) emptyState.classList.remove('hidden');
        if(videoGallery) videoGallery.classList.add('hidden');
        if(paginationContainer) paginationContainer.classList.add('hidden');
        if(videoCounter) videoCounter.classList.add('hidden');
        return;
    } else {
        if(emptyState) emptyState.classList.add('hidden');
        if(videoGallery) videoGallery.classList.remove('hidden');
        if(paginationContainer) paginationContainer.classList.remove('hidden');
        if(videoCounter) videoCounter.classList.remove('hidden');
    }

    // 3. Calcular paginación
    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    
    // Validar página actual
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    // Actualizar contador
    const currentPageNum = document.getElementById('current-page-num');
    const totalPagesNum = document.getElementById('total-pages-num');
    if(currentPageNum) currentPageNum.textContent = currentPage;
    if(totalPagesNum) totalPagesNum.textContent = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const videosToRender = filteredVideos.slice(startIndex, endIndex);

    // 4. Renderizar contenido
    renderVideos(videosToRender);
    renderPagination(totalPages);
}

// Renderizar grid de videos
function renderVideos(videos) {
    if(!videoGallery) return;
    
    videoGallery.innerHTML = ''; 

    videos.forEach(video => {
        const tagHtml = video.hashtag 
            ? `<div class="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                   ${video.hashtag}
               </div>` 
            : '';

        const html = `
        <div class="video-container" data-state="${video.state}">
            <div class="video-showcase-card group" onclick="openVideoModal('${video.id}')">
                <div class="video-thumb-container">
                    <span class="state-badge ${video.badgeClass} text-white">${video.stateLabel}</span>
                    <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" alt="Miniatura">
                    <div class="video-overlay-play">
                        <div class="play-icon-circle">
                            <i data-lucide="play" class="w-8 h-8" fill="currentColor"></i>
                        </div>
                    </div>
                </div>
                <div class="p-6 flex-grow flex flex-col">
                    <h3 class="text-xl font-black text-slate-900 leading-tight mb-2">${video.title}</h3>
                    <p class="text-slate-500 text-sm italic flex-grow">${video.description}</p>
                    ${tagHtml}
                </div>
            </div>
        </div>`;
        
        videoGallery.insertAdjacentHTML('beforeend', html);
    });
    
    if(window.lucide) lucide.createIcons(); 
}

// Renderizar controles de paginación
function renderPagination(totalPages) {
    if(!paginationContainer) return;
    
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) {
        paginationContainer.classList.add('hidden');
        return;
    } else {
        paginationContainer.classList.remove('hidden');
    }

    // Botón Anterior
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '<i data-lucide="chevron-left" class="w-5 h-5"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1);
    paginationContainer.appendChild(prevBtn);

    // Números de página
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => changePage(i);
        paginationContainer.appendChild(pageBtn);
    }

    // Botón Siguiente
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = '<i data-lucide="chevron-right" class="w-5 h-5"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage(currentPage + 1);
    paginationContainer.appendChild(nextBtn);

    if(window.lucide) lucide.createIcons();
}

function changePage(newPage) {
    currentPage = newPage;
    updateGallery();
    // Scroll suave al inicio de la galería
    if(videoGallery) videoGallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- MODAL LOGIC ---
let modal;
let iframe;
let modalTitle;
let modalDesc;
let modalBadge;
let modalHashtag;

function setupModal() {
    modal = document.getElementById('video-modal');
    iframe = document.getElementById('modal-iframe');
    modalTitle = document.getElementById('modal-title');
    modalDesc = document.getElementById('modal-description');
    modalBadge = document.getElementById('modal-badge');
    modalHashtag = document.getElementById('modal-hashtag');
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeVideoModal();
        }
    });
}

// Exportar globalmente para onclick en HTML
window.openVideoModal = function(videoId) {
    if(iframe && modal) {
        const video = videosPageData.find(v => v.id === videoId);
        
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        
        if (video) {
            if (modalTitle) modalTitle.textContent = video.title;
            if (modalDesc) modalDesc.textContent = video.description;
            
            if (modalBadge) {
                modalBadge.className = `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${video.badgeClass || 'bg-slate-600'}`;
                modalBadge.textContent = video.stateLabel || 'Video';
                modalBadge.classList.remove('hidden');
            }
            
            if (modalHashtag) {
                if (video.hashtag) {
                    modalHashtag.textContent = video.hashtag;
                    modalHashtag.classList.remove('hidden');
                } else {
                    modalHashtag.classList.add('hidden');
                }
            }
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; 
    }
};

window.closeVideoModal = function() {
    if(modal && iframe) {
        modal.classList.add('hidden');
        setTimeout(() => {
            iframe.src = ''; 
        }, 300); 
        document.body.style.overflow = ''; 
    }
};

window.filterVideos = filterVideos;

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', initCinePage);
