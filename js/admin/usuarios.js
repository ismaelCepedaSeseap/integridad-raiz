// Lógica de Administración de Usuarios
// Depende de users-data.js (USERS, ROLES, ESTADOS)

document.addEventListener('DOMContentLoaded', () => {
    initUserAdmin();
});

// State
let usersList = [...USERS]; // Copia local para manipulación
let currentFilter = 'all';
let currentSearch = '';

function initUserAdmin() {
    // Inicializar Sidebar Toggle (Mobile)
    const btnToggle = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (btnToggle) {
        btnToggle.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
            overlay.classList.toggle('is-visible');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('is-open');
            overlay.classList.remove('is-visible');
        });
    }

    // Cargar filtros de roles
    populateRoleFilter();

    // Renderizar lista inicial
    renderUsers();

    // Event Listeners
    setupEventListeners();
    
    lucide.createIcons();
}

function populateRoleFilter() {
    const filterSelect = document.getElementById('filter-role');
    if (!filterSelect) return;
    
    ROLES.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.nombre;
        filterSelect.appendChild(option);
    });
}

function setupEventListeners() {
    // Búsqueda
    const searchInput = document.getElementById('search-users');
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        renderUsers();
    });

    // Filtro
    const filterSelect = document.getElementById('filter-role');
    filterSelect.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderUsers();
    });

    // Botón Nuevo Usuario
    const btnAdd = document.getElementById('btn-add-user');
    btnAdd.addEventListener('click', () => {
        openModal();
    });

    // Botones Modal
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-modal').addEventListener('click', closeModal);
    document.getElementById('btn-save-user').addEventListener('click', saveUser);
}

