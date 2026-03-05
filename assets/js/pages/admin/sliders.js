document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('sliders-table-body');
    const sliderModal = document.getElementById('slider-modal');
    const sliderForm = document.getElementById('slider-form');
    const btnAddSlider = document.getElementById('btn-add-slider');
    const btnCloseModals = document.querySelectorAll('.btn-close-modal');
    const buttonsContainer = document.getElementById('buttons-container');
    const btnAddButton = document.getElementById('btn-add-button');
    const typeSelect = document.getElementById('type');
    const imageFieldContainer = document.getElementById('image-field-container');

    // Preview elements
    const previewContainer = document.getElementById('preview-container');
    const previewViewport = document.getElementById('preview-viewport');
    const guideV = document.getElementById('guide-v');
    const guideH = document.getElementById('guide-h');
    const previewCard = document.getElementById('preview-card');
    const previewBgImage = document.getElementById('preview-bg-image');
    const previewBadge = document.getElementById('preview-badge');
    const previewTitle = document.getElementById('preview-title');
    const previewDescription = document.getElementById('preview-description');
    const previewButtons = document.getElementById('preview-buttons');
    const previewMainImg = document.getElementById('preview-image'); // Ajustado el ID
    const previewImageContainer = document.getElementById('preview-image-container');
    const btnPrecisionMode = document.getElementById('btn-precision-mode');
    const searchInput = document.getElementById('search-input');

    // Paginación
    let currentPage = 1;
    let itemsPerPage = 10;
    const showingCount = document.getElementById('showing-count');
    const totalCount = document.getElementById('total-count');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const itemsPerPageSelect = document.getElementById('items-per-page');
    const paginationNumbers = document.getElementById('pagination-numbers');

    let precisionWindow = null;

    // Función para escalar la vista previa
    function updatePreviewScale() {
        if (!previewContainer || !previewViewport) return;
        
        // El contenedor ahora dicta el ancho
        const containerWidth = previewContainer.offsetWidth;
        if (containerWidth === 0) return; // Evitar división por cero si el modal no es visible aún

        const scale = containerWidth / 1280;
        
        // Aplicamos el escalado al viewport para que todo (fuentes, etc) se vea proporcional
        previewViewport.style.transform = `scale(${scale})`;
        
        // Ajustamos la altura del contenedor padre para que coincida con el viewport escalado (16:9)
        previewContainer.style.height = `${720 * scale}px`;
    }

    window.addEventListener('resize', updatePreviewScale);

    // Lógica de Ventana de Precisión
    if (btnPrecisionMode) {
        btnPrecisionMode.addEventListener('click', () => {
            const width = 1320;
            const height = 800;
            const left = (screen.width / 2) - (width / 2);
            const top = (screen.height / 2) - (height / 2);
            
            precisionWindow = window.open(
                'slider_precision_editor.php', 
                'SliderPrecisionEditor', 
                `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
            );
        });
    }

    // Escuchar mensajes del editor de precisión
    window.addEventListener('message', (event) => {
        if (event.data.type === 'ready') {
            updatePreview(); // Enviar datos iniciales
        } else if (event.data.type === 'buttonMoved') {
            const { index, x, y } = event.data;
            const row = buttonsContainer.children[index];
            if (row) {
                row.querySelector('.btn-pos-left').value = x;
                row.querySelector('.btn-pos-top').value = y;
                row.querySelector('.btn-pos-right').value = '';
                row.querySelector('.btn-pos-bottom').value = '';
                updatePreview(); // Actualizar la vista previa local también
            }
        }
    });

    let allSliders = [];

    // Event Listener para el buscador
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderTable();
        });
    }

    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', () => {
            itemsPerPage = parseInt(itemsPerPageSelect.value);
            currentPage = 1;
            renderTable();
        });
    }

    if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
        
        btnNext.addEventListener('click', () => {
            const filtered = getFilteredData();
            const totalPages = Math.ceil(filtered.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
    }

    // Cargar Sliders
    async function loadSliders() {
        try {
            const response = await fetch('../assets/php/admin/obtenerSliders.php');
            
            if (response.status === 401) {
                console.warn('Sesión expirada o no autorizado. Redirigiendo a login...');
                window.location.href = '../login.php';
                return;
            }

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            
            if (Array.isArray(data)) {
                allSliders = data;
                renderTable();
            } else {
                console.error('La respuesta no es un array:', data);
                allSliders = [];
                renderTable();
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500">Error en el formato de datos</td></tr>';
            }
        } catch (error) {
            console.error('Error cargando sliders:', error);
            allSliders = [];
            renderTable(); // Para mostrar estado vacío si falla
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500">Error al cargar los datos</td></tr>';
        }
    }

    function getFilteredData() {
        const term = searchInput ? searchInput.value.toLowerCase() : '';
        return allSliders.filter(s => 
            (s.title || '').toLowerCase().includes(term) || 
            (s.description || '').toLowerCase().includes(term)
        );
    }

    function renderTable() {
        const filtered = getFilteredData();
        
        if (!Array.isArray(filtered) || filtered.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-slate-500">No hay sliders disponibles</td></tr>';
            showingCount.textContent = '0-0';
            totalCount.textContent = '0';
            btnPrev.disabled = true;
            btnNext.disabled = true;
            if (paginationNumbers) paginationNumbers.innerHTML = '';
            return;
        }

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Validar página actual
        if (currentPage > totalPages) currentPage = totalPages || 1;
        if (currentPage < 1) currentPage = 1;

        // Calcular índices
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageItems = filtered.slice(startIndex, endIndex);

        // Actualizar UI paginación
        showingCount.textContent = `${totalItems > 0 ? startIndex + 1 : 0}-${endIndex}`;
        totalCount.textContent = totalItems;
        btnPrev.disabled = currentPage === 1;
        btnNext.disabled = currentPage >= totalPages;

        renderPaginationNumbers(totalPages);

        tableBody.innerHTML = pageItems.map(slider => `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-4 font-medium text-slate-600">${slider.orden}</td>
                <td class="px-4 py-4">
                    <span class="px-2 py-1 text-[10px] font-bold uppercase rounded-md ${slider.type === 'complex' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}">
                        ${slider.type}
                    </span>
                </td>
                <td class="px-4 py-4">
                    <div class="text-sm font-bold text-slate-700 truncate max-w-[200px]">${slider.title || 'Sín título'}</div>
                    <div class="text-[11px] text-slate-400 truncate max-w-[200px]">${slider.description || ''}</div>
                </td>
                <td class="px-4 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${slider.activo == 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}">
                        ${slider.activo == 1 ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="px-4 py-4">
                    <div class="flex gap-2">
                        <button onclick="editSlider(${slider.id})" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteSlider(${slider.id})" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
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
                    renderTable();
                });
            }
            paginationNumbers.appendChild(btn);
        });
    }

    // Modal Actions
    btnAddSlider.addEventListener('click', () => {
        sliderForm.reset();
        document.getElementById('slider-id').value = '';
        document.getElementById('url_image_actual').value = '';
        document.getElementById('url_backgroundImage_actual').value = '';
        buttonsContainer.innerHTML = '';
        document.getElementById('modal-title').textContent = 'Nuevo Slider';
        
        const nextOrder = allSliders.length;
        document.getElementById('orden').value = nextOrder;
        
        // Solo el primer slider puede ser complex
        if (nextOrder === 0) {
            typeSelect.value = 'complex';
            typeSelect.disabled = true;
        } else {
            typeSelect.value = 'simple';
            typeSelect.disabled = true;
        }
        
        sliderModal.classList.add('active');
        setTimeout(() => {
            updatePreview();
        }, 100);
    });

    btnCloseModals.forEach(btn => {
        btn.addEventListener('click', () => {
            sliderModal.classList.remove('active');
        });
    });

    // Manejar Botones
    btnAddButton.addEventListener('click', () => addButtonRow());

    // Helper para crear inputs de posición
    function createPosInput(label, cls, value = '', unit = 'px') {
        const val = value.replace(/[a-zA-Z%]/g, '');
        const u = value.replace(/[0-9.]/g, '') || unit;
        
        return `
            <div class="flex flex-col gap-1">
                <span class="text-[9px] uppercase font-bold text-slate-400">${label}</span>
                <div class="flex items-center">
                    <input type="number" class="${cls} w-14 px-1 py-1 text-[10px] border border-slate-200 rounded-l-md focus:ring-1 focus:ring-blue-500/30 outline-none" value="${val}" placeholder="--">
                    <select class="${cls}-unit px-0.5 py-1 text-[10px] bg-slate-50 border border-l-0 border-slate-200 rounded-r-md text-slate-500 outline-none">
                        <option value="px" ${u === 'px' ? 'selected' : ''}>px</option>
                        <option value="%" ${u === '%' ? 'selected' : ''}>%</option>
                        <option value="rem" ${u === 'rem' ? 'selected' : ''}>rem</option>
                        <option value="vh" ${u === 'vh' ? 'selected' : ''}>vh</option>
                        <option value="vw" ${u === 'vw' ? 'selected' : ''}>vw</option>
                    </select>
                </div>
            </div>
        `;
    }

    window.addButtonRow = (data = null) => {
        const div = document.createElement('div');
        div.className = 'bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300';
        
        const btnText = data?.text || 'Nuevo Botón';
        
        div.innerHTML = `
            <!-- Header colapsable -->
            <div class="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors btn-row-header">
                <div class="flex items-center gap-2">
                    <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform duration-300 transform rotate-0 btn-toggle-icon"></i>
                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-wider btn-header-title">${btnText}</span>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" class="btn-delete-row w-6 h-6 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-md flex items-center justify-center transition-all">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </div>

            <!-- Contenido del Botón -->
            <div class="btn-row-content p-4 space-y-3 transition-all duration-300">
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Texto del Botón</label>
                        <input type="text" class="btn-text w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" value="${data?.text || ''}" placeholder="Ej: Ver más">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">URL / Enlace</label>
                        <input type="text" class="btn-url w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" value="${data?.url || ''}" placeholder="Ej: #servicios">
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-3">
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Estilo</label>
                        <select class="btn-style w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none">
                            <option value="primary" ${data?.style === 'primary' ? 'selected' : ''}>Primario</option>
                            <option value="glass" ${data?.style === 'glass' ? 'selected' : ''}>Cristal</option>
                            <option value="outline" ${data?.style === 'outline' ? 'selected' : ''}>Delineado</option>
                            <option value="white" ${data?.style === 'white' ? 'selected' : ''}>Blanco</option>
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Icono (Lucide)</label>
                        <select class="btn-icon w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none">
                            <option value="play-circle" ${data?.icon === 'play-circle' ? 'selected' : ''}>Play</option>
                            <option value="arrow-right" ${data?.icon === 'arrow-right' ? 'selected' : ''}>Flecha</option>
                            <option value="external-link" ${data?.icon === 'external-link' ? 'selected' : ''}>Link</option>
                            <option value="download" ${data?.icon === 'download' ? 'selected' : ''}>Descarga</option>
                            <option value="info" ${data?.icon === 'info' ? 'selected' : ''}>Info</option>
                            <option value="shopping-cart" ${data?.icon === 'shopping-cart' ? 'selected' : ''}>Carrito</option>
                            <option value="message-circle" ${data?.icon === 'message-circle' ? 'selected' : ''}>Chat</option>
                            <option value="heart" ${data?.icon === 'heart' ? 'selected' : ''}>Corazón</option>
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Video (Opcional)</label>
                        <input type="text" class="btn-video w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" value="${data?.videoSrc || ''}" placeholder="Ruta del mp4">
                    </div>
                </div>

                <div class="pt-2 border-t border-slate-100">
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2 block">Posicionamiento Libre (Opcional)</label>
                    <div class="flex flex-wrap gap-2">
                        ${createPosInput('Top', 'btn-pos-top', data?.position_top || '')}
                        ${createPosInput('Left', 'btn-pos-left', data?.position_left || '')}
                        ${createPosInput('Right', 'btn-pos-right', data?.position_right || '')}
                        ${createPosInput('Bottom', 'btn-pos-bottom', data?.position_bottom || '')}
                    </div>
                </div>
            </div>
        `;

        buttonsContainer.appendChild(div);
        if (window.lucide) lucide.createIcons();

        // Lógica de colapsar/expandir
        const header = div.querySelector('.btn-row-header');
        const content = div.querySelector('.btn-row-content');
        const toggleIcon = div.querySelector('.btn-toggle-icon');
        const headerTitle = div.querySelector('.btn-header-title');
        const btnTextInp = div.querySelector('.btn-text');

        header.addEventListener('click', (e) => {
            // No colapsar si se hace click en el botón de eliminar
            if (e.target.closest('.btn-delete-row')) return;
            
            const isCollapsed = content.classList.contains('hidden');
            if (isCollapsed) {
                content.classList.remove('hidden');
                toggleIcon.style.transform = 'rotate(0deg)';
                div.classList.remove('opacity-80');
            } else {
                content.classList.add('hidden');
                toggleIcon.style.transform = 'rotate(-90deg)';
                div.classList.add('opacity-80');
            }
        });

        // Actualizar título del header en tiempo real
        btnTextInp.addEventListener('input', () => {
            headerTitle.textContent = btnTextInp.value || 'Nuevo Botón';
        });

        // Botón eliminar
        div.querySelector('.btn-delete-row').addEventListener('click', () => {
            div.remove();
            updatePreview();
        });

        // Show/hide video field based on style
        const styleSelect = div.querySelector('.btn-style');
        const videoInput = div.querySelector('.btn-video').parentElement;
        const updateVideoVisibility = () => {
            if (styleSelect.value === 'glass') {
                videoInput.classList.remove('hidden');
            } else {
                videoInput.classList.add('hidden');
            }
        };
        styleSelect.addEventListener('change', updateVideoVisibility);
        updateVideoVisibility();

        // Listeners for preview
        div.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('input', updatePreview);
            el.addEventListener('change', updatePreview);
        });
        updatePreview();
    };

    // Preview Logic
    function formatUnit(val) {
        if (!val) return null;
        val = val.toString().trim();
        if (!val) return null;
        if (/[a-zA-Z%]$/.test(val)) return val;
        if (!isNaN(val)) return `${val}px`;
        return val;
    }

    // Coordinate Scaling Logic (Base 1280px)
    const BASE_WIDTH = 1280;

    function getCurrentScale() {
        if (!previewContainer) return 1;
        return previewContainer.offsetWidth / BASE_WIDTH;
    }

    function scaleDelta(pxVal) {
        return pxVal / getCurrentScale();
    }

    // Drag and Drop Logic
    let isDragging = false;
    let currentDragTarget = null; // { el, type, index }
    let dragStartX, dragStartY;
    let initialX, initialY;
    
    function initDraggable(el, type, index = null) {
        el.addEventListener('mousedown', (e) => startDrag(e, el, type, index));
    }

    function startDrag(e, el, type, index) {
        e.preventDefault();
        isDragging = true;
        currentDragTarget = { el, type, index };
        
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        
        // Obtener el estilo computado para tener la posición actual real en píxeles
        const computedStyle = window.getComputedStyle(el);
        initialX = parseFloat(computedStyle.left) || 0;
        initialY = parseFloat(computedStyle.top) || 0;

        el.classList.add('is-dragging');
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    function drag(e) {
        if (!isDragging || !currentDragTarget) return;

        const deltaX_screen = e.clientX - dragStartX;
        const deltaY_screen = e.clientY - dragStartY;

        const scale = getCurrentScale();
        const deltaX = deltaX_screen / scale;
        const deltaY = deltaY_screen / scale;

        let newX = initialX + deltaX;
        let newY = initialY + deltaY;

        // Obtener dimensiones reales del elemento para el límite
        const elWidth = currentDragTarget.el.offsetWidth;
        const elHeight = currentDragTarget.el.offsetHeight;

        // Limitar dentro del canvas de 1280x720 con precisión decimal antes de redondear
        newX = Math.max(0, Math.min(newX, 1280 - elWidth));
        newY = Math.max(0, Math.min(newY, 720 - elHeight));

        // Redondear solo al final para evitar acumulación de errores de redondeo durante el movimiento
        const roundedX = Math.round(newX);
        const roundedY = Math.round(newY);

        currentDragTarget.el.style.left = `${roundedX}px`;
        currentDragTarget.el.style.top = `${roundedY}px`;
        
        // Lógica de guías de centrado magnético (snap)
        const centerX = 1280 / 2;
        const centerY = 720 / 2;
        const elCenterX = roundedX + (elWidth / 2);
        const elCenterY = roundedY + (elHeight / 2);
        const threshold = 10; // Umbral de 10px para el imán

        if (Math.abs(elCenterX - centerX) < threshold) {
            const snappedX = Math.round(centerX - (elWidth / 2));
            currentDragTarget.el.style.left = `${snappedX}px`;
            guideV.style.display = 'block';
            guideV.style.left = `${centerX}px`;
            
            if (currentDragTarget.type === 'button') {
                const row = buttonsContainer.children[currentDragTarget.index];
                if (row) row.querySelector('.btn-pos-left').value = snappedX;
            }
        } else {
            guideV.style.display = 'none';
        }

        if (Math.abs(elCenterY - centerY) < threshold) {
            const snappedY = Math.round(centerY - (elHeight / 2));
            currentDragTarget.el.style.top = `${snappedY}px`;
            guideH.style.display = 'block';
            guideH.style.top = `${centerY}px`;

            if (currentDragTarget.type === 'button') {
                const row = buttonsContainer.children[currentDragTarget.index];
                if (row) row.querySelector('.btn-pos-top').value = snappedY;
            }
        } else {
            guideH.style.display = 'none';
        }

        if (currentDragTarget.type === 'button') {
            currentDragTarget.el.style.right = 'auto';
            currentDragTarget.el.style.bottom = 'auto';
        }

        // Actualizar inputs del formulario
        if (currentDragTarget.type === 'button') {
            const row = buttonsContainer.children[currentDragTarget.index];
            if (row) {
                row.querySelector('.btn-pos-left').value = roundedX;
                row.querySelector('.btn-pos-top').value = roundedY;
                row.querySelector('.btn-pos-right').value = '';
                row.querySelector('.btn-pos-bottom').value = '';
            }
        }
    }

    function stopDrag() {
        if (!isDragging) return;
        isDragging = false;
        
        // Ocultar guías
        if (guideV) guideV.style.display = 'none';
        if (guideH) guideH.style.display = 'none';

        if (currentDragTarget) currentDragTarget.el.classList.remove('is-dragging');
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        currentDragTarget = null;
    }

    function resolveAssetUrl(value) {
        if (!value) return '';
        if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:') || value.startsWith('/')) {
            return value;
        }
        return `../${value.replace(/^\.?\//, '')}`;
    }

    function updatePreview() {
        updatePreviewScale();
        const type = typeSelect.value;
        const bg = document.getElementById('background')?.value || '';
        const badge = document.getElementById('badge')?.value || '';
        const title = document.getElementById('title')?.value || '';
        const desc = document.getElementById('description')?.value || '';

        // Background
        previewViewport.style.background = bg || '#ffffff';
        
        // Fields visibility
        const complexFields = document.querySelectorAll('.complex-only');
        if (type === 'simple') {
            complexFields.forEach(f => f.classList.add('hidden'));
            previewImageContainer.style.display = 'none';
            previewBadge.style.display = 'none';
            previewTitle.style.display = 'none';
            previewDescription.style.display = 'none';
        } else {
            complexFields.forEach(f => f.classList.remove('hidden'));
            previewImageContainer.style.display = 'flex';
            previewBadge.style.display = 'inline-block';
            previewTitle.style.display = 'block';
            previewDescription.style.display = 'block';
        }

        previewBadge.textContent = badge || 'Badge';
        previewTitle.innerHTML = title || 'Título del Slider';
        previewDescription.textContent = desc || 'Descripción del slider...';

        // Buttons in preview
        previewButtons.innerHTML = '';
        // Limpiar botones absolutos previos del viewport
        previewViewport.querySelectorAll('.btn-absolute-preview').forEach(b => b.remove());

        const btnRows = buttonsContainer.children;
        Array.from(btnRows).forEach((row, index) => {
            const textInput = row.querySelector('.btn-text');
            const styleInput = row.querySelector('.btn-style');
            const iconInput = row.querySelector('.btn-icon');
            
            if (!textInput || !styleInput || !iconInput) return;

            const text = textInput.value;
            const style = styleInput.value;
            const icon = iconInput.value;
            
            // Los valores en los inputs ya están en el sistema de 1280px
            const top = row.querySelector('.btn-pos-top')?.value || '';
            const left = row.querySelector('.btn-pos-left')?.value || '';
            const right = row.querySelector('.btn-pos-right')?.value || '';
            const bottom = row.querySelector('.btn-pos-bottom')?.value || '';

            if (text) {
                const btn = document.createElement('span');
                let styleClasses = '';
                if (style === 'primary') styleClasses = 'bg-blue-600 text-white shadow-lg shadow-blue-500/30';
                else if (style === 'glass') styleClasses = 'bg-white/20 backdrop-blur-md text-white border border-white/30';
                else if (style === 'outline') styleClasses = 'border-2 border-white text-white hover:bg-white hover:text-blue-600';
                else if (style === 'white') styleClasses = 'bg-white text-slate-900 shadow-xl';

                btn.className = `btn-preview-base transition-all ${styleClasses}`;
                btn.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5"></i> ${text}`;
                
                // Aplicar posicionamiento si existe
                if (top || left || right || bottom) {
                    btn.classList.add('btn-absolute-preview');
                    btn.style.position = 'absolute';
                    
                    // Formatear unidades (añadir px si es número puro)
                    const fmt = (val) => {
                        if (!val) return 'auto';
                        return isNaN(val) ? val : `${val}px`;
                    };

                    btn.style.top = fmt(top);
                    btn.style.left = fmt(left);
                    btn.style.right = fmt(right);
                    btn.style.bottom = fmt(bottom);
                    btn.style.zIndex = '50';
                    previewViewport.appendChild(btn);
                    
                    // Inicializar drag
                    initDraggable(btn, 'button', index);
                } else {
                    btn.style.position = 'relative';
                    previewButtons.appendChild(btn);
                }
            }
        });

        if (window.lucide) lucide.createIcons();

        // Sincronizar con ventana de precisión si está abierta
        if (precisionWindow && !precisionWindow.closed) {
            const buttons = [];
            Array.from(buttonsContainer.children).forEach(row => {
                const getVal = (row, selector) => {
                    const input = row.querySelector(`.${selector}`);
                    const unit = row.querySelector(`.${selector}-unit`);
                    if (!input || input.value === '') return '';
                    return input.value + (unit ? unit.value : 'px');
                };

                buttons.push({
                    text: row.querySelector('.btn-text').value,
                    style: row.querySelector('.btn-style').value,
                    icon: row.querySelector('.btn-icon').value,
                    position_top: getVal(row, 'btn-pos-top'),
                    position_left: getVal(row, 'btn-pos-left'),
                    position_right: getVal(row, 'btn-pos-right'),
                    position_bottom: getVal(row, 'btn-pos-bottom')
                });
            });

            precisionWindow.postMessage({
                type: 'update',
                data: {
                    type,
                    background: bg,
                    badge,
                    title,
                    description: desc,
                    backgroundImage: document.getElementById('url_backgroundImage_actual').value,
                    image: document.getElementById('url_image_actual').value,
                    buttons: buttons
                }
            }, '*');
        }

        // File previews
        const bgInput = document.getElementById('backgroundImage');
        if (bgInput.files && bgInput.files[0]) {
            const reader = new FileReader();
            reader.onload = e => previewBgImage.style.backgroundImage = `url(${e.target.result})`;
            reader.readAsDataURL(bgInput.files[0]);
        } else {
            const actualBg = document.getElementById('url_backgroundImage_actual').value;
            if (actualBg) previewBgImage.style.backgroundImage = `url(${resolveAssetUrl(actualBg)})`;
        }

        const imgInput = document.getElementById('image');
        if (imgInput.files && imgInput.files[0]) {
            const reader = new FileReader();
            reader.onload = e => previewMainImg.src = e.target.result;
            reader.readAsDataURL(imgInput.files[0]);
        } else {
            const actualImg = document.getElementById('url_image_actual').value;
            previewMainImg.src = actualImg ? resolveAssetUrl(actualImg) : '';
        }
    }

    // Input Listeners for real-time preview
    sliderForm.addEventListener('input', (e) => {
        if (e.target.matches('input, textarea, select')) {
            updatePreview();
        }
    });

    sliderForm.addEventListener('change', (e) => {
        if (e.target.matches('input, textarea, select')) {
            updatePreview();
        }
    });

    // File input changes
    document.getElementById('backgroundImage').addEventListener('change', function(e) {
        const fileName = e.target.files[0]?.name || 'Seleccionar fondo...';
        document.getElementById('bg-file-name').textContent = fileName;
        updatePreview();
    });

    document.getElementById('image').addEventListener('change', function(e) {
        const fileName = e.target.files[0]?.name || 'Seleccionar imagen...';
        document.getElementById('image-file-name').textContent = fileName;
        updatePreview();
    });

        // Form Submit
        sliderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Si el select está disabled, FormData no lo captura, así que lo habilitamos temporalmente
            const typeDisabled = typeSelect.disabled;
            if (typeDisabled) typeSelect.disabled = false;
            
            const formData = new FormData(sliderForm);
            
            if (typeDisabled) typeSelect.disabled = true;

            // Add buttons as JSON
            const buttons = [];
            Array.from(buttonsContainer.children).forEach(row => {
                const getVal = (row, selector) => {
                const input = row.querySelector(`.${selector}`);
                const unit = row.querySelector(`.${selector}-unit`);
                if (!input || input.value === '') return '';
                return input.value + (unit ? unit.value : 'px');
            };

                buttons.push({
                    text: row.querySelector('.btn-text').value,
                    url: row.querySelector('.btn-url').value,
                    style: row.querySelector('.btn-style').value,
                    icon: row.querySelector('.btn-icon').value,
                    videoSrc: row.querySelector('.btn-video')?.value || '',
                    position_top: getVal(row, 'btn-pos-top'),
                    position_left: getVal(row, 'btn-pos-left'),
                    position_right: getVal(row, 'btn-pos-right'),
                    position_bottom: getVal(row, 'btn-pos-bottom')
                });
            });
            formData.append('buttons', JSON.stringify(buttons));

            try {
                const response = await fetch('../assets/php/admin/guardarSlider.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.success) {
                    sliderModal.classList.remove('active');
                    loadSliders();
                } else {
                    alert('Error al guardar: ' + result.error);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        });

    // Edit Slider
    window.editSlider = (id) => {
        const slider = allSliders.find(s => s.id == id);
        if (!slider) return;

        sliderForm.reset();
        previewBgImage.style.backgroundImage = '';
        previewMainImg.src = '';
        document.getElementById('slider-id').value = slider.id;
        document.getElementById('type').value = slider.type;
        document.getElementById('orden').value = slider.orden;
        document.getElementById('background').value = slider.background || '';
        document.getElementById('badge').value = slider.badge || '';
        document.getElementById('title').value = slider.title || '';
        document.getElementById('description').value = slider.description || '';
        document.getElementById('url_image_actual').value = slider.image || '';
        document.getElementById('url_backgroundImage_actual').value = slider.backgroundImage || '';
        document.getElementById('activo').value = slider.activo;

        // Restricción de tipo al editar
        // Si el orden es 0, es el complex
        if (slider.orden == 0) {
            typeSelect.value = 'complex';
            typeSelect.disabled = true;
        } else {
            typeSelect.value = 'simple';
            typeSelect.disabled = true;
        }

        buttonsContainer.innerHTML = '';
        if (slider.buttons) {
            slider.buttons.forEach(btn => {
                addButtonRow({
                    text: btn.text,
                    url: btn.url,
                    icon: btn.icon,
                    style: btn.style,
                    videoSrc: btn.videoSrc,
                    position_top: btn.position_top,
                    position_left: btn.position_left,
                    position_right: btn.position_right,
                    position_bottom: btn.position_bottom
                });
            });
        }

        document.getElementById('modal-title').textContent = 'Editar Slider';
        sliderModal.classList.add('active');
        setTimeout(() => {
            updatePreview();
        }, 100);
    };

    // Delete Slider
    window.deleteSlider = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este slider?')) return;
        try {
            const response = await fetch('../assets/php/admin/eliminarSlider.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const result = await response.json();
            if (result.success) loadSliders();
        } catch (error) {
            console.error('Error deleting slider:', error);
        }
    };

    loadSliders();
});
