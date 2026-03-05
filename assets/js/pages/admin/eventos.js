// Global state
let currentEvents = [];
let editingEventId = null;
let draftEvent = {};
let previewWindow = null;
let currentPage = 1;
let itemsPerPage = 10;
let activeStates = [];

const searchInput = document.getElementById('search-input');
const tableBody = document.getElementById('events-table-body');
const showingCount = document.getElementById('showing-count');
const totalCount = document.getElementById('total-count');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const itemsPerPageSelect = document.getElementById('items-per-page');
const paginationNumbers = document.getElementById('pagination-numbers');

document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    injectModalStyles();
    await loadActiveStates();
    loadEvents();
    setupEventListeners();
});

async function loadActiveStates() {
    try {
        const response = await fetch('../assets/php/obtenerEstados.php?v=' + Date.now());
        if (!response.ok) {
            return;
        }
        const data = await response.json();
        const states = Array.isArray(data) && data[0] && Array.isArray(data[0].states) ? data[0].states : [];
        activeStates = states
            .map(s => (s && typeof s.name === 'string' ? s.name.trim() : ''))
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b, 'es'));
    } catch (error) {
        console.error(error);
    }
}

function injectModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modal-form-label {
            display: block;
            font-weight: 700;
            font-size: 0.8rem;
            color: #334155; /* slate-700 */
            margin-bottom: 0.375rem;
            margin-top: 1rem;
            letter-spacing: 0.025em;
        }
        
        .modal-form-input, .modal-form-textarea {
            width: 100%;
            padding: 0.7rem 0.9rem;
            border-radius: 0.75rem;
            border: 1px solid #e2e8f0; /* slate-200 */
            background-color: #f8fafc; /* slate-50 */
            font-size: 0.9rem;
            color: #0f172a; /* slate-900 */
            transition: all 0.2s ease;
            outline: none;
            font-family: inherit;
        }

        .modal-form-input:hover, .modal-form-textarea:hover {
            border-color: #94a3b8;
            background-color: #ffffff;
        }

        .modal-form-input:focus, .modal-form-textarea:focus {
            border-color: #3b82f6; /* blue-500 */
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
            background-color: #ffffff;
        }

        .modal-form-textarea {
            min-height: 80px;
            resize: vertical;
            line-height: 1.5;
            white-space: pre-wrap;
            overflow-wrap: break-word;
            word-break: break-word;
        }

        .array-item-wrapper {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            display: flex;
            gap: 0.5rem;
            align-items: center;
            flex-wrap: wrap;
            transition: all 0.2s;
        }

        .array-item-wrapper:hover {
            background: #ffffff;
            border-color: #cbd5e1;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .btn-add-item {
            width: 100%;
            padding: 0.6rem;
            border: 2px dashed #cbd5e1;
            border-radius: 0.5rem;
            background: #f8fafc;
            color: #64748b;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .btn-add-item:hover {
            border-color: #22c55e;
            color: #16a34a;
            background: #f0fdf4;
        }

        .btn-delete-item {
            color: #ef4444;
            background: #fef2f2;
            padding: 0.4rem;
            border-radius: 0.375rem;
            border: 1px solid #fee2e2;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            width: 36px;
            flex-shrink: 0;
        }

        .btn-delete-item:hover {
            background: #fee2e2;
            border-color: #fecaca;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);
        }

        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 0.75rem;
            margin-bottom: 1rem;
        }

        .gallery-item-wrapper {
            position: relative;
            aspect-ratio: 1;
            border-radius: 0.5rem;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            background: #f1f5f9;
        }

        .gallery-delete-btn {
            position: absolute;
            top: 4px;
            right: 4px;
            background: rgba(255, 255, 255, 0.9);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ef4444;
            cursor: pointer;
            border: 1px solid rgba(0,0,0,0.05);
            transition: all 0.2s;
            z-index: 10;
        }

        .gallery-delete-btn:hover {
            background: #ffffff;
            transform: scale(1.1);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Tab Styles */
        .tabs-header {
            display: flex;
            border-bottom: 1px solid #e2e8f0;
            margin-bottom: 1.25rem;
            overflow-x: auto;
            scrollbar-width: none; /* Firefox */
            padding-bottom: 0.25rem;
        }
        
        .tabs-header::-webkit-scrollbar {
            display: none; /* Chrome/Safari */
        }

        .tab-btn {
            background: transparent;
            border: none;
            padding: 0.6rem 0.85rem;
            margin-right: 0.25rem;
            font-weight: 600;
            color: #64748b; /* slate-500 */
            border-bottom: 2px solid transparent;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.85rem;
            white-space: nowrap;
        }

        .tab-btn:hover {
            color: #334155; /* slate-700 */
            background-color: #f8fafc;
        }

        .tab-btn.active {
            color: #22c55e; /* green-500 */
            border-bottom-color: #22c55e;
            background-color: transparent;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .form-group {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 1rem;
            padding: 0.85rem 0.95rem;
            box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }

        .modal-form-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.8rem;
            font-weight: 700;
            color: #334155;
            margin-bottom: 0.5rem;
            letter-spacing: 0.02em;
        }

        .modal-form-label i,
        .modal-form-label svg {
            color: var(--admin-modal-icon-color, #3b82f6);
        }
        
        /* Image Upload Styles */
        .file-upload-wrapper {
            display: flex; 
            align-items: center; 
            gap: 10px; 
            padding: 10px; 
            border: 1px dashed #cbd5e1; 
            border-radius: 0.5rem; 
            cursor: pointer; 
            transition: all 0.2s; 
            background: #f8fafc;
        }

        .file-upload-wrapper:hover {
            background: #f1f5f9;
            border-color: #94a3b8;
        }

        .file-upload-icon-wrapper {
            background: var(--admin-modal-upload-icon-bg, #ffffff); 
            padding: 6px; 
            border-radius: 0.5rem; 
            border: 1px solid var(--admin-modal-upload-icon-border, #e2e8f0);
            color: var(--admin-modal-upload-icon-color, #64748b); 
            display: flex; 
            align-items: center; 
            justify-content: center;
        }

        .file-upload-text {
            margin: 0; 
            font-size: 0.8rem; 
            font-weight: 600; 
            color: #334155;
        }

        .file-upload-subtext {
            margin: 0; 
            font-size: 0.7rem; 
            color: #94a3b8;
        }

        .image-preview {
            margin-top: 8px;
            border-radius: 0.5rem;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 40px;
        }
        
        .image-preview img, .image-preview video {
            max-width: 100%;
            max-height: 120px;
            object-fit: contain;
            display: block;
        }

        /* Gallery Item Content */
        .gallery-item-wrapper img, .gallery-item-wrapper video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        /* List Item Input override */
        .array-item-wrapper .modal-form-textarea {
            flex: 1;
            min-height: 60px;
        }

        /* Object List Specifics */
        .object-list-wrapper {
            flex-wrap: nowrap;
        }
        
        .object-list-wrapper .modal-form-input {
            width: auto;
            flex: 1;
            min-width: 0;
        }

        /* Icon Sizing */
        .btn-delete-item svg, .btn-add-item svg, .gallery-delete-btn svg {
            width: 16px;
            height: 16px;
        }

        /* Mobile Adjustments */
        @media (max-width: 640px) {
            .modal-form-input, .modal-form-textarea {
                font-size: 16px; /* Prevent zoom on iOS */
            }
            
            .array-item-wrapper {
                flex-direction: column;
                align-items: stretch;
            }
            
            .btn-delete-item {
                width: 100%;
                height: 36px;
                margin-top: 0.25rem;
            }
        }
    `;
    document.head.appendChild(style);
}

function loadEvents() {
    if (typeof EVENTS !== 'undefined') {
        currentEvents = JSON.parse(JSON.stringify(EVENTS)); // Deep clone
        renderEventList();
    } else {
        console.error('EVENTS data not found');
        if (tableBody) tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500">Error: No se encontraron datos de eventos.</td></tr>';
    }
}

function getFilteredData() {
    const term = (searchInput?.value || '').toLowerCase();
    return currentEvents.filter(event => {
        const title = event.title ? event.title.replace(/<[^>]*>/g, '') : '';
        const location = event.location || '';
        const state = event.state || '';
        return (
            title.toLowerCase().includes(term) ||
            location.toLowerCase().includes(term) ||
            state.toLowerCase().includes(term)
        );
    });
}

function renderEventList() {
    const countLabel = document.getElementById('item-count');
    if (!tableBody) return;

    const filtered = getFilteredData();
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalItems === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-slate-500">No hay eventos disponibles</td></tr>';
        showingCount.textContent = '0-0';
        totalCount.textContent = '0';
        btnPrev.disabled = true;
        btnNext.disabled = true;
        if (paginationNumbers) paginationNumbers.innerHTML = '';
        if (countLabel) countLabel.textContent = '0 eventos';
        return;
    }

    if (currentPage > totalPages) currentPage = totalPages || 1;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const pageItems = filtered.slice(startIndex, endIndex);

    showingCount.textContent = `${totalItems > 0 ? startIndex + 1 : 0}-${endIndex}`;
    totalCount.textContent = totalItems;
    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage >= totalPages;
    if (countLabel) countLabel.textContent = `${totalItems} eventos`;

    renderPaginationNumbers(totalPages);

    tableBody.innerHTML = pageItems.map(event => {
        const plainTitle = event.title ? event.title.replace(/<[^>]*>/g, '') : 'Sin título';
        const badge = event.badge || 'Evento';
        const location = event.location || event.state || '-';
        const statusText = event.visible ? 'Activo' : 'Inactivo';
        const statusClass = event.visible ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600';
        return `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="py-4">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-16 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                            <img src="../${event.mainImage || 'assets/images/logo.png'}" class="h-full w-full object-cover" alt="Thumb" onerror="this.src='../assets/images/logo.png'">
                        </div>
                        <div class="min-w-0">
                            <p class="font-bold text-slate-800 truncate">${plainTitle}</p>
                            <p class="text-xs text-slate-500 truncate">${badge}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 text-slate-600">${event.date || '-'}</td>
                <td class="py-4 text-slate-600">${location}</td>
                <td class="py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="py-4">
                    <div class="flex items-center gap-2">
                        <button class="w-8 h-8 flex items-center justify-center rounded-lg ${event.visible ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-600 hover:text-white'} transition-all" data-action="visibility" data-id="${event.id}" title="${event.visible ? 'Evento destacado activo' : 'Marcar como evento destacado'}">
                            <i data-lucide="${event.visible ? 'eye' : 'eye-off'}" class="w-4 h-4"></i>
                        </button>
                        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all" data-action="edit" data-id="${event.id}" title="Editar">
                            <i data-lucide="edit-2" class="w-4 h-4"></i>
                        </button>
                        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all" data-action="delete" data-id="${event.id}" title="Eliminar">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tableBody.querySelectorAll('button[data-action="edit"]').forEach(btn => {
        btn.onclick = () => editEvent(btn.dataset.id);
    });
    tableBody.querySelectorAll('button[data-action="visibility"]').forEach(btn => {
        btn.onclick = () => toggleVisibility(btn.dataset.id);
    });
    tableBody.querySelectorAll('button[data-action="delete"]').forEach(btn => {
        btn.onclick = () => deleteEvent(btn.dataset.id);
    });

    lucide.createIcons();
}

function renderPaginationNumbers(totalPages) {
    if (!paginationNumbers) return;
    paginationNumbers.innerHTML = '';
    
    let pages = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 4) {
            pages = [1, 2, 3, 4, 5, '...', totalPages];
        } else if (currentPage >= totalPages - 3) {
            pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    }

    pages.forEach(p => {
        const btn = document.createElement('button');
        if (p === '...') {
            btn.className = 'pagination-btn';
            btn.textContent = '...';
            btn.disabled = true;
        } else {
            btn.className = `pagination-btn ${p === currentPage ? 'active' : ''}`;
            btn.textContent = p;
            btn.addEventListener('click', () => {
                currentPage = p;
                renderEventList();
            });
        }
        paginationNumbers.appendChild(btn);
    });
}

function editEvent(id) {
    const event = currentEvents.find(e => e.id === id);
    if (event) {
        editingEventId = id;
        draftEvent = JSON.parse(JSON.stringify(event)); // Deep clone
        openModal('Editar Evento');
    }
}

async function toggleVisibility(id) {
    const event = currentEvents.find(e => e.id === id);
    if (!event) return;
    currentEvents.forEach(e => {
        e.visible = (e.id === id);
    });
    await saveAllEvents();
    renderEventList();
}

async function deleteEvent(id) {
    if (!confirm('¿Seguro que deseas eliminar este evento?')) return;
    const index = currentEvents.findIndex(e => e.id === id);
    if (index === -1) return;
    currentEvents.splice(index, 1);
    await saveAllEvents();
    renderEventList();
}

function setupEventListeners() {
    const btnNew = document.getElementById('btn-new-item');
    if (btnNew) {
        btnNew.addEventListener('click', () => {
            editingEventId = null;
            draftEvent = createEmptyEvent();
            openModal('Nuevo Evento');
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderEventList();
        });
    }

    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', () => {
            itemsPerPage = parseInt(itemsPerPageSelect.value);
            currentPage = 1;
            renderEventList();
        });
    }

    if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderEventList();
            }
        });
        btnNext.addEventListener('click', () => {
            const filtered = getFilteredData();
            const totalPages = Math.ceil(filtered.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderEventList();
            }
        });
    }

    const btnClose = document.getElementById('btn-close-modal');
    if (btnClose) btnClose.addEventListener('click', closeModal);

    const btnCancel = document.getElementById('btn-modal-cancel');
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    
    const btnPreview = document.getElementById('btn-modal-preview');
    if (btnPreview) {
        btnPreview.addEventListener('click', () => {
            openPreview(draftEvent);
        });
    }

    const btnSave = document.getElementById('btn-modal-save');
    if (btnSave) btnSave.addEventListener('click', saveEvent);
}

