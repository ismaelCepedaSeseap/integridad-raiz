document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let originalData = [];
    let workingData = [];
    let selectedItemIndex = null;
    let previewWindow = null;
    let previewOverride = null;
    let draftEvent = null;

    // --- DOM ELEMENTS ---
    const itemListContainer = document.getElementById('item-list-container');
    const itemCountElement = document.getElementById('item-count');
    const btnSave = document.getElementById('btn-save');
    const btnNewItemInline = document.getElementById('btn-new-item-inline');
    
    // Modal Elements
    const modalOverlay = document.getElementById('new-event-modal');
    const modalForm = document.getElementById('new-event-form');
    const modalTitle = document.getElementById('modal-title');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnModalCancel = document.getElementById('btn-modal-cancel');
    const btnModalPreview = document.getElementById('btn-modal-preview');
    const btnModalSave = document.getElementById('btn-modal-save');
    
    // Sidebar Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
    
    const icons = document.querySelectorAll('[data-lucide]');
    if (icons.length > 0) {
        lucide.createIcons();
    }

    // --- INITIALIZATION ---
    function initialize() {
        loadData();
        renderItemsList();
        setupEventListeners();
    }

    function loadData() {
        if (typeof EVENTS !== 'undefined') {
            const normalized = EVENTS.map(event => normalizeEventModel(event));
            ensureActiveEvent(normalized);
            originalData = JSON.parse(JSON.stringify(normalized));
            workingData = JSON.parse(JSON.stringify(normalized));
        } else {
            console.error("Event data (EVENTS) is not loaded.");
            originalData = [];
            workingData = [];
        }
    }

    function normalizeEventModel(event) {
        return {
            id: event.id || `evento-${Date.now()}`,
            visible: Boolean(event.visible),
            badge: event.badge || '',
            title: event.title || '',
            description: event.description || '',
            date: event.date || '',
            state: event.state || '',
            location: event.location || '',
            url: event.url || '',
            mainImage: event.mainImage || '',
            imageUrl: event.imageUrl || '',
            decorations: {
                topLeft: event.decorations?.topLeft || '',
                bottomRight: event.decorations?.bottomRight || ''
            },
            impact: event.impact || '',
            pillars_count: event.pillars_count || '',
            pillars: Array.isArray(event.pillars) ? event.pillars : [],
            banners: Array.isArray(event.banners) ? event.banners : [],
            videoUrl: event.videoUrl || '',
            gallery: Array.isArray(event.gallery) ? event.gallery : [],
            tags: Array.isArray(event.tags) ? event.tags : [],
            slogan: event.slogan || '',
            chronicle: {
                label: event.chronicle?.label || '',
                title: event.chronicle?.title || '',
                date: event.chronicle?.date || '',
                location: event.chronicle?.location || '',
                quote: event.chronicle?.quote || '',
                quoteAuthor: event.chronicle?.quoteAuthor || '',
                content: Array.isArray(event.chronicle?.content) ? event.chronicle.content : [],
                values: Array.isArray(event.chronicle?.values) ? event.chronicle.values : [],
                footer: event.chronicle?.footer || ''
            },
            results: Array.isArray(event.results) ? event.results : []
        };
    }

    function ensureActiveEvent(items) {
        if (!items.some(item => item.visible) && items.length > 0) {
            items[0].visible = true;
        }
    }

    function toPlainText(value) {
        const temp = document.createElement('div');
        temp.innerHTML = value || '';
        return temp.textContent || temp.innerText || '';
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function parseList(value) {
        return value
            .split(/\n|,/)
            .map(item => item.trim())
            .filter(Boolean);
    }
    
    // Parses key-value pairs separated by pipe (|)
    // Format: Value | Label
    function parseObjectList(value) {
        return value
            .split('\n')
            .map(line => {
                const parts = line.split('|');
                if (parts.length < 2) return null;
                return {
                    value: parts[0].trim(),
                    label: parts[1].trim()
                };
            })
            .filter(item => item !== null);
    }

    // Converts array of objects back to string format
    function stringifyObjectList(list) {
        if (!Array.isArray(list)) return '';
        return list.map(item => `${item.value} | ${item.label}`).join('\n');
    }

    function getValueAtPath(obj, path) {
        return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
    }

    function setValueAtPath(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        keys.slice(0, -1).forEach(key => {
            if (!current[key] || typeof current[key] !== 'object') current[key] = {};
            current = current[key];
        });
        current[keys[keys.length - 1]] = value;
    }

    function resolveImageSrc(src) {
        if (!src) return '';
        if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('../')) {
            return src;
        }
        return `../${src}`;
    }

    // --- RENDERING ---
    function renderItemsList() {
        itemListContainer.innerHTML = '';
        if (workingData.length === 0) {
            itemListContainer.innerHTML = '<p class="text-center text-slate-500 p-4">No hay eventos para mostrar.</p>';
            return;
        }

        workingData.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = `item-table__row ${selectedItemIndex === index ? 'item-table__row--active' : ''}`;
            itemElement.dataset.index = index;
            
            const titleText = toPlainText(item.title || 'Evento sin título');
            const stateText = item.state || 'Sin estado';
            const dateText = item.date || 'Sin fecha';
            const locationText = item.location || 'Sin ubicación';
            const rawImageSrc = item.imageUrl || item.mainImage || (item.gallery && item.gallery[0]) || '../assets/images/logo.png';
            const imageSrc = resolveImageSrc(rawImageSrc);
            const statusClass = item.visible ? 'status-pill--active' : 'status-pill--inactive';
            const statusLabel = item.visible ? 'Activo' : 'Inactivo';
            itemElement.innerHTML = `
                <div class="item-table__cell">
                    <div class="event-cell">
                        <img src="${imageSrc}" alt="${titleText}" class="event-avatar">
                        <div>
                            <p class="event-title">${titleText}</p>
                            <p class="event-subtitle">${locationText}</p>
                        </div>
                    </div>
                </div>
                <div class="item-table__cell">${stateText}</div>
                <div class="item-table__cell">${dateText}</div>
                <div class="item-table__cell">
                    <span class="status-pill ${statusClass}">${statusLabel}</span>
                </div>
                <div class="item-table__cell">
                    <button class="btn-icon btn-icon--primary" data-action="edit" data-index="${index}" title="Editar">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="btn-icon btn-icon--danger" data-action="delete" data-index="${index}" title="Eliminar">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            `;
            itemListContainer.appendChild(itemElement);
        });

        itemCountElement.textContent = `${workingData.length} evento(s)`;
        lucide.createIcons();
    }

    function getEventFields() {
        return [
            // --- General Info ---
            { label: 'ID (evento_id)', path: 'id', type: 'text', section: 'General' },
            { label: 'Visible en Último Evento', path: 'visible', type: 'checkbox', section: 'General' },
            { label: 'Badge (Etiqueta superior)', path: 'badge', type: 'text', section: 'General' },
            { label: 'Título (HTML)', path: 'title', type: 'textarea', rows: 2, section: 'General' },
            { label: 'Eslogan (Subtítulo)', path: 'slogan', type: 'text', section: 'General' },
            { label: 'Descripción Corta', path: 'description', type: 'textarea', rows: 3, section: 'General' },
            
            // --- Location & Date ---
            { label: 'Fecha', path: 'date', type: 'text', section: 'Ubicación' },
            { label: 'Ubicación', path: 'location', type: 'text', section: 'Ubicación' },
            { label: 'Estado', path: 'state', type: 'text', section: 'Ubicación' },
            { label: 'CTA URL (Link botón)', path: 'url', type: 'text', section: 'Ubicación' },

            // --- Media ---
            { label: 'Imagen Portada (Hero)', path: 'mainImage', type: 'image', section: 'Multimedia' },
            { label: 'Imagen Miniatura (Lista)', path: 'imageUrl', type: 'image', section: 'Multimedia' },
            { label: 'Video YouTube URL', path: 'videoUrl', type: 'text', section: 'Multimedia' },
            { label: 'Galería (URLs por línea)', path: 'gallery', type: 'list', section: 'Multimedia' },
            { label: 'Banners (URLs por línea)', path: 'banners', type: 'list', section: 'Multimedia' },
            { label: 'Decoración Top Left', path: 'decorations.topLeft', type: 'text', section: 'Multimedia' },
            { label: 'Decoración Bottom Right', path: 'decorations.bottomRight', type: 'text', section: 'Multimedia' },

            // --- Impact & Stats ---
            { label: 'Impacto (Texto)', path: 'impact', type: 'text', section: 'Métricas' },
            { label: 'Conteo Pilares (Texto)', path: 'pillars_count', type: 'text', section: 'Métricas' },
            { label: 'Resultados (Valor | Etiqueta)', path: 'results', type: 'object-list', rows: 4, section: 'Métricas', placeholder: '100% | Compromiso\n24/7 | Vigilancia' },

            // --- Chronicle Section ---
            { label: 'Crónica - Etiqueta', path: 'chronicle.label', type: 'text', section: 'Crónica' },
            { label: 'Crónica - Título', path: 'chronicle.title', type: 'text', section: 'Crónica' },
            { label: 'Crónica - Fecha', path: 'chronicle.date', type: 'text', section: 'Crónica' },
            { label: 'Crónica - Lugar', path: 'chronicle.location', type: 'text', section: 'Crónica' },
            { label: 'Crónica - Cita', path: 'chronicle.quote', type: 'textarea', rows: 3, section: 'Crónica' },
            { label: 'Crónica - Autor Cita', path: 'chronicle.quoteAuthor', type: 'text', section: 'Crónica' },
            { label: 'Crónica - Contenido (Párrafos)', path: 'chronicle.content', type: 'list', rows: 6, section: 'Crónica' },
            { label: 'Crónica - Valores', path: 'chronicle.values', type: 'list', rows: 3, section: 'Crónica' },
            { label: 'Crónica - Pie de página', path: 'chronicle.footer', type: 'textarea', rows: 2, section: 'Crónica' },

            // --- Tags & Pillars ---
            { label: 'Pilares (Lista)', path: 'pillars', type: 'list', section: 'Otros' },
            { label: 'Tags (Lista)', path: 'tags', type: 'list', section: 'Otros' }
        ];
    }

    function renderModalForm() {
        if (!draftEvent || !modalForm) return;
        const fields = getEventFields();
        
        // Group fields by section
        const sections = {};
        fields.forEach(field => {
            const section = field.section || 'General';
            if (!sections[section]) sections[section] = [];
            sections[section].push(field);
        });

        // Generate Tabs Header and Content
        let tabsHeaderHtml = '<div class="tabs-header">';
        let tabsContentHtml = '<div class="tab-content">';
        
        let isFirst = true;

        for (const [sectionName, sectionFields] of Object.entries(sections)) {
            const activeClass = isFirst ? 'active' : '';
            // Sanitizar ID para evitar problemas con acentos y espacios
            const sanitizedSectionName = sectionName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').toLowerCase();
            const sectionId = `tab-${sanitizedSectionName}`;
            
            // Tab Button
            tabsHeaderHtml += `
                <button class="tab-btn ${activeClass}" data-target="${sectionId}">
                    ${sectionName}
                </button>
            `;

            // Tab Content
            tabsContentHtml += `<div id="${sectionId}" class="tab-pane ${activeClass}">`;
            tabsContentHtml += `<div class="form-grid">`; // Start form grid inside tab
            
            tabsContentHtml += sectionFields.map(field => {
                const value = getValueAtPath(draftEvent, field.path);
                const isFull = field.type === 'textarea' || field.type === 'list' || field.type === 'object-list' || field.type === 'image';
                
                if (field.type === 'checkbox') {
                    return `
                        <div class="form-group ${isFull ? 'form-group--full' : ''}">
                            <label>
                                <input type="checkbox" data-field="${field.path}" ${value ? 'checked' : ''}>
                                ${field.label}
                            </label>
                        </div>
                    `;
                }
                if (field.type === 'textarea') {
                    return `
                        <div class="form-group form-group--full">
                            <label>${field.label}</label>
                            <textarea class="form-control" data-field="${field.path}" rows="${field.rows || 3}">${escapeHtml(value || '')}</textarea>
                        </div>
                    `;
                }
                if (field.type === 'list') {
                    const listValue = Array.isArray(value) ? value.join('\n') : '';
                    return `
                        <div class="form-group form-group--full">
                            <label>${field.label}</label>
                            <textarea class="form-control" data-field="${field.path}" data-type="list" rows="${field.rows || 4}" placeholder="Un elemento por línea">${escapeHtml(listValue)}</textarea>
                        </div>
                    `;
                }
                if (field.type === 'object-list') {
                    const listValue = stringifyObjectList(value);
                    return `
                        <div class="form-group form-group--full">
                            <label>${field.label}</label>
                            <textarea class="form-control" data-field="${field.path}" data-type="object-list" rows="${field.rows || 4}" placeholder="${field.placeholder || ''}">${escapeHtml(listValue)}</textarea>
                            <small class="form-help">Formato: Valor | Etiqueta (una por línea)</small>
                        </div>
                    `;
                }
                if (field.type === 'image') {
                    const imageSrc = resolveImageSrc(value);
                    const isDataUrl = value && value.startsWith('data:');
                    const inputValue = isDataUrl ? '' : (value || '');
                    const placeholder = isDataUrl ? '(Imagen cargada desde archivo)' : 'O pega la URL aquí';
                    
                    return `
                        <div class="form-group form-group--full">
                            <label>${field.label}</label>
                            <div class="image-upload-preview">
                                ${imageSrc ? `<img src="${imageSrc}" alt="Preview" style="max-height: 100px; margin-bottom: 0.5rem; display: block;">` : ''}
                                <input type="file" class="form-control" data-field="${field.path}" data-type="image" accept="image/*" style="margin-bottom: 0.5rem;">
                                <input type="text" class="form-control" data-field="${field.path}" value="${escapeHtml(inputValue)}" placeholder="${placeholder}">
                            </div>
                        </div>
                    `;
                }
                return `
                    <div class="form-group">
                        <label>${field.label}</label>
                        <input type="text" class="form-control" data-field="${field.path}" value="${escapeHtml(value || '')}">
                    </div>
                `;
            }).join('');
            
            tabsContentHtml += `</div></div>`; // End form grid and tab pane
            isFirst = false;
        }

        tabsHeaderHtml += '</div>';
        tabsContentHtml += '</div>';

        modalForm.innerHTML = `<div class="tabs-container">${tabsHeaderHtml}${tabsContentHtml}</div>`;
        
        // Add Event Listeners for Tabs
        const tabBtns = modalForm.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent form submission or jump
                
                // Remove active class from all buttons and panes
                modalForm.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                modalForm.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked button and target pane
                btn.classList.add('active');
                const targetId = btn.dataset.target;
                const targetPane = document.getElementById(targetId);
                if (targetPane) targetPane.classList.add('active');
            });
        });
    }

    // --- EVENT HANDLERS ---
    function setupEventListeners() {
        itemListContainer.addEventListener('click', handleItemListClick);
        btnNewItem?.addEventListener('click', () => openModal());
        btnSave.addEventListener('click', handleGlobalSave);
        
        modalForm?.addEventListener('input', handleModalInput);
        modalForm?.addEventListener('change', handleModalChange); // For file inputs
        
        btnCloseModal?.addEventListener('click', closeModal);
        btnModalCancel?.addEventListener('click', closeModal);
        btnModalPreview?.addEventListener('click', handleModalPreview);
        btnModalSave?.addEventListener('click', handleModalSave);
        
        btnToggleSidebar?.addEventListener('click', () => {
            sidebar?.classList.toggle('is-open');
            sidebarOverlay?.classList.toggle('is-visible');
        });
        sidebarOverlay?.addEventListener('click', () => {
            sidebar?.classList.remove('is-open');
            sidebarOverlay?.classList.remove('is-visible');
        });
    }

    function handleItemListClick(e) {
        const target = e.target.closest('button');
        if (!target) return;
        
        const row = target.closest('.item-table__row');
        if (!row) return;
        
        const index = parseInt(row.dataset.index, 10);
        const action = target.dataset.action;

        if (action === 'delete') {
            handleDeleteItem(index);
        } else if (action === 'edit') {
            openModal(index);
        }
    }

    function openModal(index = null) {
        selectedItemIndex = index;
        
        if (index !== null) {
            // Edit mode
            draftEvent = JSON.parse(JSON.stringify(workingData[index]));
            modalTitle.textContent = "Editar Evento";
            btnModalSave.innerHTML = '<i data-lucide="save"></i> Guardar Cambios';
        } else {
            // New mode
            const newId = `evento-${Date.now()}`;
            draftEvent = normalizeEventModel({
                id: newId,
                visible: false,
                badge: 'Nuevo Evento',
                title: 'Nuevo Evento',
                description: '',
                date: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
                state: 'Puebla',
                location: '',
                url: `detalle_evento.html?id=${newId}`,
                mainImage: '',
                imageUrl: '',
                decorations: { topLeft: '', bottomRight: '' },
                impact: '',
                pillars_count: '',
                pillars: [],
                banners: [],
                videoUrl: '',
                gallery: [],
                tags: []
            });
            modalTitle.textContent = "Nuevo Evento";
            btnModalSave.innerHTML = '<i data-lucide="plus"></i> Agregar Evento';
        }
        
        renderModalForm();
        modalOverlay?.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }

    function closeModal() {
        modalOverlay?.classList.remove('is-visible');
        document.body.style.overflow = '';
        draftEvent = null;
        selectedItemIndex = null;
    }

    function handleModalInput(e) {
        if (!draftEvent || e.target.type === 'file') return;
        
        const fieldPath = e.target.dataset.field;
        if (!fieldPath) return;
        
        let value;
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        } else if (e.target.dataset.type === 'list') {
            value = parseList(e.target.value);
        } else if (e.target.dataset.type === 'object-list') {
            value = parseObjectList(e.target.value);
        } else {
            value = e.target.value;
        }
        
        setValueAtPath(draftEvent, fieldPath, value);
        
        // Real-time preview update if window is open
        if (previewWindow && !previewWindow.closed) {
            openPreview(draftEvent);
        }
    }
    
    function handleModalChange(e) {
        if (!draftEvent || e.target.type !== 'file') return;
        
        const fieldPath = e.target.dataset.field;
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const result = e.target.result;
                setValueAtPath(draftEvent, fieldPath, result);
                renderModalForm(); // Re-render to show preview
                
                // Real-time preview update
                if (previewWindow && !previewWindow.closed) {
                    openPreview(draftEvent);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    function handleModalSave() {
        if (!draftEvent) return;
        
        if (draftEvent.visible) {
            // Ensure only one is visible if this one is set to visible
            workingData.forEach((event, idx) => {
                if (selectedItemIndex === null || idx !== selectedItemIndex) {
                    event.visible = false;
                }
            });
        }

        if (selectedItemIndex !== null) {
            // Update existing
            workingData[selectedItemIndex] = draftEvent;
        } else {
            // Add new
            workingData.push(draftEvent);
        }
        
        renderItemsList();
        closeModal();
    }

    function handleModalPreview() {
        if (!draftEvent) return;
        openPreview(draftEvent);
    }

    function handleDeleteItem(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
            workingData.splice(index, 1);
            renderItemsList();
        }
    }

    function handleGlobalSave() {
        // Generar el contenido del archivo JS
        const jsContent = `const EVENTS = ${JSON.stringify(workingData, null, 4)};`;
        
        // Crear un Blob con el contenido
        const blob = new Blob([jsContent], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        
        // Crear un enlace temporal para la descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = 'events-data.js';
        document.body.appendChild(a);
        a.click();
        
        // Limpiar
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert("Archivo 'events-data.js' generado. Por favor, reemplaza el archivo existente en 'js/events-data.js' con este nuevo archivo para persistir los cambios.");
    }

    // --- PREVIEW LOGIC ---
    function openPreview(previewItem = null) {
        if (previewItem) {
            previewOverride = normalizeEventForPreview(previewItem);
        }
        
        if (previewWindow && !previewWindow.closed) {
            previewWindow.focus();
            syncPreview(); // Force sync immediately if open
        } else {
            previewWindow = window.open('../admin_preview.html', 'AdminPreview', 'width=1200,height=800');
            // Wait for the window to load before sending data
            setTimeout(syncPreview, 1000);
        }
    }

    function syncPreview() {
        if (previewWindow && !previewWindow.closed) {
            // If we are previewing a draft from modal, use it.
            // Otherwise, use the selected item from the list, or just the whole list?
            // The preview page expects a list of events to render the slider/grid.
            // If we are previewing a SPECIFIC item (editing/creating), we might want to 
            // force that item to be the "active" one or just pass it as the single data item 
            // if the preview page supports single item preview. 
            // Based on previous code: `data: itemForPreview ? [itemForPreview] : []`
            
            const itemForPreview = previewOverride;
            
            const dataToSend = {
                tab: 'events',
                data: itemForPreview ? [itemForPreview] : []
            };
            
            previewWindow.postMessage({ type: 'UPDATE_PREVIEW', ...dataToSend }, '*');
            
            // Note: We don't clear previewOverride here immediately if we want to keep updating it as we type
        }
    }

    function normalizeEventForPreview(item) {
        const decorationsFromBanners = Array.isArray(item.banners) ? item.banners : [];
        const mainImage = item.mainImage || item.imageUrl || (item.gallery && item.gallery[0]) || '';
        return {
            ...item,
            badge: item.badge || item.pillars_count || item.impact || 'Evento',
            mainImage,
            url: item.url || '#',
            decorations: item.decorations || {
                topLeft: decorationsFromBanners[0] || '',
                bottomRight: decorationsFromBanners[1] || ''
            }
        };
    }

    // --- START ---
    initialize();
});
