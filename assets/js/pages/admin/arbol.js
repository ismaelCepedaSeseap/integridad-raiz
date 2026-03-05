document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('tips-table-body');
    const searchInput = document.getElementById('search-input');
    const btnAdd = document.getElementById('btn-add-tip');
    const modal = document.getElementById('tip-modal');
    const form = document.getElementById('tip-form');
    const modalTitle = document.getElementById('modal-title');
    const btnCloseList = document.querySelectorAll('.btn-close-modal');
    const inputId = document.getElementById('tip-id');
    const inputTema = document.getElementById('tip-tema');
    const inputConsejo = document.getElementById('tip-consejo');
    const inputOrden = document.getElementById('tip-orden');
    const inputActivo = document.getElementById('tip-activo');
    const btnLogout = document.getElementById('btn-logout');

    // Preview Elements
    const previewTema = document.getElementById('preview-tema');
    const previewConsejo = document.getElementById('preview-consejo');

    // Pagination elements
    const showingCount = document.getElementById('showing-count');
    const totalCount = document.getElementById('total-count');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const paginationNumbers = document.getElementById('pagination-numbers');
    const itemsPerPageSelect = document.getElementById('items-per-page');

    let tips = [];
    let currentPage = 1;
    let itemsPerPage = 10;

    init();

    async function init() {
        lucide.createIcons();
        await loadTips();
        setupEvents();
    }

    function setupEvents() {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderTable();
        });
        btnAdd.addEventListener('click', () => openModal());
        btnCloseList.forEach(btn => btn.addEventListener('click', closeModal));
        form.addEventListener('submit', handleSave);
        btnLogout.addEventListener('click', logout);
        
        // Live Preview Listeners
        inputTema.addEventListener('input', updatePreview);
        inputConsejo.addEventListener('input', updatePreview);
        
        btnPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
        
        btnNext.addEventListener('click', () => {
            const totalPages = Math.ceil(getFilteredTips().length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });

        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', () => {
                itemsPerPage = parseInt(itemsPerPageSelect.value);
                currentPage = 1;
                renderTable();
            });
        }
    }

    function updatePreview() {
        previewTema.textContent = inputTema.value.trim() || 'TEMA';
        const consejo = inputConsejo.value.trim() || 'El consejo aparecerá aquí';
        previewConsejo.textContent = `"${consejo}"`;
    }

    async function loadTips() {
        try {
            const response = await fetch('../assets/php/admin/obtener_frutos.php');
            const json = await response.json();
            if (!response.ok || !json.exito) {
                throw new Error(json.error || 'No se pudieron cargar los frutos');
            }
            tips = json.datos;
            renderTable();
        } catch (error) {
            alert(error.message || 'Error al cargar');
        }
    }

    function getFilteredTips() {
        const q = searchInput.value.trim().toLowerCase();
        return tips.filter(t => {
            const topic = (t.tema || '').toLowerCase();
            const text = (t.consejo || '').toLowerCase();
            return topic.includes(q) || text.includes(q);
        });
    }

    function renderTable() {
        const filtered = getFilteredTips();
        const total = filtered.length;
        const totalPages = Math.ceil(total / itemsPerPage);
        
        // Ensure valid page
        if (currentPage > totalPages) currentPage = totalPages || 1;
        if (currentPage < 1) currentPage = 1;
        
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = filtered.slice(start, end);

        // Update stats
        if (total === 0) {
            showingCount.textContent = '0-0';
            totalCount.textContent = '0';
            btnPrev.disabled = true;
            btnNext.disabled = true;
            paginationNumbers.innerHTML = '';
        } else {
            showingCount.textContent = `${start + 1}-${Math.min(end, total)}`;
            totalCount.textContent = total;
            btnPrev.disabled = currentPage === 1;
            btnNext.disabled = currentPage === totalPages;
            renderPaginationNumbers(totalPages);
        }

        tableBody.innerHTML = pageData.map(t => `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="py-4 text-slate-400 font-mono text-xs">#${t.id}</td>
                <td class="py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shadow-sm border border-yellow-200">
                            <i data-lucide="sprout" class="w-5 h-5"></i>
                        </div>
                        <div class="flex flex-col">
                            <span class="font-bold text-slate-700 text-sm">${escapeHtml(t.tema)}</span>
                            <span class="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Fruto #${t.orden}</span>
                        </div>
                    </div>
                </td>
                <td class="py-4 max-w-[350px]">
                    <p class="text-sm text-slate-600 line-clamp-2 leading-relaxed" title="${escapeHtml(t.consejo)}">
                        ${escapeHtml(t.consejo)}
                    </p>
                </td>
                <td class="py-4 text-center">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm border border-slate-200">
                        ${t.orden}
                    </span>
                </td>
                <td class="py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${t.activo ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}">
                        ${t.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="py-4">
                    <div class="flex items-center gap-2">
                        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all btn-edit" data-id="${t.id}" title="Editar">
                            <i data-lucide="edit-2" class="w-4 h-4"></i>
                        </button>
                        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all btn-delete" data-id="${t.id}" title="Eliminar">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Empty state
        if (pageData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="py-12 text-center text-slate-400">
                        <div class="flex flex-col items-center gap-3">
                            <i data-lucide="search-x" class="w-12 h-12 text-slate-200"></i>
                            <p>No se encontraron frutos que coincidan con la búsqueda.</p>
                        </div>
                    </td>
                </tr>
            `;
        }

        tableBody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.id);
                const tip = tips.find(item => item.id === id);
                if (tip) {
                    openModal(tip);
                }
            });
        });

        tableBody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = Number(btn.dataset.id);
                await deleteTip(id);
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

    function openModal(tip = null) {
        if (tip) {
            modalTitle.textContent = 'Editar Fruto';
            inputId.value = tip.id;
            inputTema.value = tip.tema;
            inputConsejo.value = tip.consejo;
            inputOrden.value = tip.orden;
            inputActivo.value = tip.activo ? '1' : '0';
        } else {
            modalTitle.textContent = 'Nuevo Fruto';
            inputId.value = '';
            inputTema.value = '';
            inputConsejo.value = '';
            inputOrden.value = String((tips[tips.length - 1]?.orden || tips.length) + 1);
            inputActivo.value = '1';
        }
        updatePreview();
        modal.classList.add('active');
        lucide.createIcons();
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    async function handleSave(event) {
        event.preventDefault();

        const payload = {
            id: inputId.value ? Number(inputId.value) : 0,
            tema: inputTema.value.trim(),
            consejo: inputConsejo.value.trim(),
            orden: Number(inputOrden.value) || 0,
            activo: Number(inputActivo.value) === 0 ? 0 : 1
        };

        try {
            const response = await fetch('../assets/php/admin/guardar_fruto.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json = await response.json();
            if (!response.ok || !json.exito) {
                throw new Error(json.error || 'No se pudo guardar');
            }
            closeModal();
            await loadTips();
        } catch (error) {
            alert(error.message || 'Error al guardar');
        }
    }

    async function deleteTip(id) {
        if (!confirm('¿Seguro que deseas eliminar este fruto?')) {
            return;
        }
        try {
            const response = await fetch('../assets/php/admin/eliminar_fruto.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const json = await response.json();
            if (!response.ok || !json.exito) {
                throw new Error(json.error || 'No se pudo eliminar');
            }
            await loadTips();
        } catch (error) {
            alert(error.message || 'Error al eliminar');
        }
    }

    async function logout() {
        try {
            await fetch('../assets/php/security/logout.php', { method: 'POST' });
        } catch (error) {
        } finally {
            window.location.href = '../login.php';
        }
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }
});