function createEmptyEvent() {
    return {
        id: crypto.randomUUID(),
        title: '',
        description: '',
        date: '',
        location: '',
        mainImage: '',
        gallery: [],
        banners: [], // Initialize empty
        chronicle: {
            title: '',
            content: [], // Initialize empty
            footer: ''
        },
        results: [],
        visible: true
    };
}

// ==========================================
// MODAL & FORM LOGIC
// ==========================================

function openModal(title) {
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.textContent = title;
    
    const modal = document.getElementById('new-event-modal');
    if (modal) modal.classList.add('active');
    
    renderModalForm();
    
    // Update preview immediately if window is open
    setTimeout(() => {
        triggerPreviewUpdate();
    }, 100);
}

function closeModal() {
    const modal = document.getElementById('new-event-modal');
    if (modal) modal.classList.remove('active');
}

function getEventFields() {
    const stateOptions = activeStates.map(name => ({ value: name, label: name }));

    return [
        // General (Merged ID/Title here per request)
        { label: 'ID (No editable)', path: 'id', type: 'text', section: 'General', readOnly: true },
        { label: 'Título', path: 'title', type: 'text', section: 'General' },
        { label: 'Descripción Corta', path: 'description', type: 'textarea', section: 'General', maxLength: 500 },
        { label: 'Fecha', path: 'date', type: 'text', section: 'General' },
        { label: 'Estado', path: 'state', type: 'select', options: stateOptions, section: 'General' },
        { label: 'Ubicación', path: 'location', type: 'text', section: 'General', maxLength: 60 },
        { label: 'Slogan', path: 'slogan', type: 'text', section: 'General', maxLength: 120 },
        { label: 'Impacto (Texto)', path: 'impact', type: 'text', section: 'General' },
        { label: 'Conteo Pilares', path: 'pillars_count', type: 'text', section: 'General' },

        // Multimedia
        { label: 'Imagen Principal (Main)', path: 'mainImage', type: 'image', section: 'Multimedia' },
        { label: 'Imagen Secundaria', path: 'imageUrl', type: 'image', section: 'Multimedia' },
        { label: 'Video YouTube URL', path: 'videoUrl', type: 'text', section: 'Multimedia' },
        { label: 'Galería de Imágenes', path: 'gallery', type: 'gallery', section: 'Multimedia' },
        { label: 'Banners', path: 'banners', type: 'gallery', section: 'Multimedia' },

        // Crónica
        { label: 'Etiqueta Crónica', path: 'chronicle.label', type: 'text', section: 'Crónica' },
        { label: 'Título Crónica', path: 'chronicle.title', type: 'text', section: 'Crónica' },
        { label: 'Fecha Crónica', path: 'chronicle.date', type: 'text', section: 'Crónica' },
        { label: 'Lugar Crónica', path: 'chronicle.location', type: 'text', section: 'Crónica' },
        { label: 'Cita Destacada', path: 'chronicle.quote', type: 'textarea', section: 'Crónica' },
        { label: 'Autor Cita', path: 'chronicle.quoteAuthor', type: 'text', section: 'Crónica' },
        { label: 'Contenido (Párrafos)', path: 'chronicle.content', type: 'list', section: 'Crónica' },
        { label: 'Footer Crónica', path: 'chronicle.footer', type: 'textarea', section: 'Crónica' },

        // Alcance e Impacto
        { label: 'Resultados (Valor | Etiqueta)', path: 'results', type: 'object-list', section: 'Alcance e Impacto', maxLength: 50 }
    ];
}

