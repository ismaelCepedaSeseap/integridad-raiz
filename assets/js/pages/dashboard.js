var btnCerrarSession = document.getElementById("cerrarSesion");
if (btnCerrarSession) {
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
}
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
    const sidebarUserRole = document.getElementById('sidebar-user-role');
    const headerUserName = document.getElementById('header-user-name');
    const userNameDisplay = document.getElementById('user-name-display');
    const stateDisplaySidebar = document.getElementById('state-display-sidebar');
    const stateFilterStatus = document.getElementById('state-filter-status');
    const userAvatar = document.getElementById('user-avatar');
    const moduleUsers = document.getElementById('module-users');
    const navUsers = document.getElementById('nav-users');
    const welcomeMessage = document.getElementById('welcome-message');

    if (sidebarUserRole) sidebarUserRole.innerText = currentRole.name;
    if (headerUserName) headerUserName.innerText = `Admin ${currentRole.state.split(' ')[0]}`;
    if (userNameDisplay) userNameDisplay.innerText = currentRole.isSuper ? "Super Admin" : currentRole.state;

    const badges = document.querySelectorAll('.state-badge');
    badges.forEach(b => {
        b.innerText = currentRole.state;
        b.style.background = currentRole.isSuper ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 'linear-gradient(90deg, #475569, #64748b)';
    });

    const stateTexts = document.querySelectorAll('.state-text');
    stateTexts.forEach(t => t.innerText = currentRole.isSuper ? "Nacional" : currentRole.state);

    if (stateDisplaySidebar) stateDisplaySidebar.innerHTML = `<span class="state-badge" style="font-size: 8px;">${currentRole.state}</span>`;
    if (stateFilterStatus) stateFilterStatus.innerText = currentRole.isSuper ? "Nivel Nacional" : `Solo ${currentRole.state}`;

    if (userAvatar) userAvatar.src = currentRole.avatar;

    if (!currentRole.isSuper && moduleUsers) {
        moduleUsers.style.opacity = "0.5";
        moduleUsers.style.pointerEvents = "none";
        if (navUsers) navUsers.classList.add('hidden');
        if (welcomeMessage) welcomeMessage.innerText = `Gestionando la integridad en el estado de ${currentRole.state}`;
    } else {
        if (moduleUsers) {
            moduleUsers.style.opacity = "1";
            moduleUsers.style.pointerEvents = "auto";
        }
        if (navUsers) navUsers.classList.remove('hidden');
        if (welcomeMessage) welcomeMessage.innerText = "Gestión global de la plataforma";
    }

    renderTable();
}

function renderTable() {
    const data = [
        { user: "Juan Pérez", state: "Puebla", text: "Me comprometo a la honestidad.", date: "12 Feb 2026" },
        { user: "María García", state: "Hidalgo", text: "Respeto total a las reglas.", date: "11 Feb 2026" },
        { user: "Carlos Ruiz", state: "Tlaxcala", text: "Transparencia ante todo.", date: "10 Feb 2026" },
        { user: "Elena Solis", state: "Puebla", text: "Justicia para mi comunidad.", date: "09 Feb 2026" },
        { user: "Pedro Infante", state: "Puebla", text: "Ayudar a quien lo necesite.", date: "08 Feb 2026" },
        { user: "Ana Bárbara", state: "Hidalgo", text: "Cuidar los espacios públicos.", date: "08 Feb 2026" },
        { user: "Luis Miguel", state: "Tlaxcala", text: "No copiar en los exámenes.", date: "07 Feb 2026" },
        { user: "Carmen Salinas", state: "Puebla", text: "Reportar actos de corrupción.", date: "06 Feb 2026" },
        { user: "Roberto Gómez", state: "Hidalgo", text: "Ser puntual en mis citas.", date: "05 Feb 2026" },
        { user: "Florinda Meza", state: "Tlaxcala", text: "Respetar las filas.", date: "04 Feb 2026" }
    ];

    const filtered = currentRole.isSuper ? data : data.filter(d => d.state === currentRole.state);
    const tbody = document.getElementById('table-body');
    if (!tbody) return;
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
    if (sidebar) sidebar.classList.toggle('-translate-x-full');
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
