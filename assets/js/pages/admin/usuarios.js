
lucide.createIcons();

let usuarios = []; // Variable global para almacenar usuarios

async function renderUsuarios() {
    try {
        usuarios = await obtenerUsuarios();
    } catch (e) {
        console.error("Error al obtener usuarios:", e);
        return;
    }

    const tbody = document.getElementById('user-table-body');
    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">No hay usuarios registrados</td></tr>';
        return;
    }

    tbody.innerHTML = usuarios.map(u => `
                <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-8 py-4">
                        <div class="flex items-center gap-3">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.nombre)}" class="w-10 h-10 rounded-xl bg-slate-100">
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
                            <div class="w-2 h-2 rounded-full ${u.usuarioActivo == 1 ? 'bg-green-500' : 'bg-red-500'}"></div>
                            <span class="text-xs font-bold ${u.usuarioActivo == 1 ? 'text-green-600' : 'text-red-600'}">${u.usuarioActivo == 1 ? 'Activo' : 'Inactivo'}</span>
                        </div>
                    </td>
                    <td class="px-8 py-4">
                        <div class="flex justify-center gap-2">
                            <button onclick="editarUsuario(${u.usuarioId})" class="btn-action p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white">
                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                            </button>
                            <button onclick="eliminarUsuario(${u.usuarioId})" class="btn-action p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
    lucide.createIcons();
}

async function abrirModalUsuario(usuario = null) {
    const isEdit = !!usuario;
    const title = isEdit ? 'Editar Usuario' : 'Registrar Nuevo Usuario';
    const icon = isEdit ? 'edit-3' : 'user-plus';
    const confirmBtnText = isEdit ? 'Guardar Cambios' : 'Confirmar Registro';
    const endpoint = isEdit ? '../assets/php/admin/actualizarUsuario.php' : '../assets/php/admin/insertarUsuario.php';

    const { value: formValues } = await Swal.fire({
        title: `<div class="flex items-center gap-3 justify-center pb-2 border-b border-slate-100 text-slate-800"><i data-lucide="${icon}" class="text-green-600"></i> ${title}</div>`,
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
                                <input id="swal-name" value="${isEdit ? usuario.nombreReal : ''}" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm" placeholder="Ej. Juan">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-500 mb-1 ml-1">Primer Apellido</label>
                                <input id="swal-ap1" value="${isEdit ? usuario.primerApellido : ''}" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm" placeholder="Pérez">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 mb-1 ml-1">Segundo Apellido</label>
                                <input id="swal-ap2" value="${isEdit ? usuario.segundoApellido : ''}" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm" placeholder="García">
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
                                <input id="swal-email" type="email" value="${isEdit ? usuario.correo : ''}" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="usuario@puebla.gob.mx">
                            </div>
                        </div>
                         <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1 ml-1">Contraseña ${isEdit ? '<span class="text-xs font-normal text-slate-400">(Dejar en blanco para mantener actual)</span>' : ''}</label>
                            <div class="relative">
                                <i data-lucide="key" class="absolute left-3 top-3 w-4 h-4 text-slate-400"></i>
                                <input id="swal-password" type="password" class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="********">
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
                                ${await optionCatalogo("estados")}
                            </select>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-500 mb-1 ml-1">Rol de Usuario</label>
                                <select id="swal-role" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm cursor-pointer">
                                    ${await optionCatalogo("roles")}
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 mb-1 ml-1">Estatus</label>
                                <select id="swal-active" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm cursor-pointer">
                                    <option value="true">Activo ✅</option>
                                    <option value="false">Inactivo ❌</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        didOpen: () => {
            lucide.createIcons();
            if (isEdit) {
                document.getElementById('swal-state').value = usuario.estadoId;
                document.getElementById('swal-role').value = usuario.rolId;
                document.getElementById('swal-active').value = usuario.usuarioActivo == 1 ? 'true' : 'false';
            }
        },
        confirmButtonText: confirmBtnText,
        confirmButtonColor: '#16a34a',
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
            const password = document.getElementById('swal-password').value;

            if (!nombre || !ap1 || !email) {
                Swal.showValidationMessage('Los campos nombre, primer apellido y email son obligatorios');
                return false;
            }

            if (!isEdit && !password) {
                Swal.showValidationMessage('La contraseña es obligatoria para nuevos usuarios');
                return false;
            }

            return {
                id: isEdit ? usuario.usuarioId : null,
                nombre: nombre,
                apellido1: ap1,
                apellido2: document.getElementById('swal-ap2').value,
                email: email,
                password: password,
                estado: document.getElementById('swal-state').value,
                rol: document.getElementById('swal-role').value,
                activo: document.getElementById('swal-active').value === 'true'
            }
        }
    });

    if (formValues) {
        // Enviar a la BD
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formValues)
            });

            const result = await response.json();

            if (result.status === 'success') {
                renderUsuarios(); // Recargar lista
                
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
                Toast.fire({
                    icon: 'success',
                    title: isEdit ? 'Usuario actualizado exitosamente' : 'Usuario registrado exitosamente'
                });
            } else {
                Swal.fire('Error', result.message || 'Error al guardar', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    }
}


async function eliminarUsuario(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará el usuario permanentemente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch("../assets/php/admin/eliminarUsuario.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: id })
                });
                const res = await response.json();
                if(res.status === 'success') {
                    renderUsuarios();
                    Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
                } else {
                    Swal.fire('Error', res.message || 'No se pudo eliminar', 'error');
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Error de conexión', 'error');
            }
        }
    });
}

async function editarUsuario(id) {
    const user = usuarios.find(u => u.usuarioId == id);
    if (!user) return;
    abrirModalUsuario(user);
}

// Inicialización
document.addEventListener('DOMContentLoaded', renderUsuarios);

async function obtenerUsuarios() {
    try {
        const respuesta = await fetch("../assets/php/admin/obtenerUsuarios.php", {
            method: "POST", // Aunque sea obtener, a veces se usa POST por seguridad o costumbre en este proyecto
        });
        return await respuesta.json();
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

async function optionCatalogo(tipo) {
    let url = "";
    if (tipo === "estados") url = "../assets/php/catalogos/obtenerEstados.php";
    else if (tipo === "roles") url = "../assets/php/catalogos/obtenerRoles.php";
    else return "";

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.map(item => `<option value="${item.id}">${item.nombre}</option>`).join('');
    } catch (e) {
        console.error(`Error loading ${tipo}:`, e);
        return `<option value="">Error cargando ${tipo}</option>`;
    }
}