function renderModalForm() {
    const formContainer = document.getElementById('new-event-form');
    const tabsContainer = document.getElementById('modal-tabs');
    
    if (!formContainer || !tabsContainer) return;
    
    formContainer.innerHTML = '';
    tabsContainer.innerHTML = '';

    const fields = getEventFields();
    const sections = [...new Set(fields.map(f => f.section))];
    
    // Create Tabs
    sections.forEach((section, index) => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${index === 0 ? 'active' : ''}`;
        btn.textContent = section;
        btn.onclick = () => switchTab(section);
        tabsContainer.appendChild(btn);
    });

    // Create Sections
    sections.forEach((section, index) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = `tab-content ${index === 0 ? 'active' : ''}`;
        sectionDiv.id = `tab-${section}`;
        
        const sectionFields = fields.filter(f => f.section === section);
        
        sectionFields.forEach(field => {
            sectionDiv.appendChild(renderField(field));
        });

        formContainer.appendChild(sectionDiv);
    });
    
    lucide.createIcons();
}

function switchTab(sectionName) {
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.toggle('active', b.textContent === sectionName);
    });
    document.querySelectorAll('.tab-content').forEach(c => {
        c.classList.toggle('active', c.id === `tab-${sectionName}`);
    });
}

function validateImage(file) {
    return new Promise((resolve, reject) => {
        const isImage = file.type.startsWith('image/');
        const isMp4 = file.type === 'video/mp4';

        if (!isImage && !isMp4) {
            return reject('Formato no permitido. Usa imágenes o video MP4');
        }

        if (isMp4) {
            if (file.size > 20 * 1024 * 1024) {
                return reject('El video MP4 no debe superar 20MB');
            }
            return resolve(true);
        }

        if (file.size > 300 * 1024) {
            return reject('El tamaño máximo es 300KB');
        }
        
        const img = new Image();
        img.onload = function() {
            if (this.width !== 1200 || this.height !== 800) {
                URL.revokeObjectURL(img.src);
                return reject('Las dimensiones deben ser 1200x800px');
            }
            URL.revokeObjectURL(img.src);
            resolve(true);
        };
        img.onerror = function() {
            URL.revokeObjectURL(img.src);
            reject('Error al cargar la imagen');
        };
        img.src = URL.createObjectURL(file);
    });
}

function getFieldIcon(field) {
    const key = (field.path || '').toLowerCase();
    if (field.type === 'image' || key.includes('image')) return 'image';
    if (key.includes('video')) return 'video';
    if (key.includes('date')) return 'calendar';
    if (key.includes('location')) return 'map-pin';
    if (key.includes('state')) return 'map';
    if (key.includes('badge')) return 'tag';
    if (key.includes('title')) return 'type';
    if (key.includes('description')) return 'align-left';
    if (key.includes('slogan')) return 'quote';
    if (key.includes('impact') || key.includes('results')) return 'bar-chart-3';
    if (key.includes('chronicle')) return 'book-open';
    return 'edit-3';
}

function renderField(field) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const label = document.createElement('label');
    label.className = 'modal-form-label';
    label.innerHTML = `<i data-lucide="${getFieldIcon(field)}" class="w-4 h-4"></i> ${field.label}`;
    group.appendChild(label);

    const value = getValueAtPath(draftEvent, field.path);

    if (field.type === 'text' || field.type === 'textarea') {
        const input = document.createElement(field.type === 'textarea' ? 'textarea' : 'input');
        input.className = field.type === 'textarea' ? 'modal-form-textarea' : 'modal-form-input'; // Updated class
        if (field.type === 'text') input.type = 'text';
        if (field.readOnly) {
            input.readOnly = true;
            input.classList.add('bg-slate-100', 'cursor-not-allowed');
        }
        if (field.maxLength) {
            input.maxLength = field.maxLength;
        }
        input.value = value || '';
        input.oninput = (e) => {
            setValueAtPath(draftEvent, field.path, e.target.value);
            if (field.maxLength) {
                const counter = group.querySelector('.char-counter');
                if (counter) counter.textContent = `${e.target.value.length}/${field.maxLength}`;
            }
            triggerPreviewUpdate();
        };
        group.appendChild(input);

        if (field.maxLength) {
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.fontSize = '0.75rem';
            counter.style.color = '#64748b';
            counter.style.textAlign = 'right';
            counter.style.marginTop = '0.25rem';
            counter.textContent = `${(value || '').length}/${field.maxLength}`;
            group.appendChild(counter);
        }
    }  
    else if (field.type === 'select') {
        const select = document.createElement('select');
        select.className = 'modal-form-input';

        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = 'Selecciona un estado activo';
        select.appendChild(placeholderOption);

        const options = Array.isArray(field.options) ? field.options : [];
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            select.appendChild(option);
        });

        if (value && !options.some(opt => opt.value === value)) {
            const currentOption = document.createElement('option');
            currentOption.value = value;
            currentOption.textContent = value;
            select.appendChild(currentOption);
        }

        select.value = value || '';
        select.onchange = (e) => {
            setValueAtPath(draftEvent, field.path, e.target.value);
            triggerPreviewUpdate();
        };
        group.appendChild(select);
    }
    else if (field.type === 'image') {
        const wrapper = document.createElement('div');
        wrapper.className = 'file-upload-wrapper';
        
        wrapper.innerHTML = `
            <div class="file-upload-icon-wrapper">
                <i data-lucide="image" style="width: 20px; height: 20px;"></i>
            </div>
            <div style="flex: 1;">
                <p class="file-upload-text">Seleccionar imagen</p>
                <p class="file-upload-subtext">Click para examinar</p>
            </div>
            <input type="file" style="display:none" accept="image/*,video/mp4">
        `;
        
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        
        if (value) {
            // Check if it is a video
            if (value.endsWith('.mp4')) {
                preview.innerHTML = `<video src="../${value}" controls></video>`;
            } else {
                preview.innerHTML = `<img src="../${value}">`;
            }
        }

        wrapper.onclick = () => wrapper.querySelector('input').click();
        
        const fileInput = wrapper.querySelector('input');
        fileInput.onchange = async (e) => {
            if (e.target.files[0]) {
                const file = e.target.files[0];
                
                try {
                    await validateImage(file);
                } catch (error) {
                    alert(error);
                    fileInput.value = ''; // Reset input
                    return;
                }

                const formData = new FormData();
                formData.append('image', file);
                const eventTitle = (draftEvent.title || '').replace(/<[^>]*>/g, '').trim() || draftEvent.id || 'evento';
                const eventState = (draftEvent.state || '').trim();
                formData.append('state', eventState);
                formData.append('entity_name', eventTitle);
                formData.append('section', 'eventos');

                try {
                    const originalContent = wrapper.innerHTML;
                    wrapper.innerHTML = `
                        <div class="animate-spin" style="margin: 0 auto; width: 20px; height: 20px; border: 2px solid #16a34a; border-top-color: transparent; border-radius: 50%;"></div>
                        <p style="margin-left: 10px; font-size: 0.85rem; color: #64748b;">Subiendo...</p>
                    `;
                    
                    const response = await fetch('../api/upload_image.php', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        setValueAtPath(draftEvent, field.path, result.path);
                        
                        // Reset wrapper
                        wrapper.innerHTML = `
                            <div class="file-upload-icon-wrapper">
                                <i data-lucide="image" style="width: 20px; height: 20px;"></i>
                            </div>
                            <div style="flex: 1;">
                                <p class="file-upload-text">Imagen actualizada</p>
                                <p class="file-upload-subtext">Click para cambiar</p>
                            </div>
                            <input type="file" style="display:none" accept="image/*,video/mp4">
                        `;
                        lucide.createIcons();
                        
                        // Show preview
                        if (result.path.endsWith('.mp4')) {
                            preview.innerHTML = `<video src="../${result.path}" controls></video>`;
                        } else {
                            preview.innerHTML = `<img src="../${result.path}">`;
                        }
                        
                        triggerPreviewUpdate();
                    } else {
                        alert('Error al subir: ' + result.error);
                        wrapper.innerHTML = originalContent;
                        lucide.createIcons();
                    }
                } catch (err) {
                    console.error(err);
                    alert('Error de red');
                    wrapper.innerHTML = originalContent;
                    lucide.createIcons();
                }
            }
        };
        
        group.appendChild(wrapper);
        group.appendChild(preview);
    }
    else if (field.type === 'list') {
        const listContainer = document.createElement('div');
        listContainer.className = 'array-list';
        
        const renderList = () => {
            listContainer.innerHTML = '';
            const currentList = getValueAtPath(draftEvent, field.path) || [];
            
            currentList.forEach((item, idx) => {
                const itemRow = document.createElement('div');
                itemRow.className = 'array-item-wrapper'; // Updated class
                
                const input = document.createElement('textarea');
                input.className = 'modal-form-textarea'; // Updated class
                input.rows = 2;
                input.value = item;
                input.oninput = (e) => {
                    currentList[idx] = e.target.value;
                    setValueAtPath(draftEvent, field.path, currentList);
                    triggerPreviewUpdate();
                };

                const delBtn = document.createElement('button');
                delBtn.className = 'btn-delete-item'; // Updated class
                delBtn.innerHTML = '<i data-lucide="trash-2"></i>';
                delBtn.onclick = () => {
                    currentList.splice(idx, 1);
                    setValueAtPath(draftEvent, field.path, currentList);
                    renderList();
                    triggerPreviewUpdate();
                };

                if (field.path === 'chronicle.content') {
                    const magicBtn = document.createElement('button');
                    magicBtn.className = 'btn-delete-item'; // Reuse same style
                    magicBtn.style.color = '#3b82f6';
                    magicBtn.style.backgroundColor = '#eff6ff';
                    magicBtn.style.borderColor = '#dbeafe';
                    magicBtn.innerHTML = '<i data-lucide="wand-2"></i>';
                    magicBtn.title = 'Dar formato inteligente';
                    magicBtn.onclick = () => {
                        const currentVal = currentList[idx];
                        
                        // Define Smart Styles Library (Chronicle Edition)
                        const styles = [
                            {
                                id: 'plain',
                                name: 'Texto Simple',
                                pattern: /^[^<]/, // Simple text
                                apply: (text) => text
                            },
                            {
                                id: 'lead',
                                name: 'Intro Editorial',
                                pattern: /text-lg/,
                                apply: (text) => `<div class="mb-6 break-words"><p class="text-lg text-slate-700 leading-relaxed font-serif first-letter:text-3xl first-letter:font-bold first-letter:mr-1 first-letter:float-left">${text}</p></div>`
                            },
                            {
                                id: 'quote-classic',
                                name: 'Cita Clásica',
                                pattern: /border-l-4 border-slate-800/,
                                apply: (text) => `<div class="border-l-4 border-slate-800 pl-6 py-2 my-6 ml-4 break-words"><p class="font-serif text-xl italic text-slate-800 leading-relaxed">"${text}"</p></div>`
                            },
                            {
                                id: 'fact-box',
                                name: 'Caja de Datos',
                                pattern: /bg-stone-50/,
                                apply: (text) => `<div class="bg-stone-50 p-6 border-t-2 border-b-2 border-stone-200 my-6 break-words"><h5 class="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Dato Clave</h5><p class="text-stone-800 font-medium">${text}</p></div>`
                            },
                            {
                                id: 'highlight-minimal',
                                name: 'Resaltado Simple',
                                pattern: /bg-slate-50/,
                                apply: (text) => `<div class="bg-slate-50 p-5 rounded-lg border border-slate-200 my-4 break-words"><p class="text-slate-700 leading-relaxed">${text}</p></div>`
                            },
                            {
                                id: 'typewriter',
                                name: 'Mecanografiado',
                                pattern: /font-mono/,
                                apply: (text) => `<div class="bg-white p-6 border border-slate-300 shadow-sm my-6 max-w-2xl mx-auto break-words"><p class="font-mono text-sm text-slate-600 leading-loose">${text}</p></div>`
                            },
                            {
                                id: 'editorial-note',
                                name: 'Nota al Pie',
                                pattern: /text-xs/,
                                apply: (text) => `<div class="my-4 px-10 break-words"><p class="text-xs text-slate-500 text-center italic border-t border-slate-200 pt-4">${text}</p></div>`
                            },
                            {
                                id: 'impact-text',
                                name: 'Texto de Impacto',
                                pattern: /text-2xl/,
                                apply: (text) => `<div class="my-8 text-center break-words"><p class="text-2xl font-bold text-slate-800 tracking-tight">${text}</p><div class="w-16 h-1 bg-green-500 mx-auto mt-3"></div></div>`
                            },
                            {
                                id: 'paper-card',
                                name: 'Tarjeta Papel',
                                pattern: /shadow-md/,
                                apply: (text) => `<div class="bg-white p-6 shadow-md rounded-sm border border-slate-100 my-6 relative break-words"><div class="absolute top-0 left-0 w-1 h-full bg-slate-200"></div><p class="text-slate-700 pl-4">${text}</p></div>`
                            },
                            {
                                id: 'success-highlight',
                                name: 'Éxito/Logro',
                                pattern: /bg-green-50/,
                                apply: (text) => `<div class="bg-green-50 p-4 rounded-r-xl border-l-4 border-green-500 my-4 break-words"><p class="text-green-900 font-medium flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 flex-shrink-0"></i> <span>${text}</span></p></div>`
                            }
                        ];

                        // Create temp element to extract text safely
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = currentVal;
                        // Handle simple text vs html
                        let cleanText = currentVal.includes('<') ? tempDiv.textContent.trim() : currentVal;
                        
                        // Find current style index
                        let currentIndex = -1;
                        for (let i = 0; i < styles.length; i++) {
                            if (styles[i].pattern.test(currentVal)) {
                                currentIndex = i;
                                break;
                            }
                        }
                        
                        // Calculate next style index
                        // If current is plain (or unknown), go to first style (index 1)
                        // If current is last style, go back to plain (index 0)
                        let nextIndex = (currentIndex + 1) % styles.length;
                        
                        // If current was unknown (index -1), start at 1 (first styled option)
                        if (currentIndex === -1) nextIndex = 1;

                        const nextStyle = styles[nextIndex];
                        const newVal = nextStyle.apply(cleanText);
                        
                        currentList[idx] = newVal;
                        setValueAtPath(draftEvent, field.path, currentList);
                        renderList(); // Re-render to update textarea
                        triggerPreviewUpdate();
                        
                        // Show toast/tooltip feedback (optional but nice)
                        // console.log(`Applied style: ${nextStyle.name}`);
                    };
                    
                    // Insert before delete button
                    itemRow.appendChild(input);
                    itemRow.appendChild(magicBtn);
                    itemRow.appendChild(delBtn);
                } else {
                    itemRow.appendChild(input);
                    itemRow.appendChild(delBtn);
                }

                listContainer.appendChild(itemRow);
            });

            const addBtn = document.createElement('button');
            addBtn.className = 'btn-add-item'; // Updated class
            addBtn.innerHTML = '<i data-lucide="plus"></i> Agregar Elemento';
            addBtn.onclick = () => {
                const list = getValueAtPath(draftEvent, field.path) || [];
                list.push('');
                setValueAtPath(draftEvent, field.path, list);
                renderList();
            };
            listContainer.appendChild(addBtn);
            lucide.createIcons();
        };

        renderList();
        group.appendChild(listContainer);
    }
    else if (field.type === 'gallery') {
        const galleryContainer = document.createElement('div');
        
        const renderGallery = () => {
            galleryContainer.innerHTML = '';
            const images = getValueAtPath(draftEvent, field.path) || [];
            
            const grid = document.createElement('div');
            grid.className = 'gallery-grid'; // Updated class

            images.forEach((img, idx) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'gallery-item-wrapper'; // Updated class
                
                const isVideo = img.endsWith('.mp4');
                const content = isVideo 
                    ? `<video src="../${img}"></video>`
                    : `<img src="../${img}">`;

                imgContainer.innerHTML = `
                    ${content}
                    <button class="gallery-delete-btn" data-idx="${idx}">
                        <i data-lucide="trash-2"></i>
                    </button>
                `;
                
                // Add delete listener
                const btn = imgContainer.querySelector('button');
                btn.onclick = () => {
                    images.splice(idx, 1);
                    setValueAtPath(draftEvent, field.path, images);
                    renderGallery();
                    triggerPreviewUpdate();
                };
                
                grid.appendChild(imgContainer);
            });
            galleryContainer.appendChild(grid);

            // Add Image Button
            if (images.length < 20) {
                const addWrapper = document.createElement('div');
                addWrapper.className = 'btn-add-item'; // Updated class
                addWrapper.innerHTML = `<i data-lucide="plus"></i> Agregar Imagen/Video (${images.length}/20)`;
                addWrapper.onclick = () => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*,video/mp4';
                    input.onchange = async (e) => {
                        if (e.target.files[0]) {
                            const file = e.target.files[0];
                            
                            try {
                                await validateImage(file);
                            } catch (error) {
                                alert(error);
                                return;
                            }

                            const formData = new FormData();
                            formData.append('image', file);
                            const eventTitle = (draftEvent.title || '').replace(/<[^>]*>/g, '').trim() || draftEvent.id || 'evento';
                            const eventState = (draftEvent.state || '').trim();
                            formData.append('state', eventState);
                            formData.append('entity_name', eventTitle);
                            formData.append('section', 'eventos');
                            try {
                                const res = await fetch('../api/upload_image.php', { method: 'POST', body: formData });
                                const data = await res.json();
                                if (data.success) {
                                    const list = getValueAtPath(draftEvent, field.path) || [];
                                    list.push(data.path);
                                    setValueAtPath(draftEvent, field.path, list);
                                    renderGallery();
                                    triggerPreviewUpdate();
                                }
                            } catch (err) { alert('Error subiendo archivo'); }
                        }
                    };
                    input.click();
                };
                galleryContainer.appendChild(addWrapper);
            } else {
                const limitMsg = document.createElement('p');
                limitMsg.className = 'text-red-500 text-sm mt-2';
                limitMsg.textContent = 'Límite de 20 imágenes alcanzado.';
                galleryContainer.appendChild(limitMsg);
            }
            lucide.createIcons();
        };

        renderGallery();
        group.appendChild(galleryContainer);
    }
    else if (field.type === 'object-list') {
         // Specifically for results [{value, label}]
         const listContainer = document.createElement('div');
         const renderObjList = () => {
             listContainer.innerHTML = '';
             const list = getValueAtPath(draftEvent, field.path) || [];
             
             list.forEach((item, idx) => {
                 const row = document.createElement('div');
                row.className = 'array-item-wrapper object-list-wrapper'; // Updated class
                
                const valInput = document.createElement('input');
                 valInput.type = 'text';
                 valInput.placeholder = 'Valor (e.g. 100%)';
                 valInput.className = 'modal-form-input';
                 if (field.maxLength) valInput.maxLength = field.maxLength;
                 valInput.value = item.value;
                 valInput.oninput = (e) => {
                     list[idx].value = e.target.value;
                     setValueAtPath(draftEvent, field.path, list);
                     triggerPreviewUpdate();
                 };

                 const labelInput = document.createElement('input');
                 labelInput.type = 'text';
                 labelInput.placeholder = 'Etiqueta';
                 labelInput.className = 'modal-form-input';
                 if (field.maxLength) labelInput.maxLength = field.maxLength;
                 labelInput.value = item.label;
                 labelInput.oninput = (e) => {
                     list[idx].label = e.target.value;
                     setValueAtPath(draftEvent, field.path, list);
                     triggerPreviewUpdate();
                 };

                 const delBtn = document.createElement('button');
                 delBtn.className = 'btn-delete-item';
                 delBtn.innerHTML = '<i data-lucide="trash-2"></i>';
                 delBtn.onclick = () => {
                     list.splice(idx, 1);
                     setValueAtPath(draftEvent, field.path, list);
                     renderObjList();
                     triggerPreviewUpdate();
                 };

                 row.appendChild(valInput);
                 row.appendChild(labelInput);
                 row.appendChild(delBtn);
                 listContainer.appendChild(row);
             });
             
             const addBtn = document.createElement('button');
             addBtn.className = 'btn-add-item';
             addBtn.innerHTML = '<i data-lucide="plus"></i> Agregar Resultado';
             addBtn.onclick = () => {
                 const list = getValueAtPath(draftEvent, field.path) || [];
                 list.push({ value: '', label: '' });
                 setValueAtPath(draftEvent, field.path, list);
                 renderObjList();
             };
             listContainer.appendChild(addBtn);
             lucide.createIcons();
         };
         
         renderObjList();
         group.appendChild(listContainer);
    }

    return group;
}