function renderUsers() {
    const container = document.getElementById('users-list');
    if (!container) return;

    // Filtrar
    let filtered = usersList.filter(user => {
        const matchesSearch = 
            user.nombre.toLowerCase().includes(currentSearch) || 
            user.primerApellido.toLowerCase().includes(currentSearch) ||
            user.correo.toLowerCase().includes(currentSearch);
            
        const matchesFilter = currentFilter === 'all' || user.rol == currentFilter;
        
        return matchesSearch && matchesFilter;
    });

    // Actualizar contadores
    document.getElementById('showing-count').textContent = filtered.length;
    document.getElementById('total-count').textContent = usersList.length;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="users" class="empty-icon"></i>
                <p>No se encontraron usuarios.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    // Generar HTML
    container.innerHTML = filtered.map(user => {
        const roleName = getRoleName(user.rol);
        const stateName = getStateName(user.estado);
        const fullName = `${user.nombre} ${user.primerApellido} ${user.segundoApellido || ''}`.trim();
        const statusClass = user.activo ? 'status-active' : 'status-inactive';
        const statusText = user.activo ? 'Activo' : 'Inactivo';

        return `
            <div class="item-table__row users-grid">
                <div class="col font-mono text-xs text-slate-400">#${user.id}</div>
                <div class="col font-bold text-slate-700">${fullName}</div>
                <div class="col text-sm text-slate-600">${user.correo}</div>
                <div class="col">
                    <span class="badge badge-role">${roleName}</span>
                </div>
                <div class="col text-sm text-slate-500">${stateName}</div>
                <div class="col">
                    <span class="status-indicator ${statusClass}">${statusText}</span>
                </div>
                <div class="col col-actions">
                    <button class="btn-icon-sm" onclick="editUser(${user.id})" title="Editar">
                        <i data-lucide="edit-2"></i>
                    </button>
                    <button class="btn-icon-sm text-red-500" onclick="deleteUser(${user.id})" title="Eliminar">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

// --- MODAL & FORM LOGIC ---

let editingUserId = null;

window.openModal = function(userId = null) {
    const modal = document.getElementById('modal-user');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('user-form');
    
    editingUserId = userId;
    
    if (userId) {
        title.textContent = 'Editar Usuario';
        const user = usersList.find(u => u.id === userId);
        renderFormFields(user);
    } else {
        title.textContent = 'Nuevo Usuario';
        renderFormFields();
    }
    
    modal.classList.remove('hidden');
    // Animación simple
    setTimeout(() => modal.querySelector('.modal').classList.add('scale-100'), 10);
}

function closeModal() {
    const modal = document.getElementById('modal-user');
    modal.classList.add('hidden');
    editingUserId = null;
}

window.editUser = function(userId) {
    openModal(userId);
}

window.deleteUser = function(userId) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        usersList = usersList.filter(u => u.id !== userId);
        renderUsers();
    }
}

function renderFormFields(user = {}) {
    const form = document.getElementById('user-form');
    
    // Generar opciones de Roles
    const roleOptions = ROLES.map(r => 
        `<option value="${r.id}" ${user.rol == r.id ? 'selected' : ''}>${r.nombre}</option>`
    ).join('');

    // Generar opciones de Estados
    const stateOptions = ESTADOS.map(s => 
        `<option value="${s.id}" ${user.estado == s.id ? 'selected' : ''}>${s.nombre}</option>`
    ).join('');

    const html = `
        <div class="form-grid">
            <div class="form-group">
                <label>Nombre *</label>
                <input type="text" class="form-control" name="nombre" value="${user.nombre || ''}" required>
            </div>
            <div class="form-group">
                <label>Primer Apellido *</label>
                <input type="text" class="form-control" name="primerApellido" value="${user.primerApellido || ''}" required>
            </div>
            <div class="form-group">
                <label>Segundo Apellido</label>
                <input type="text" class="form-control" name="segundoApellido" value="${user.segundoApellido || ''}">
            </div>
            <div class="form-group">
                <label>Correo Electrónico *</label>
                <input type="email" class="form-control" name="correo" value="${user.correo || ''}" required>
            </div>
            <div class="form-group">
                <label>Contraseña ${user.id ? '(Dejar vacío para no cambiar)' : '*'}</label>
                <input type="password" class="form-control" name="pass" placeholder="********">
            </div>
            <div class="form-group">
                <label>Rol</label>
                <select class="form-control" name="rol">
                    ${roleOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Estado</label>
                <select class="form-control" name="estado">
                    ${stateOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Estatus</label>
                <div class="checkbox-wrapper">
                    <label>
                        <input type="checkbox" name="activo" ${user.activo !== false ? 'checked' : ''}>
                        Usuario Activo
                    </label>
                </div>
            </div>
        </div>
    `;
    
    form.innerHTML = html;
}

function saveUser() {
    const form = document.getElementById('user-form');
    const formData = new FormData(form);
    
    // Validación básica
    const nombre = formData.get('nombre');
    const primerApellido = formData.get('primerApellido');
    const correo = formData.get('correo');
    
    if (!nombre || !primerApellido || !correo) {
        alert('Por favor completa los campos obligatorios (*).');
        return;
    }

    const userData = {
        nombre: nombre,
        primerApellido: primerApellido,
        segundoApellido: formData.get('segundoApellido'),
        correo: correo,
        rol: parseInt(formData.get('rol')),
        estado: parseInt(formData.get('estado')),
        activo: formData.get('activo') === 'on'
    };

    // Manejo de contraseña (simulado)
    const pass = formData.get('pass');
    if (pass) {
        userData.pass = pass; // En real sería hash
    } else if (editingUserId) {
        // Mantener pass anterior
        const existing = usersList.find(u => u.id === editingUserId);
        userData.pass = existing.pass;
    } else {
        alert('La contraseña es obligatoria para nuevos usuarios.');
        return;
    }

    if (editingUserId) {
        // Actualizar
        const index = usersList.findIndex(u => u.id === editingUserId);
        if (index !== -1) {
            usersList[index] = { ...usersList[index], ...userData };
        }
    } else {
        // Crear nuevo
        const newId = Math.max(...usersList.map(u => u.id), 0) + 1;
        usersList.push({ id: newId, ...userData });
    }

    closeModal();
    renderUsers();
    
    // Opcional: Mostrar feedback de guardado (en consola por ahora)
    console.log('Usuarios guardados (simulado):', usersList);
}
