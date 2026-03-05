lucide.createIcons();

let usuarios = []; // Variable global para almacenar usuarios

document.addEventListener('DOMContentLoaded', () => {
    initUsuarios();
});

async function initUsuarios() {
    usuarios = await obtenerUsuarios();
    if (!Array.isArray(usuarios)) {
        usuarios = [];
    }
    poblarFiltroEstados();
    renderUsuarios();
    setupEventListeners();
}

function renderUsuarios(data = usuarios) {
    const tbody = document.getElementById('user-table-body');
    const legacyList = document.getElementById('users-list');
    const container = tbody || legacyList;
    if (!container) {
        return;
    }
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = tbody
            ? `
                <tr>
                    <td colspan="5" class="px-8 py-8 text-center text-slate-400">No hay usuarios para mostrar</td>
                </tr>
            `
            : `<div class="px-8 py-8 text-center text-slate-400">No hay usuarios para mostrar</div>`;
        return;
    }
    if (tbody) {
        tbody.innerHTML = data.map(u => `
                <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-8 py-4">
                        <div class="flex items-center gap-3">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${u.nombre}" class="w-10 h-10 rounded-xl bg-slate-100">
                            <div>
                                <p class="font-bold text-slate-900">${u.nombre}</p>
                                <p class="text-xs text-slate-400">${u.correo}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-8 py-4">
                        <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold uppercase tracking-wider">${u.rolNombre}</span>
                    </td>
                    <td class="px-8 py-4 font-medium text-slate-600">${u.estadoNombre}</td>
                    <td class="px-8 py-4">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full ${u.usuarioActivo ? 'bg-green-500' : 'bg-red-500'}"></div>
                            <span class="text-xs font-bold ${u.usuarioActivo ? 'text-green-600' : 'text-red-600'}">${u.usuarioActivo ? 'Activo' : 'Inactivo'}</span>
                        </div>
                    </td>
                    <td class="px-8 py-4">
                        <div class="flex justify-center gap-2">
                            <button onclick="editarUsuario('${u.usuarioId}')" class="btn-action p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white">
                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                            </button>
                            <button onclick="eliminarUsuario('${u.usuarioId}')" class="btn-action p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
    } else {
        legacyList.innerHTML = data.map(u => `
            <div class="p-4 border-b border-slate-100 flex flex-col gap-3">
                <div class="flex items-center gap-3">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${u.nombre}" class="w-10 h-10 rounded-xl bg-slate-100">
                    <div>
                        <p class="font-bold text-slate-900">${u.nombre}</p>
                        <p class="text-xs text-slate-400">${u.correo}</p>
                    </div>
                </div>
                <div class="flex items-center justify-between text-sm">
                    <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold uppercase tracking-wider">${u.rolNombre}</span>
                    <span class="font-medium text-slate-600">${u.estadoNombre}</span>
                    <span class="text-xs font-bold ${u.usuarioActivo ? 'text-green-600' : 'text-red-600'}">${u.usuarioActivo ? 'Activo' : 'Inactivo'}</span>
                </div>
                <div class="flex justify-end gap-2">
                    <button onclick="editarUsuario('${u.usuarioId}')" class="btn-action p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white">
                        <i data-lucide="edit-3" class="w-4 h-4"></i>
                    </button>
                    <button onclick="eliminarUsuario('${u.usuarioId}')" class="btn-action p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    lucide.createIcons();
}

function poblarFiltroEstados() {
    const filterSelect = document.getElementById('filter-state');
    if (!filterSelect) {
        return;
    }
    const estados = [...new Set(usuarios.map(u => u.estadoNombre).filter(Boolean))];
    filterSelect.innerHTML = '<option value="">Todos los estados</option>' +
        estados.map(estado => `<option value="${estado}">${estado}</option>`).join('');
}

function setupEventListeners() {
    const addUserBtn = document.getElementById('btn-add-user');
    const searchInput = document.getElementById('search-users');
    const filterSelect = document.getElementById('filter-state');

    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => abrirModalUsuario());
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = usuarios.filter(u => 
                u.nombre.toLowerCase().includes(term) || 
                u.correo.toLowerCase().includes(term)
            );
            renderUsuarios(filtered);
        });
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            const state = e.target.value;
            const filtered = state 
                ? usuarios.filter(u => u.estadoNombre === state)
                : usuarios;
            renderUsuarios(filtered);
        });
    }
}