// Helpers
function getValueAtPath(obj, path) {
    if (!obj) return undefined;
    return path.split('.').reduce((o, k) => (o || {})[k], obj);
}

function setValueAtPath(obj, path, value) {
    if (!obj) return;
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((o, k) => {
        if (!o[k]) o[k] = {};
        return o[k];
    }, obj);
    target[lastKey] = value;
}

function enforceSingleVisibleEvent(events, preferredId = null) {
    if (!Array.isArray(events) || events.length === 0) return events;

    let visibleId = preferredId;
    if (!visibleId) {
        const firstVisible = events.find(e => e && e.visible);
        visibleId = firstVisible ? firstVisible.id : events[0].id;
    }

    events.forEach(event => {
        if (!event) return;
        event.visible = event.id === visibleId;
    });

    return events;
}

async function relocateEventsAssetsBatch(events) {
    try {
        const response = await fetch('../api/relocate_event_assets.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events })
        });
        const result = await response.json();
        if (response.ok && result.success && Array.isArray(result.events)) {
            return result.events;
        }
        return events;
    } catch (error) {
        console.error(error);
        return events;
    }
}

// Saving
async function saveEvent() {
    let eventToSave = JSON.parse(JSON.stringify(draftEvent));

    if (editingEventId) {
        const index = currentEvents.findIndex(e => e.id === editingEventId);
        if (index !== -1) {
            currentEvents[index] = eventToSave;
        }
    } else {
        currentEvents.push(eventToSave);
    }

    if (eventToSave.visible) {
        enforceSingleVisibleEvent(currentEvents, eventToSave.id);
    } else {
        enforceSingleVisibleEvent(currentEvents);
    }
    
    currentEvents = await relocateEventsAssetsBatch(currentEvents);
    draftEvent = currentEvents.find(e => e.id === eventToSave.id) || eventToSave;
    await saveAllEvents();
    closeModal();
    renderEventList();
}

