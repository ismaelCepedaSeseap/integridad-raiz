document.addEventListener('DOMContentLoaded', () => {
    // Referencias DOM
    const tableBody = document.getElementById('estados-table-body');
    const searchInput = document.getElementById('search-input');
    const btnAdd = document.getElementById('btn-add-estado');
    const modal = document.getElementById('estado-modal');
    const form = document.getElementById('estado-form');
    const modalTitle = document.getElementById('modal-title');
    const socialContainer = document.getElementById('social-container');
    const btnAddSocial = document.getElementById('btn-add-social');

    // Preview Elements
    const previewName = document.getElementById('preview-name');
    const previewLogo = document.getElementById('preview-logo-img');
    const previewLink = document.getElementById('preview-link');
    const previewSocials = document.getElementById('preview-socials');

    // Inputs for Preview
    const inputName = document.getElementById('nombre'); 
    const inputLogo = document.getElementById('url_logo'); // Ahora es FILE
    const inputLogoActual = document.getElementById('url_logo_actual');
    const inputLink = document.getElementById('url_sitio');

    // Catálogo de estados mexicanos
    const estadosMexico = [
        "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", 
        "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", 
        "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", 
        "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", 
        "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
    ];

    let estados = [];
    let redesCatalog = [];
    let currentPage = 1;
    let itemsPerPage = 10;
    const showingCount = document.getElementById('showing-count');
    const totalCount = document.getElementById('total-count');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const itemsPerPageSelect = document.getElementById('items-per-page');
    const paginationNumbers = document.getElementById('pagination-numbers');

    // Helper: Asegurar que la URL tenga protocolo
    function ensureProtocol(url) {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
            return url;
        }
        return 'https://' + url;
    }

    function normalizeActivo(value) {
        if (typeof value === 'boolean') return value ? 1 : 0;
        if (typeof value === 'number') return value ? 1 : 0;
        if (typeof value === 'string') {
            if (value === '\u0001') return 1;
            if (value.length === 1) return value.charCodeAt(0) === 1 ? 1 : 0;
            const normalized = value.trim().toLowerCase();
            if (normalized === '1' || normalized === 'true') return 1;
            return 0;
        }
        return 0;
    }

    init();

    function init() {
        lucide.createIcons();
        loadRedesCatalog();
        loadEstados();
        setupEventListeners();
    }

    function setupEventListeners() {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderTable();
        });
        btnAdd.addEventListener('click', () => openModal());
        
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        form.addEventListener('submit', handleFormSubmit);
        btnAddSocial.addEventListener('click', () => addSocialRow());

        inputName.addEventListener('change', updatePreview);
        inputLink.addEventListener('input', updatePreview);

        // Previsualización de imagen al seleccionar archivo
        inputLogo.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewLogo.src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                updatePreview(); // Vuelve al logo actual o default
            }
        });

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
    }

    async function loadRedesCatalog() {
        try {
            const response = await fetch('../assets/php/admin/obtenerRedesSociales.php');
            if (response.ok) {
                redesCatalog = await response.json();
            }
        } catch (error) {
            console.error('Error cargando catálogo de redes:', error);
        }
    }

    async function loadEstados() {
        try {
            const response = await fetch('../assets/php/admin/obtenerEstadosAdmin.php');
            if (response.ok) {
                const estadosResponse = await response.json();
                estados = Array.isArray(estadosResponse)
                    ? estadosResponse.map(estado => ({
                        ...estado,
                        activo: normalizeActivo(estado.activo)
                    }))
                    : [];
                renderTable();
            }
        } catch (error) {
            console.error('Error cargando estados:', error);
        }
    }

    function getFilteredData() {
        const searchTerm = searchInput.value.toLowerCase();
        return estados.filter(e => e.activo === 1 && e.nombre.toLowerCase().includes(searchTerm));
    }

    function renderTable() {
        const filtered = getFilteredData();
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalItems === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-slate-500">No hay estados disponibles</td></tr>';
            showingCount.textContent = '0-0';
            totalCount.textContent = '0';
            btnPrev.disabled = true;
            btnNext.disabled = true;
            paginationNumbers.innerHTML = '';
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

        renderPaginationNumbers(totalPages);

        tableBody.innerHTML = pageItems.map(e => `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="py-4">
                    <div class="h-10 w-16 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center">
                        <img src="../${e.url_logo || 'assets/images/logo.png'}" class="h-full w-full object-contain" alt="${e.nombre}" onerror="this.src='../assets/images/logo.png'">
                    </div>
                </td>
                <td class="py-4"><span class="font-bold text-slate-700">${e.nombre}</span></td>
                <td class="py-4">
                    ${e.url_sitio ? `<a href="${e.url_sitio}" target="_blank" class="text-blue-600 font-semibold hover:underline">Ver sitio</a>` : '<span class="text-slate-500">-</span>'}
                </td>
                <td class="py-4">
                    <div class="flex gap-2">
                        ${renderSocialIcons(e.redes_sociales)}
                    </div>
                </td>
                <td class="py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${e.activo === 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}">
                        ${e.activo === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="py-4">
                    <div class="flex items-center gap-2">
                        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all btn-edit" data-id="${e.id}" title="Editar">
                            <i data-lucide="edit-2" class="w-4 h-4"></i>
                        </button>
                        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all btn-delete" data-id="${e.id}" title="Eliminar">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const estado = estados.find(st => st.id == id);
                if (estado) openModal(estado);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                await deleteEstado(id);
            });
        });

        lucide.createIcons();
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

    function renderSocialIcons(socials) {
        if (!socials || socials.length === 0) return '<span class="text-slate-500 text-xs">Sin redes</span>';
        return socials.map(s => {
            let iconName = 'link';
            const key = s.clave.toLowerCase();
            if (key.includes('facebook')) iconName = 'facebook';
            else if (key.includes('twitter') || key.includes('x')) iconName = 'twitter';
            else if (key.includes('instagram')) iconName = 'instagram';
            else if (key.includes('youtube')) iconName = 'youtube';
            
            const fullUrl = ensureProtocol(s.url);
            
            return `<a href="${fullUrl}" target="_blank" title="${s.nombre}" class="text-slate-500 hover:text-blue-500">
                <i data-lucide="${iconName}" style="width: 16px; height: 16px;"></i>
            </a>`;
        }).join('');
    }

    function openModal(estado = null) {
        modalTitle.textContent = estado ? 'Editar Estado' : 'Nuevo Estado';
        document.getElementById('estado-id').value = estado ? estado.id : '';
        
        inputName.innerHTML = '<option value="">Seleccione un estado</option>';
        const nombresActivos = estados
            .filter(e => e.activo === 1 && (!estado || e.id != estado.id))
            .map(e => e.nombre);

        estadosMexico.forEach(nombre => {
            if (!nombresActivos.includes(nombre)) {
                const option = document.createElement('option');
                option.value = nombre;
                option.textContent = nombre;
                if (estado && estado.nombre === nombre) option.selected = true;
                inputName.appendChild(option);
            }
        });

        if (estado && !Array.from(inputName.options).some(opt => opt.value === estado.nombre)) {
            const option = document.createElement('option');
            option.value = estado.nombre;
            option.textContent = estado.nombre;
            option.selected = true;
            inputName.appendChild(option);
        }

        inputLink.value = estado ? estado.url_sitio : '';
        inputLogo.value = ''; // Limpiar input file
        inputLogoActual.value = estado ? estado.url_logo : '';
        document.getElementById('activo').value = estado ? String(normalizeActivo(estado.activo)) : '1';

        socialContainer.innerHTML = '';
        if (estado && estado.redes_sociales) {
            estado.redes_sociales.forEach(red => {
                addSocialRow(red.red_social_id, red.url);
            });
        } else {
            addSocialRow();
        }

        updatePreview();
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    function addSocialRow(redId = '', url = '') {
        const div = document.createElement('div');
        div.className = 'flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 group transition-all hover:border-blue-200';
        
        const select = document.createElement('select');
        select.className = 'w-1/3 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer';
        select.name = 'social_network[]';
        
        select.innerHTML = '<option value="">Red</option>';
        redesCatalog.forEach(red => {
            const option = document.createElement('option');
            option.value = red.id;
            option.textContent = red.nombre;
            if (red.id == redId) option.selected = true;
            select.appendChild(option);
        });

        const inputUrl = document.createElement('input');
        inputUrl.type = 'text';
        inputUrl.className = 'flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 focus:ring-2 focus:ring-blue-500/20 outline-none placeholder:text-slate-400';
        inputUrl.placeholder = 'URL del perfil';
        inputUrl.value = url;
        inputUrl.addEventListener('input', updatePreview);

        const btnRemove = document.createElement('button');
        btnRemove.type = 'button';
        btnRemove.className = 'p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors';
        btnRemove.innerHTML = '<i data-lucide="trash-2" class="w-4 h-4"></i>';
        btnRemove.onclick = () => {
            div.remove();
            updatePreview();
        };

        div.appendChild(select);
        div.appendChild(inputUrl);
        div.appendChild(btnRemove);
        socialContainer.appendChild(div);
        
        select.addEventListener('change', updatePreview);
        lucide.createIcons();
    }

    function updatePreview() {
        previewName.textContent = inputName.value || 'Nombre del Estado';
        
        // Si hay un archivo seleccionado, el listener de 'change' ya se encargó
        // Si no, mostramos el logo actual o el default
        if (!inputLogo.files[0]) {
            const currentLogo = inputLogoActual.value;
            if (currentLogo) {
                previewLogo.src = currentLogo.startsWith('http') || currentLogo.startsWith('../') ? currentLogo : '../' + currentLogo;
            } else {
                previewLogo.src = '../assets/images/logo.png';
            }
        }

        if (inputLink.value) {
            previewLink.href = ensureProtocol(inputLink.value);
            // En el diseño del sitio público, el link es el contenedor del logo
        } else {
            previewLink.href = '#';
        }

        previewSocials.innerHTML = '';
        
        const socialIcons = {
            facebook: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
            twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768m2.464-2.464l6.768-6.768"/></svg>',
            instagram: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
            tiktok: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>',
            youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>',
            spotify: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5-1 4-1 4 1 4 1"/><path d="M7 11.5s2-1.5 5-1.5 5 1.5 5 1.5"/><path d="M6 9s2.5-2 6-2 6 2 6 2"/></svg>'
        };

        const rows = socialContainer.children;
        Array.from(rows).forEach(row => {
            const select = row.querySelector('select');
            const url = row.querySelector('input').value;
            const redId = select.value;

            if (redId && url) {
                const redInfo = redesCatalog.find(r => r.id == redId);
                if (redInfo) {
                    const key = redInfo.clave.toLowerCase();
                    let iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'; // Default globe
                    
                    if (key.includes('facebook')) iconSVG = socialIcons.facebook;
                    else if (key.includes('twitter') || key.includes('x')) iconSVG = socialIcons.twitter;
                    else if (key.includes('instagram')) iconSVG = socialIcons.instagram;
                    else if (key.includes('tiktok')) iconSVG = socialIcons.tiktok;
                    else if (key.includes('youtube')) iconSVG = socialIcons.youtube;
                    else if (key.includes('spotify')) iconSVG = socialIcons.spotify;

                    const a = document.createElement('a');
                    a.href = ensureProtocol(url);
                    a.target = '_blank';
                    a.className = 'w-4 h-4 text-slate-400 hover:text-green-800 hover:scale-110 transition-all';
                    a.innerHTML = iconSVG;
                    previewSocials.appendChild(a);
                }
            }
        });
    }

    async function deleteEstado(id) {
        if (!confirm('¿Seguro que deseas eliminar este estado?')) return;
        try {
            const response = await fetch('../assets/php/admin/eliminarEstado.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const result = await response.json();
            if (!response.ok || result.error) {
                throw new Error(result.error || 'No se pudo eliminar');
            }
            loadEstados();
        } catch (error) {
            alert(error.message || 'Error al eliminar');
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Usar FormData para enviar el archivo
        const formData = new FormData();
        formData.append('id', document.getElementById('estado-id').value);
        formData.append('nombre', inputName.value);
        formData.append('url_sitio', ensureProtocol(inputLink.value));
        formData.append('url_logo_actual', inputLogoActual.value);
        formData.append('activo', document.getElementById('activo').value);

        // Archivo de logo
        if (inputLogo.files[0]) {
            formData.append('logo', inputLogo.files[0]);
        }

        // Redes sociales como JSON
        const redes_sociales = [];
        const rows = socialContainer.children;
        Array.from(rows).forEach(row => {
            const select = row.querySelector('select');
            const url = row.querySelector('input').value;
            if (select.value && url) {
                redes_sociales.push({
                    red_social_id: select.value,
                    url: ensureProtocol(url)
                });
            }
        });
        formData.append('redes_sociales', JSON.stringify(redes_sociales));

        // DEBUG: Imprimir contenido de FormData
        console.log('--- Contenido de FormData ---');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: [Archivo] ${value.name} (${value.size} bytes)`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }
        console.log('-----------------------------');

        try {
            const response = await fetch('../assets/php/admin/guardarEstado.php', {
                method: 'POST',
                body: formData // Fetch maneja automáticamente el Content-Type para FormData
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    closeModal();
                    loadEstados();
                } else {
                    alert('Error: ' + (result.error || 'Desconocido'));
                }
            } else {
                alert('Error de servidor');
            }
        } catch (error) {
            console.error('Error guardando:', error);
            alert('Error de conexión');
        }
    }
});
