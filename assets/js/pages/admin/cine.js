// Global state
let currentVideos = [];
let editingVideoId = null;
let draftVideo = {};
let previewWindow = null;
let currentPage = 1;
let itemsPerPage = 10;

const tableBody = document.getElementById('videos-table-body');
const searchInput = document.getElementById('search-input');
const showingCount = document.getElementById('showing-count');
const totalCount = document.getElementById('total-count');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const itemsPerPageSelect = document.getElementById('items-per-page');
const paginationNumbers = document.getElementById('pagination-numbers');

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    injectModalStyles();
    loadVideos();
    setupEventListeners();
});

function injectModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modal-form-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 700;
            font-size: 0.8rem;
            color: #334155;
            margin-bottom: 0.5rem;
            letter-spacing: 0.02em;
        }

        .modal-form-label i,
        .modal-form-label svg {
            color: var(--admin-modal-icon-color, #3b82f6);
        }
        
        .modal-form-input, .modal-form-textarea, .modal-form-select {
            width: 100%;
            padding: 0.7rem 0.9rem;
            border-radius: 0.75rem;
            border: 1px solid #e2e8f0;
            background-color: #f8fafc;
            font-size: 0.9rem;
            color: #0f172a;
            transition: all 0.2s ease;
            outline: none;
            font-family: inherit;
        }

        .modal-form-input:hover, .modal-form-textarea:hover, .modal-form-select:hover {
            border-color: #94a3b8;
            background-color: #ffffff;
        }

        .modal-form-input:focus, .modal-form-textarea:focus, .modal-form-select:focus {
            border-color: #3b82f6;
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
            color: #22c55e;
            border-bottom-color: #22c55e;
            background-color: transparent;
        }

        .form-section {
            display: none;
        }

        .form-section.active {
            display: block;
        }

        .form-group {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 1rem;
            padding: 0.85rem 0.95rem;
            box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }
        
        /* YouTube Preview */
        .youtube-preview {
            margin-top: 8px;
            border-radius: 0.5rem;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            aspect-ratio: 16/9;
            max-width: 320px;
        }
        
        .youtube-preview iframe {
            width: 100%;
            height: 100%;
        }
        
        .youtube-preview.empty {
            background: #f1f5f9;
            color: #94a3b8;
            font-size: 0.8rem;
        }

        /* Mobile Adjustments */
        @media (max-width: 640px) {
            .modal-form-input, .modal-form-textarea, .modal-form-select {
                font-size: 16px; /* Prevent zoom on iOS */
            }
        }
    `;
    document.head.appendChild(style);
}

function loadVideos() {
    if (typeof videosPageData !== 'undefined') {
        currentVideos = JSON.parse(JSON.stringify(videosPageData)); // Deep clone
        renderVideoList();
    } else {
        console.error('videosPageData not found');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500">Error: No se encontraron datos de videos.</td></tr>';
        }
    }
}

function getFilteredVideos() {
    const term = (searchInput?.value || '').toLowerCase();
    return currentVideos.filter(video => {
        const title = (video.title || '').toLowerCase();
        const desc = (video.description || '').toLowerCase();
        const state = (video.stateLabel || '').toLowerCase();
        const hashtag = (video.hashtag || '').toLowerCase();
        return title.includes(term) || desc.includes(term) || state.includes(term) || hashtag.includes(term);
    });
}

function renderVideoList() {
    const countLabel = document.getElementById('item-count');
    if (!tableBody) return;

    const filtered = getFilteredVideos();
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalItems === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-slate-500">No hay videos disponibles</td></tr>';
        showingCount.textContent = '0-0';
        totalCount.textContent = '0';
        btnPrev.disabled = true;
        btnNext.disabled = true;
        if (paginationNumbers) paginationNumbers.innerHTML = '';
        if (countLabel) countLabel.textContent = '0 videos';
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
    if (countLabel) countLabel.textContent = `${totalItems} videos`;

    renderPaginationNumbers(totalPages);

    tableBody.innerHTML = pageItems.map(video => {
        const thumbUrl = `https://img.youtube.com/vi/${video.id}/default.jpg`;
        const statusClass = video.activo === 0 ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700';
        const statusText = video.activo === 0 ? 'Inactivo' : 'Activo';
        return `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="py-4">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-16 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                            <img src="${thumbUrl}" class="h-full w-full object-cover" alt="Thumb" onerror="this.src='../assets/images/logo.png'">
                        </div>
                        <div class="min-w-0">
                            <p class="font-bold text-slate-800 truncate">${video.title || 'Sin título'}</p>
                            <p class="text-xs text-slate-500 truncate">${video.stateLabel || '-'}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 text-slate-600">${video.description ? (video.description.substring(0, 60) + '...') : '-'}</td>
                <td class="py-4">
                    <a href="https://youtu.be/${video.id}" target="_blank" class="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
                        <i data-lucide="external-link" class="w-3 h-3"></i> YouTube
                    </a>
                </td>
                <td class="py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="py-4">
                    <div class="flex items-center gap-2">
                        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all" data-action="edit" data-id="${video.id}" title="Editar">
                            <i data-lucide="edit-2" class="w-4 h-4"></i>
                        </button>
                        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all" data-action="delete" data-id="${video.id}" title="Eliminar">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tableBody.querySelectorAll('button[data-action="edit"]').forEach(btn => {
        btn.onclick = () => editVideo(btn.dataset.id);
    });
    tableBody.querySelectorAll('button[data-action="delete"]').forEach(btn => {
        btn.onclick = () => deleteVideo(btn.dataset.id);
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
                renderVideoList();
            });
        }
        paginationNumbers.appendChild(btn);
    });
}

function editVideo(id) {
    const video = currentVideos.find(v => v.id === id);
    if (video) {
        editingVideoId = id;
        draftVideo = JSON.parse(JSON.stringify(video)); // Deep clone
        openModal('Editar Video');
    }
}

function deleteVideo(id) {
    if (confirm('¿Estás seguro de eliminar este video?')) {
        currentVideos = currentVideos.filter(v => v.id !== id);
        saveAllVideos();
        renderVideoList();
    }
}

function setupEventListeners() {
    const btnNew = document.getElementById('btn-new-item');
    if (btnNew) {
        btnNew.addEventListener('click', () => {
            editingVideoId = null;
            draftVideo = createEmptyVideo();
            openModal('Nuevo Video');
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderVideoList();
        });
    }

    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', () => {
            itemsPerPage = parseInt(itemsPerPageSelect.value);
            currentPage = 1;
            renderVideoList();
        });
    }

    if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderVideoList();
            }
        });
        btnNext.addEventListener('click', () => {
            const filtered = getFilteredVideos();
            const totalPages = Math.ceil(filtered.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderVideoList();
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
            openPreview(draftVideo);
        });
    }

    const btnSave = document.getElementById('btn-modal-save');
    if (btnSave) btnSave.addEventListener('click', saveVideo);
}

function createEmptyVideo() {
    return {
        id: '',
        title: '',
        description: '',
        state: 'puebla',
        stateLabel: 'Puebla',
        badgeClass: 'bg-green-500/80',
        hashtag: '',
        activo: 1
    };
}

// ==========================================
// MODAL & FORM LOGIC
// ==========================================

function openModal(title) {
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.textContent = title;
    
    const modal = document.getElementById('new-item-modal');
    if (modal) modal.classList.add('active');
    
    renderModalForm();
    
    // Update preview immediately if window is open
    setTimeout(() => {
        triggerPreviewUpdate();
    }, 100);
}

function closeModal() {
    const modal = document.getElementById('new-item-modal');
    if (modal) modal.classList.remove('active');
}

function getVideoFields() {
    return [
        { label: 'ID de YouTube', path: 'id', type: 'text', section: 'General', placeholder: 'Ej: V8Hvr99LLFk' },
        { label: 'Título', path: 'title', type: 'text', section: 'General' },
        { label: 'Descripción', path: 'description', type: 'textarea', section: 'General', maxLength: 300 },
        { label: 'Estatus', path: 'activo', type: 'select', section: 'General', options: [
            { value: '1', label: 'Activo' },
            { value: '0', label: 'Inactivo' }
        ]},
        { label: 'Estado', path: 'state', type: 'select', section: 'Clasificación', options: [
            { value: 'puebla', label: 'Puebla' },
            { value: 'hidalgo', label: 'Hidalgo' },
            { value: 'tlaxcala', label: 'Tlaxcala' }
        ]},
        { label: 'Etiqueta Estado', path: 'stateLabel', type: 'text', section: 'Clasificación', readOnly: true },
        { label: 'Color Badge (Clase CSS)', path: 'badgeClass', type: 'text', section: 'Clasificación', placeholder: 'bg-green-500/80' },
        { label: 'Hashtag', path: 'hashtag', type: 'text', section: 'Clasificación', placeholder: '#Ejemplo' }
    ];
}

function renderModalForm() {
    const formContainer = document.getElementById('new-item-form');
    const tabsContainer = document.getElementById('modal-tabs');
    
    if (!formContainer || !tabsContainer) return;
    
    formContainer.innerHTML = '';
    tabsContainer.innerHTML = '';
    
    const fields = getVideoFields();
    
    // Group fields by section
    const sections = {};
    fields.forEach(field => {
        if (!sections[field.section]) sections[field.section] = [];
        sections[field.section].push(field);
    });
    
    const sectionNames = Object.keys(sections);
    
    // Create Tabs
    sectionNames.forEach((sectionName, index) => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${index === 0 ? 'active' : ''}`;
        btn.textContent = sectionName;
        btn.onclick = () => switchTab(sectionName);
        tabsContainer.appendChild(btn);
    });

    // Create Form Sections
    sectionNames.forEach((sectionName, index) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = `form-section ${index === 0 ? 'active' : ''}`;
        sectionDiv.id = `section-${sectionName}`;
        
        sections[sectionName].forEach(field => {
            const wrapper = document.createElement('div');
            wrapper.className = 'form-group';
            
            const label = document.createElement('label');
            label.className = 'modal-form-label';
            label.innerHTML = `<i data-lucide="${getFieldIcon(field)}" class="w-4 h-4"></i> ${field.label}`;
            wrapper.appendChild(label);
            
            let input;
            
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.className = 'modal-form-textarea';
                input.value = getValueByPath(draftVideo, field.path) || '';
                
                if (field.maxLength) {
                    input.maxLength = field.maxLength;
                    const counter = document.createElement('div');
                    counter.className = 'text-xs text-slate-400 text-right mt-1';
                    counter.textContent = `${input.value.length}/${field.maxLength}`;
                    input.addEventListener('input', () => {
                        counter.textContent = `${input.value.length}/${field.maxLength}`;
                    });
                    wrapper.appendChild(input);
                    wrapper.appendChild(counter);
                } else {
                    wrapper.appendChild(input);
                }

            } else if (field.type === 'select') {
                input = document.createElement('select');
                input.className = 'modal-form-select';
                field.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.label;
                    const currentVal = String(getValueByPath(draftVideo, field.path) ?? '');
                    if (currentVal === opt.value) {
                        option.selected = true;
                    }
                    input.appendChild(option);
                });
                wrapper.appendChild(input);

                // Auto-update stateLabel based on selection
                if (field.path === 'state') {
                    input.addEventListener('change', () => {
                        const selectedOption = field.options.find(o => o.value === input.value);
                        if (selectedOption) {
                            draftVideo.stateLabel = selectedOption.label;
                            // Refresh form to show updated read-only field
                            renderModalForm(); 
                            // Maintain tab focus (simplified: just switch back to current)
                            switchTab(sectionName);
                        }
                    });
                }

            } else {
                input = document.createElement('input');
                input.type = 'text';
                input.className = 'modal-form-input';
                input.value = getValueByPath(draftVideo, field.path) || '';
                if (field.readOnly) input.readOnly = true;
                if (field.placeholder) input.placeholder = field.placeholder;
                wrapper.appendChild(input);
            }
            
            // Generic input handler
            const handleValueChange = (e) => {
                const val = field.path === 'activo' ? Number(e.target.value) : e.target.value;
                setValueByPath(draftVideo, field.path, val);
                triggerPreviewUpdate();
                
                // If ID changes, update preview iframe
                if (field.path === 'id') {
                    updateYoutubePreview(e.target.value, wrapper);
                }
            };

            input.addEventListener('input', handleValueChange);
            input.addEventListener('change', handleValueChange);

            // Special preview for YouTube ID
            if (field.path === 'id') {
                const previewDiv = document.createElement('div');
                previewDiv.className = 'youtube-preview ' + (input.value ? '' : 'empty');
                previewDiv.id = 'youtube-preview-container';
                if (input.value) {
                    previewDiv.innerHTML = `<iframe src="https://www.youtube.com/embed/${input.value}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                } else {
                    previewDiv.textContent = 'Vista previa del video';
                }
                wrapper.appendChild(previewDiv);
            }
            
            sectionDiv.appendChild(wrapper);
        });
        
        formContainer.appendChild(sectionDiv);
    });

    updateInlinePreview();
    lucide.createIcons();
}

function updateYoutubePreview(id, wrapper) {
    const container = wrapper.querySelector('.youtube-preview');
    if (container) {
        if (id && id.length > 5) { // Basic length check
            container.classList.remove('empty');
            container.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else {
            container.classList.add('empty');
            container.textContent = 'Vista previa del video';
        }
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === tabName);
    });
    
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.toggle('active', section.id === `section-${tabName}`);
    });
}

function getFieldIcon(field) {
    const key = (field.path || '').toLowerCase();
    if (key.includes('id')) return 'youtube';
    if (key.includes('title')) return 'type';
    if (key.includes('description')) return 'align-left';
    if (key.includes('state')) return 'map-pin';
    if (key.includes('badge')) return 'tag';
    if (key.includes('hashtag')) return 'hash';
    if (key.includes('activo')) return 'activity';
    return 'edit-3';
}

// ==========================================
// HELPERS
// ==========================================

function getValueByPath(obj, path) {
    return path.split('.').reduce((o, k) => (o || {})[k], obj);
}

function setValueByPath(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

// ==========================================
// SAVING & PREVIEW
// ==========================================

async function saveVideo() {
    if (!draftVideo.id || !draftVideo.title) {
        alert('El ID de YouTube y el título son obligatorios');
        return;
    }

    // Check for duplicate ID (only if new video)
    if (editingVideoId === null && currentVideos.some(v => v.id === draftVideo.id)) {
        alert('Este ID de video ya existe');
        return;
    }

    if (editingVideoId) {
        const index = currentVideos.findIndex(v => v.id === editingVideoId);
        if (index !== -1) {
            currentVideos[index] = { ...draftVideo };
        }
    } else {
        currentVideos.push({ ...draftVideo });
    }
    
    await saveAllVideos();
    closeModal();
    renderVideoList();
}

async function saveAllVideos() {
    const btnSave = document.getElementById('btn-modal-save');
    const originalText = btnSave ? btnSave.innerHTML : '';
    if (btnSave) {
        btnSave.disabled = true;
        btnSave.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Guardando...';
    }

    try {
        const response = await fetch('../api/save_data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'cine_videos',
                data: currentVideos
            })
        });

        const result = await response.json();
        
        if (result.success) {
            // Optional: Show success toast
            console.log('Guardado exitoso');
        } else {
            alert('Error al guardar: ' + result.message);
        }
    } catch (error) {
        console.error('Error saving:', error);
        alert('Error de conexión al guardar');
    } finally {
        if (btnSave) {
            btnSave.disabled = false;
            btnSave.innerHTML = originalText;
            lucide.createIcons();
        }
    }
}

function openPreview(videoData) {
    if (previewWindow && !previewWindow.closed) {
        previewWindow.focus();
        triggerPreviewUpdate();
    } else {
        previewWindow = window.open('../admin_preview.html', 'AdminPreview', 'width=1200,height=800');
        
        // Wait for load then send data
        previewWindow.onload = () => {
            triggerPreviewUpdate();
        };
    }
}

function triggerPreviewUpdate() {
    updateInlinePreview();
    if (previewWindow && !previewWindow.closed) {
        // Prepare data as array for the grid view
        const dataToSend = [draftVideo];
        previewWindow.postMessage({
            type: 'updatePreview',
            tab: 'cine_youtube', // New tab type for YouTube grid
            data: dataToSend
        }, '*');
    }
}

function updateInlinePreview() {
    const thumb = document.getElementById('preview-thumb');
    const title = document.getElementById('preview-title');
    const stateBadge = document.getElementById('preview-state-badge');
    const hashtag = document.getElementById('preview-hashtag');
    const description = document.getElementById('preview-description');

    if (!thumb || !title || !stateBadge || !hashtag || !description) return;

    const id = draftVideo.id || '';
    const thumbUrl = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '../assets/images/logo.png';

    thumb.src = thumbUrl;
    title.textContent = draftVideo.title || 'Título del Video';
    stateBadge.textContent = draftVideo.stateLabel || 'Estado';
    hashtag.textContent = draftVideo.hashtag || '#Hashtag';
    description.textContent = draftVideo.description || 'Descripción breve del video.';
}