async function saveAllEvents() {
    try {
        enforceSingleVisibleEvent(currentEvents);
        const response = await fetch('../api/save_data.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'event',
                data: currentEvents
            })
        });
        const result = await response.json();
        if (result.success) {
            // alert('Guardado correctamente');
            console.log('Guardado exitoso');
        } else {
            alert('Error al guardar: ' + result.error);
        }
    } catch (err) {
        console.error(err);
        alert('Error de red al guardar');
    }
}

// Preview Logic
function openPreview(eventData) {
    // If preview window is not open or closed, open it
    if (!previewWindow || previewWindow.closed) {
        previewWindow = window.open('../admin_preview.html?tab=events', 'previewWindow', 'width=1200,height=800');
        
        // Wait for it to load then send data
        previewWindow.onload = () => {
            triggerPreviewUpdate();
        };
    } else {
        previewWindow.focus();
        triggerPreviewUpdate();
    }
}

function triggerPreviewUpdate() {
    updateInlinePreview();
    if (previewWindow && !previewWindow.closed) {
        // Create a temporary array with just this event, set to visible
        const previewData = JSON.parse(JSON.stringify(draftEvent));
        previewData.visible = true; // Force visible for preview
        
        // We send it as an array because the previewer expects an array for 'events'
        previewWindow.postMessage({ 
            type: 'UPDATE_PREVIEW',
            tab: 'events',
            data: [previewData] 
        }, '*');
    }
}

