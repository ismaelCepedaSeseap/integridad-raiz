// Lógica para la página material.html
// Depende de material-data.js

// Elementos del DOM
let resourcesGrid;
let paginationContainer;
let emptyState;
let resourceCount;
let filtersContainer;
let searchInput;

// Estado
let currentState = 'todos';
let currentPage = 1;
const itemsPerPage = 6;
let searchQuery = '';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initDOM();
    renderFilters();
    renderResources();
    
    // Inicializar iconos
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

function initDOM() {
    resourcesGrid = document.getElementById('resources-grid');
    paginationContainer = document.getElementById('pagination');
    emptyState = document.getElementById('empty-state');
    resourceCount = document.getElementById('resource-count');
    filtersContainer = document.getElementById('filter-container');
    searchInput = document.getElementById('resource-search');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            currentPage = 1; // Resetear a página 1 al buscar
            renderResources();
        });
    }
}

// Renderizar filtros dinámicamente
function renderFilters() {
    if (!filtersContainer) return;
    
    filtersContainer.innerHTML = materialFiltersData.map(filter => `
        <button onclick="filterByState('${filter.id}')" 
                class="filter-pill px-6 py-2 rounded-full border-2 border-slate-200 text-slate-600 font-bold hover:border-green-500 transition-all ${filter.id === 'todos' ? 'active' : ''}" 
                id="filter-${filter.id}">
            ${filter.label}
        </button>
    `).join('');
}

// Lógica de filtrado
window.filterByState = function(stateId) {
    currentState = stateId;
    currentPage = 1;
    
    // Actualizar UI de botones
    document.querySelectorAll('.filter-pill').forEach(btn => {
        btn.classList.remove('active');
        if(btn.id === `filter-${stateId}`) {
           btn.classList.add('active'); 
        }
    });
    
    renderResources();
};

// Renderizar recursos con paginación
function renderResources() {
    if (!resourcesGrid) return;

    // Filtrar datos
    let filtered = materialData.filter(res => {
        const matchesState = currentState === 'todos' || res.state === currentState;
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            res.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesState && matchesSearch;
    });

    // Actualizar contador
    if (resourceCount) {
        resourceCount.innerText = `${filtered.length} Recursos`;
    }

    // Manejo de estado vacío
    if (filtered.length === 0) {
        resourcesGrid.innerHTML = '';
        renderEmptyState();
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    // Ocultar estado vacío si hay resultados
    if (emptyState) emptyState.classList.add('hidden');

    // Paginación
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    
    // Validar página actual
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = filtered.slice(start, end);

    // Renderizar Grid
    resourcesGrid.innerHTML = paginatedItems.map(res => `
        <div class="resource-card bg-white rounded-[2.5rem] p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-50 group animate-fade-in-up">
            <div class="flex justify-between items-start mb-6">
                <div class="w-14 h-14 ${res.color} rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 transition-transform">
                    <i data-lucide="${res.icon}" class="w-7 h-7"></i>
                </div>
                <span class="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">${res.state}</span>
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors">${res.title}</h3>
            <p class="text-slate-500 text-sm leading-relaxed mb-6 font-medium line-clamp-2">${res.description}</p>
            
            <div class="flex items-center gap-3 mb-8">
                <span class="file-badge bg-green-50 text-green-700">${res.type}</span>
                <span class="file-badge bg-blue-50 text-blue-700">${res.category}</span>
                <span class="text-[10px] font-bold text-slate-300 ml-auto uppercase">${res.size}</span>
            </div>

            <button onclick="handleDownload(this)" class="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-md active:scale-95 group">
                <i data-lucide="download" class="w-5 h-5 download-icon transition-transform"></i>
                Descargar Material
            </button>
        </div>
    `).join('');

    // Renderizar Controles de Paginación
    renderPaginationControls(totalPages);
    
    // Re-inicializar iconos para los nuevos elementos
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function renderEmptyState() {
    if (!emptyState) return;
    
    emptyState.classList.remove('hidden');
    
    let title = "No encontramos materiales";
    let msg = "Prueba con otra palabra clave o región.";

    // Mensaje específico si es por filtro de estado y no hay búsqueda
    if (searchQuery === '' && currentState !== 'todos') {
        title = "Próximamente";
        msg = `Estamos trabajando en nuevos materiales para <strong>${currentState}</strong>. ¡Vuelve pronto!`;
    }

    emptyState.innerHTML = `
        <div class="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <i data-lucide="${searchQuery === '' && currentState !== 'todos' ? 'clock' : 'file-question'}" class="text-slate-300 w-10 h-10"></i>
        </div>
        <h3 class="text-2xl font-black text-slate-800 italic mb-2">${title}</h3>
        <p class="text-slate-500 mt-2 max-w-md mx-auto">${msg}</p>
    `;
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function renderPaginationControls(totalPages) {
    if (!paginationContainer) return;

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    paginationContainer.innerHTML = `
        <div class="flex items-center justify-center gap-4 mt-12">
            <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} 
                    class="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <i data-lucide="chevron-left" class="w-5 h-5"></i>
            </button>
            
            <span class="text-sm font-bold text-slate-400">
                Página <span class="text-slate-900">${currentPage}</span> de ${totalPages}
            </span>
            
            <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} 
                    class="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <i data-lucide="chevron-right" class="w-5 h-5"></i>
            </button>
        </div>
    `;
}

window.changePage = function(newPage) {
    currentPage = newPage;
    renderResources();
    // Scroll suave al inicio del grid
    if (resourcesGrid) {
        resourcesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

window.handleDownload = function(btn) {
    // Simulación de descarga
    const originalContent = btn.innerHTML;
    
    btn.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Preparando...`;
    btn.disabled = true;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(() => {
        btn.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5"></i> ¡Listo!`;
        btn.classList.replace('bg-slate-900', 'bg-green-500');
        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.classList.replace('bg-green-500', 'bg-slate-900');
            btn.disabled = false;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 2000);
    }, 1500);
}
