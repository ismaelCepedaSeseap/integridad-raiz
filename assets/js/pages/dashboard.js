var btnCerrarSession = document.getElementById("cerrarSesion");
btnCerrarSession.addEventListener("click", async function () {
    Swal.fire({
        title: "¿Está seguro de cerrar sesión?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, ¡estoy seguro!",
        cancelButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            cerrarSesion();

        }
    });

});
lucide.createIcons();

// Configuración de Roles y Estados
const ROLES = {
    SUPER: {
        name: "Super Usuario",
        state: "Puebla (Sede)",
        isSuper: true,
        color: "#16a34a",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    },
    HIDALGO: {
        name: "Gestor Estatal",
        state: "Hidalgo",
        isSuper: false,
        color: "#9333ea",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hidalgo"
    },
    TLAXCALA: {
        name: "Gestor Estatal",
        state: "Tlaxcala",
        isSuper: false,
        color: "#ea580c",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tlaxcala"
    }
};

let currentRole = ROLES.SUPER;

function setUserRole(roleKey) {
    currentRole = ROLES[roleKey];
    updateDashboardUI();
}

function updateDashboardUI() {
    // Actualizar textos de estado
    document.getElementById('sidebar-user-role').innerText = currentRole.name;
    document.getElementById('header-user-name').innerText = `Admin ${currentRole.state.split(' ')[0]}`;
    document.getElementById('user-name-display').innerText = currentRole.isSuper ? "Super Admin" : currentRole.state;

    const badges = document.querySelectorAll('.state-badge');
    badges.forEach(b => {
        b.innerText = currentRole.state;
        b.style.background = currentRole.isSuper ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 'linear-gradient(90deg, #475569, #64748b)';
    });

    const stateTexts = document.querySelectorAll('.state-text');
    stateTexts.forEach(t => t.innerText = currentRole.isSuper ? "Nacional" : currentRole.state);

    document.getElementById('state-display-sidebar').innerHTML = `<span class="state-badge" style="font-size: 8px;">${currentRole.state}</span>`;
    document.getElementById('state-filter-status').innerText = currentRole.isSuper ? "Nivel Nacional" : `Solo ${currentRole.state}`;

    document.getElementById('user-avatar').src = currentRole.avatar;

    // Restricción de módulos: Solo Super Admin ve gestión de otros usuarios
    const moduleUsers = document.getElementById('module-users');
    const navUsers = document.getElementById('nav-users');
    if (!currentRole.isSuper) {
        moduleUsers.style.opacity = "0.5";
        moduleUsers.style.pointerEvents = "none";
        navUsers.classList.add('hidden');
        document.getElementById('welcome-message').innerText = `Gestionando la integridad en el estado de ${currentRole.state}`;
    } else {
        moduleUsers.style.opacity = "1";
        moduleUsers.style.pointerEvents = "auto";
        navUsers.classList.remove('hidden');
        document.getElementById('welcome-message').innerText = "Gestión global de la plataforma";
    }

    renderTable();
}

function renderTable() {
    const data = [
        { user: "Juan Pérez", state: "Puebla", text: "Me comprometo a la honestidad.", date: "12 Feb 2026" },
        { user: "María García", state: "Hidalgo", text: "Respeto total a las reglas.", date: "11 Feb 2026" },
        { user: "Carlos Ruiz", state: "Tlaxcala", text: "Transparencia ante todo.", date: "10 Feb 2026" },
        { user: "Elena Solis", state: "Puebla", text: "Justicia para mi comunidad.", date: "09 Feb 2026" }
    ];

    const filtered = currentRole.isSuper ? data : data.filter(d => d.state === currentRole.state);
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = filtered.map(item => `
                <tr>
                    <td class="px-8 py-4 font-bold">${item.user}</td>
                    <td class="px-8 py-4 text-slate-500">${item.state}</td>
                    <td class="px-8 py-4 italic text-slate-400">"${item.text}"</td>
                    <td class="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase">${item.date}</td>
                    <td class="px-8 py-4">
                        <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">Válido</span>
                    </td>
                </tr>
            `).join('');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('-translate-x-full');
}

async function cerrarSesion() {
    fetch("../assets/php/cerrarSesion.php", {
        method: "POST"
    })
        .then(response => response.text())
        .then(data => {
            window.location.href = "../login.php";
        });

}

updateDashboardUI();