function updateInlinePreview() {
    const image = document.getElementById('preview-image');
    const badge = document.getElementById('preview-badge');
    const title = document.getElementById('preview-title');
    const meta = document.getElementById('preview-meta');
    const description = document.getElementById('preview-description');

    if (!image || !badge || !title || !meta || !description) return;

    const plainTitle = typeof draftEvent.title === 'string' ? draftEvent.title.replace(/<[^>]*>/g, '').trim() : '';
    const badgeText = typeof draftEvent.badge === 'string' ? draftEvent.badge.trim() : '';
    const dateText = typeof draftEvent.date === 'string' ? draftEvent.date.trim() : '';
    const locationText = typeof draftEvent.location === 'string' && draftEvent.location.trim()
        ? draftEvent.location.trim()
        : (typeof draftEvent.state === 'string' ? draftEvent.state.trim() : '');
    const descriptionText = typeof draftEvent.description === 'string' ? draftEvent.description.trim() : '';
    const imagePath = typeof draftEvent.mainImage === 'string' ? draftEvent.mainImage.trim() : '';

    badge.textContent = badgeText;
    badge.style.display = badgeText ? 'inline-flex' : 'none';
    title.textContent = plainTitle;
    title.style.display = plainTitle ? 'block' : 'none';
    meta.textContent = [dateText, locationText].filter(Boolean).join(' · ');
    meta.style.display = meta.textContent ? 'block' : 'none';
    description.textContent = descriptionText;
    description.style.display = descriptionText ? 'block' : 'none';
    image.src = `../${imagePath || 'assets/images/logo.png'}`;
}
