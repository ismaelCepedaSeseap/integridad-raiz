document.addEventListener('DOMContentLoaded', () => {
    // Referencias DOM
    const tableBody = document.getElementById('guardianes-table-body');
    const searchInput = document.getElementById('search-input');
    const filterState = document.getElementById('filter-state');
    const btnAdd = document.getElementById('btn-add-guardian');
    const modal = document.getElementById('guardian-modal');
    const deleteModal = document.getElementById('delete-modal');
    const form = document.getElementById('guardian-form');
    const modalTitle = document.getElementById('modal-title');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');
    
    // Referencias Preview
    const previewVideo = document.getElementById('preview-video');
    const previewSlogan = document.getElementById('preview-slogan');
    const previewState = document.getElementById('preview-state');
    const sloganInput = document.getElementById('slogan');
    const stateSelect = document.getElementById('estado_id');
    const posterInput = document.getElementById('poster');
    const videoInput = document.getElementById('video');
    const posterFileName = document.getElementById('poster-file-name');
    const videoFileName = document.getElementById('video-file-name');

    // Estado local
    let guardianes = [];
    let deleteId = null;
    
    // Paginación
    let currentPage = 1;
    let itemsPerPage = 10;
    
    // Referencias Paginación
    const showingCount = document.getElementById('showing-count');
    const totalCount = document.getElementById('total-count');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const itemsPerPageSelect = document.getElementById('items-per-page');
    const paginationNumbers = document.getElementById('pagination-numbers');

    // Inicialización
    init();

    function init() {
        lucide.createIcons();
        loadStates();
        loadGuardianes();
        setupEventListeners();
    }

    function setupEventListeners() {
        // Búsqueda y Filtros
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderTable();
        });
        filterState.addEventListener('change', () => {
            currentPage = 1;
            renderTable();
        });

        // Paginación
        itemsPerPageSelect.addEventListener('change', () => {
            itemsPerPage = parseInt(itemsPerPageSelect.value);
            currentPage = 1;
            renderTable();
        });

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

        // Modal Formulario
        btnAdd.addEventListener('click', () => openModal());
        
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        // Submit Formulario
        form.addEventListener('submit', handleFormSubmit);

        // Confirmar Eliminación
        btnConfirmDelete.addEventListener('click', executeDelete);

        // Listeners para Preview en tiempo real
        sloganInput.addEventListener('input', updatePreview);
        stateSelect.addEventListener('change', updatePreview);
        
        posterInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                posterFileName.textContent = file.name;
                const url = URL.createObjectURL(file);
                previewVideo.poster = url;
            }
        });

        videoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                videoFileName.textContent = file.name;
                const url = URL.createObjectURL(file);
                previewVideo.src = url;
                previewVideo.play();
            }
        });
    }

    function updatePreview() {
        const rawSlogan = sloganInput.value.trim();
        // Si ya tiene comillas, no las duplicamos, pero si no las tiene, las agregamos
        let slogan = rawSlogan || 'Slogan del guardián...';
        if (rawSlogan && !slogan.startsWith('"')) slogan = `"${slogan}`;
        if (rawSlogan && !slogan.endsWith('"')) slogan = `${slogan}"`;
        
        previewSlogan.textContent = slogan.toUpperCase();
        
        const selectedOption = stateSelect.options[stateSelect.selectedIndex];
        previewState.textContent = selectedOption && selectedOption.value ? selectedOption.textContent.toUpperCase() : 'ESTADO';
    }

    async function loadStates() {
        try {
            const response = await fetch('../assets/php/obtenerEstados.php');
            if (response.ok) {
                const data = await response.json();
                const select = document.getElementById('estado_id');
                const filter = document.getElementById('filter-state');
                
                select.innerHTML = '<option value="">Seleccione un estado</option>';
                filter.innerHTML = '<option value="">Todos los estados</option>';

                const states = data.flatMap(region => region.states);
                states.sort((a, b) => a.name.localeCompare(b.name));

                states.forEach(state => {
                    const option = document.createElement('option');
                    option.value = state.id;
                    option.textContent = state.name;
                    select.appendChild(option);

                    const filterOption = option.cloneNode(true);
                    filter.appendChild(filterOption);
                });
            }
        } catch (error) {
            console.error('Error cargando estados:', error);
        }
    }

    async function loadGuardianes() {
        try {
            const response = await fetch('../assets/php/admin/obtenerGuardianes.php');
            if (response.ok) {
                guardianes = await response.json();
                renderTable();
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    }

    function getFilteredData() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterState.value;

        return guardianes.filter(g => {
            const matchesSearch = 
                g.estado_nombre.toLowerCase().includes(searchTerm) || 
                g.slogan.toLowerCase().includes(searchTerm);
            const matchesFilter = filterValue ? g.estado_id == filterValue : true;
            return matchesSearch && matchesFilter;
        });
    }

    function renderTable() {
        const filtered = getFilteredData();
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

        tableBody.innerHTML = pageItems.map(g => `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="py-4"><span class="font-bold text-slate-700">${g.estado_nombre}</span></td>
                <td class="py-4 text-slate-600 max-w-xs truncate">${g.slogan}</td>
                <td class="py-4">
                    <div class="h-10 w-16 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                        <img src="../${g.poster_src}" class="h-full w-full object-cover" alt="Poster">
                    </div>
                </td>
                <td class="py-4">
                    ${g.video_src ? 
                        '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider"><i data-lucide="check-circle" class="w-3 h-3"></i> Disponible</span>' : 
                        '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider"><i data-lucide="x-circle" class="w-3 h-3"></i> Faltante</span>'}
                </td>
                <td class="py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${g.activo == 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}">
                        ${g.activo == 1 ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="py-4">
                    <div class="flex items-center gap-2">
                        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all btn-edit" data-id="${g.id}">
                            <i data-lucide="edit-2" class="w-4 h-4"></i>
                        </button>
                        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all btn-delete" data-id="${g.id}">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        lucide.createIcons();

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => openModal(btn.dataset.id));
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => confirmDelete(btn.dataset.id));
        });
    }

    function renderPaginationNumbers(totalPages) {
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

    function openModal(id = null) {
        form.reset();
        document.getElementById('guardian-id').value = '';
        posterFileName.textContent = 'Seleccionar poster...';
        videoFileName.textContent = 'Seleccionar video...';
        
        // Reset preview
        previewVideo.src = '';
        previewVideo.poster = '';
        
        if (id) {
            const guardian = guardianes.find(g => g.id == id);
            if (guardian) {
                modalTitle.textContent = 'Editar Guardián';
                document.getElementById('guardian-id').value = guardian.id;
                document.getElementById('estado_id').value = guardian.estado_id;
                document.getElementById('slogan').value = guardian.slogan;
                document.getElementById('activo').value = guardian.activo;
                
                // Cargar datos actuales en preview
                previewVideo.poster = `../${guardian.poster_src}`;
                previewVideo.src = `../${guardian.video_src}`;
                previewVideo.play();
            }
        } else {
            modalTitle.textContent = 'Nuevo Guardián';
        }
        
        updatePreview();
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        deleteModal.classList.remove('active');
        previewVideo.pause();
    }

    function confirmDelete(id) {
        deleteId = id;
        deleteModal.classList.add('active');
    }

    async function executeDelete() {
        if (!deleteId) return;
        try {
            const response = await fetch('../assets/php/admin/eliminarGuardian.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deleteId })
            });
            if (response.ok) {
                closeModal();
                loadGuardianes();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const id = document.getElementById('guardian-id').value;
        
        if (!id && (!formData.get('video').size || !formData.get('poster').size)) {
            alert('Para nuevos registros, el video y el poster son obligatorios.');
            return;
        }

        try {
            const response = await fetch('../assets/php/admin/guardarGuardian.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (response.ok && result.success) {
                closeModal();
                loadGuardianes();
            } else {
                alert(result.error || 'Error al guardar');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});