async function abrirModalUsuario(user = null) {

    const isEdit = !!user;
    const title = isEdit 
        ? '<div class="flex items-center gap-3 justify-center pb-2 border-b border-slate-100 text-slate-800"><i data-lucide="edit" class="text-blue-600"></i> Editar Usuario</div>'
        : '<div class="flex items-center gap-3 justify-center pb-2 border-b border-slate-100 text-slate-800"><i data-lucide="user-plus" class="text-green-600"></i> Registrar Nuevo Usuario</div>';

    const confirmText = isEdit ? 'Guardar Cambios' : 'Confirmar Registro';
    const confirmColor = isEdit ? '#3b82f6' : '#16a34a';

    const { value: formValues } = await Swal.fire({
        title: title,
        html: `
            <div class="text-left mt-6 px-2 max-h-[75vh] overflow-y-auto hide-scrollbar">
                
                <div class="mb-6">
                    <p class="text-[10px] font-black uppercase tracking-widest text-green-600 mb-4 flex items-center gap-2">
                        <i data-lucide="info" class="w-3 h-3"></i> Información Personal
                    </p>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1 ml-1">Nombre(s)</label>
                            <div class="relative">
                                <i data-lucide="user" class="absolute left-3 top-3 w-4 h-4 text-slate-400"></i>
                                <input id="swal-name" value="${user ? user.nombreReal : ''}" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm" placeholder="Ej. Juan">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-500 mb-1 ml-1">Primer Apellido</label>
                                <input id="swal-ap1" value="${user ? user.primerApellido : ''}" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm" placeholder="Pérez">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 mb-1 ml-1">Segundo Apellido</label>
                                <input id="swal-ap2" value="${user ? user.segundoApellido : ''}" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm" placeholder="García">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-6">
                    <p class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2">
                        <i data-lucide="lock" class="w-3 h-3"></i> Credenciales y Acceso
                    </p>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1 ml-1">Correo Electrónico</label>
                            <div class="relative">
                                <i data-lucide="mail" class="absolute left-3 top-3 w-4 h-4 text-slate-400"></i>
                                <input id="swal-email" value="${user ? user.correo : ''}" type="email" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="usuario@puebla.gob.mx">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-2">
                    <p class="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-4 flex items-center gap-2">
                        <i data-lucide="settings-2" class="w-3 h-3"></i> Atribuciones del Perfil
                    </p>
                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1 ml-1">Estado Regional</label>
                            <select id="swal-state" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm appearance-none cursor-pointer">
                                ${await optionCatalogo("estados", user ? user.estadoId : null)}
                            </select>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-500 mb-1 ml-1">Rol de Usuario</label>
                                <select id="swal-role" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm cursor-pointer">
                                    ${await optionCatalogo("roles", user ? user.rolId : null)}
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 mb-1 ml-1">Estatus</label>
                                <select id="swal-active" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm cursor-pointer">
                                    <option value="1" ${user && user.usuarioActivo == 1 ? 'selected' : ''}>Activo ✅</option>
                                    <option value="0" ${user && user.usuarioActivo == 0 ? 'selected' : ''}>Inactivo ❌</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        didOpen: () => {
            // Esto es necesario para renderizar los iconos dentro del modal de SweetAlert
            lucide.createIcons();
        },
        confirmButtonText: confirmText,
        confirmButtonColor: confirmColor,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        buttonsStyling: true,
        customClass: {
            popup: 'rounded-[30px] border-0 shadow-2xl',
            confirmButton: 'rounded-2xl px-6 py-3 font-bold text-sm',
            cancelButton: 'rounded-2xl px-6 py-3 font-bold text-sm bg-slate-100 text-slate-500 hover:bg-slate-200 border-0'
        },
        preConfirm: () => {
            const nombre = document.getElementById('swal-name').value;
            const ap1 = document.getElementById('swal-ap1').value;
            const email = document.getElementById('swal-email').value;

            if (!nombre || !ap1 || !email) {
                Swal.showValidationMessage('Los campos con * son obligatorios');
                return false;
            }

            return {
                id: isEdit ? user.usuarioId : null,
                nombre: nombre,
                apellido1: ap1,
                apellido2: document.getElementById('swal-ap2').value,
                email: email,
                estado: document.getElementById('swal-state').value,
                rol: document.getElementById('swal-role').value,
                activo: parseInt(document.getElementById('swal-active').value)
            }
        }
    });

    if (formValues && formValues.nombre) {
        const nombreCompleto = `${formValues.nombre} ${formValues.apellido1} ${formValues.apellido2}`.trim();
        
        try {
            // Mostrar loading
            Swal.fire({
                title: 'Guardando...',
                text: 'Por favor espere',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const url = isEdit ? '../assets/php/admin/actualizarUsuario.php' : '../assets/php/admin/insertarUsuario.php';
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues)
            });
            
            const result = await response.json();

            if (result.status === 'success') {
                // Recargar datos del servidor para asegurar consistencia (especialmente nombres de roles/estados)
                usuarios = await obtenerUsuarios();
                renderUsuarios();

                if (isEdit) {
                    Swal.fire('Actualizado', 'Información guardada correctamente', 'success');
                } else {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    });
                    Toast.fire({
                        icon: 'success',
                        title: 'Usuario registrado exitosamente'
                    });
                }
            } else {
                Swal.fire('Error', result.message || 'No se pudo guardar la información', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión con el servidor', 'error');
        }
    }
}

function eliminarUsuario(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción desactivará el acceso al usuario.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Sí, dar de baja',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            usuarios = usuarios.filter(u => u.usuarioId != id);
            renderUsuarios();
            Swal.fire('Eliminado', 'El usuario ha sido dado de baja.', 'success');
        }
    });
}

function editarUsuario(id) {
    const user = usuarios.find(u => u.usuarioId == id);
    if (user) {
        abrirModalUsuario(user);
    }
}

// Inicialización
// document.addEventListener('DOMContentLoaded', renderUsuarios); // Ya agregado arriba

async function obtenerUsuarios() {
    try {
        const respuesta = await fetch("../assets/php/admin/obtenerUsuarios.php", {
            method: "POST",
        });
        return await respuesta.json();
    }
    catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo conectar con el servidor de validación.", "error");
    }
}

async function obtenerEstados() {
    try {
        const respuesta = await fetch("../assets/php/catalogos/obtenerEstados.php", {
            method: "POST",
        });
        return await respuesta.json();
    }
    catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo conectar con el servidor de validación.", "error");
    }
}

async function obtenerRoles() {
    try {
        const respuesta = await fetch("../assets/php/catalogos/obtenerRoles.php", {
            method: "POST",
        });
        return await respuesta.json();
    }
    catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo conectar con el servidor de validación.", "error");
    }
}


async function optionCatalogo(catalogo, selectedId = null){
    var valor = null;
    if(catalogo=="estados"){
        valor = await obtenerEstados();
    }
    if(catalogo=="roles"){
        valor = await obtenerRoles();
    }
    var option = "";
    valor.forEach(element => {
        const selected = (selectedId && element.id == selectedId) ? 'selected' : '';
        option += `<option value='${element.id}' ${selected}>${element.nombre}</option>`;
    });
    return option;
}
