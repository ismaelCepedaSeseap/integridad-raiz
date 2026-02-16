/**
 * Dashboard Logic for Integridad desde la Raíz
 */

// State
let currentUser = null;
let workingData = {
    slider: [],
    states: [],
    cine: [],
    event: []
};
let currentTab = 'slider';
let selectedItemIndex = null;
let previewWindow = null;

// Mock Users (simulated for now, should come from session/DB)
const users = {
    'SUPER': { name: 'Admin Principal', role: 'SUPER', state: 'NACIONAL' },
    'HIDALGO': { name: 'Coord. Hidalgo', role: 'ADMIN', state: 'HIDALGO' },
    'TLAXCALA': { name: 'Coord. Tlaxcala', role: 'ADMIN', state: 'TLAXCALA' }
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Load initial data
    await loadAllData();

    // Initialize Session (Simulated for UI demo)
    // In production, this comes from the PHP session
    currentUser = users['SUPER']; 
    updateUIForUser();

    // Event Listeners
    setupEventListeners();

    // Initial Render
    renderCommitmentsTable();
});

function setupEventListeners() {
    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    document.getElementById('btn-toggle-sidebar')?.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
        sidebarOverlay?.classList.toggle('hidden');
    });

    sidebarOverlay?.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        sidebarOverlay.classList.add('hidden');
    });

    // Navigation


    document.getElementById('nav-general')?.addEventListener('click', (e) => {
        e.preventDefault();
        showDashboardHome();
    });

    // Content Manager
    document.getElementById('btn-back-dashboard')?.addEventListener('click', showDashboardHome);
    
    document.querySelectorAll('.cm-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Actions
    document.getElementById('btn-open-preview')?.addEventListener('click', openPreview);
    document.getElementById('btn-save')?.addEventListener('click', saveCurrentData);
    document.getElementById('btn-new-item')?.addEventListener('click', addItem);
    document.getElementById('btn-delete-item')?.addEventListener('click', deleteSelectedItem);

    // Logout
    document.getElementById('btn-logout')?.addEventListener('click', () => {
        if(confirm('¿Cerrar sesión?')) window.location.href = '../assets/php/security/logout.php';
    });
}

// --- UI Logic ---

function updateUIForUser() {
    if (!currentUser) return;

    const roleDisplay = document.getElementById('sidebar-user-role');
    const nameDisplay = document.getElementById('user-name-display');
    const headerName = document.getElementById('header-user-name');
    const stateBadge = document.getElementById('state-badge-header');

    if(roleDisplay) roleDisplay.textContent = currentUser.role === 'SUPER' ? 'Super Admin' : `Coord. ${currentUser.state}`;
    if(nameDisplay) nameDisplay.textContent = currentUser.name.split(' ')[0];
    if(headerName) headerName.textContent = currentUser.name;
    
    if(stateBadge) {
        stateBadge.textContent = currentUser.state;
        stateBadge.className = `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            currentUser.role === 'SUPER' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        }`;
    }

    // Show/Hide modules based on role
    const moduleUsers = document.getElementById('module-users');
    if (moduleUsers) {
        if (currentUser.role === 'SUPER') {
            moduleUsers.classList.remove('hidden');
        } else {
            moduleUsers.classList.add('hidden');
        }
    }
}

function showDashboardHome() {
    document.getElementById('content-manager').classList.add('hidden');
    document.getElementById('dashboard-home').classList.remove('hidden');
    
    // Update active state in sidebar
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    document.getElementById('nav-general')?.classList.add('active');
}

function showContentManager() {
    document.getElementById('dashboard-home').classList.add('hidden');
    document.getElementById('content-manager').classList.remove('hidden');

    // Update active state in sidebar
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    document.getElementById('nav-events')?.classList.add('active');

    // Refresh current tab
    switchTab(currentTab);
}

// --- Data Logic ---

async function loadAllData() {
    try {
        // In a real app, these would be API endpoints returning JSON
        // For this setup, we are reading the JS files or using an API wrapper
        // We'll try to fetch the JS files and parse them (fallback)
        
        const [sliderRes, statesRes, cineRes, eventRes] = await Promise.all([
            fetch('../js/slider-data.js'),
            fetch('../js/states-data.js'),
            fetch('../js/cine-data.js'),
            fetch('../js/event-data.js')
        ]);

        const getText = async (res) => {
            const text = await res.text();
            // Extract JSON from "const X = [...]"
            const match = text.match(/\[.*\]/s);
            return match ? JSON.parse(match[0]) : [];
        };

        workingData.slider = await getText(sliderRes);
        workingData.states = await getText(statesRes);
        workingData.cine = await getText(cineRes);
        workingData.event = await getText(eventRes);
        
        console.log("Datos cargados:", workingData);

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        // Fallback empty data if files fail
    }
}

function renderCommitmentsTable() {
    const tableBody = document.getElementById('table-body');
    if(!tableBody) return;

    // Mock data for display
    const mockCommitments = [
        { user: 'Juan Pérez', state: 'Hidalgo', type: 'Sembrar', date: '12/02/2026' },
        { user: 'Maria Lopez', state: 'Tlaxcala', type: 'Cuidar', date: '11/02/2026' },
        { user: 'Carlos Ruiz', state: 'Puebla', type: 'Cosechar', date: '10/02/2026' },
    ];

    tableBody.innerHTML = mockCommitments.map(c => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-8 py-4 font-bold text-slate-700">${c.user}</td>
            <td class="px-8 py-4"><span class="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-500">${c.state}</span></td>
            <td class="px-8 py-4 text-green-600 font-bold">${c.type}</td>
            <td class="px-8 py-4 text-slate-400">${c.date}</td>
            <td class="px-8 py-4">
                <button class="text-slate-400 hover:text-blue-600"><i data-lucide="eye" class="w-4 h-4"></i></button>
            </td>
        </tr>
    `).join('');
    
    lucide.createIcons();
}

// --- Content Manager Logic ---

function switchTab(tab) {
    currentTab = tab;
    selectedItemIndex = null;

    // Update Tab UI
    document.querySelectorAll('.cm-tab').forEach(t => {
        if (t.dataset.tab === tab) {
            t.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
            t.classList.add('bg-slate-900', 'text-white', 'border-slate-900');
        } else {
            t.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
            t.classList.remove('bg-slate-900', 'text-white', 'border-slate-900');
        }
    });

    const titles = {
        'slider': 'Slider Principal',
        'cine': 'Cine Foro',
        'event': 'Eventos y Rally'
    };

    const titleEl = document.getElementById('current-section-title');
    if(titleEl) titleEl.textContent = titles[tab] || tab;
    
    renderItemsTable();
    renderItemEditor();
    syncPreview();
}

function renderItemsTable() {
    const container = document.getElementById('items-table-body');
    if(!container) return;

    container.innerHTML = '';
    
    if (!workingData[currentTab] || workingData[currentTab].length === 0) {
        container.innerHTML = `<tr><td class="p-8 text-center text-sm text-slate-400">No hay items en esta sección.</td></tr>`;
        return;
    }

    workingData[currentTab].forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = `border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${selectedItemIndex === index ? 'bg-green-50' : ''}`;
        row.onclick = () => selectItem(index);

        let title = item.title || item.name || `Item #${index + 1}`;
        let subtitle = item.badge || item.slogan || item.type || '';
        
        // Clean up title if it's HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = title;
        title = tempDiv.textContent || tempDiv.innerText || title;

        row.innerHTML = `
            <td class="p-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg ${selectedItemIndex === index ? 'bg-green-200 text-green-700' : 'bg-slate-100 text-slate-500'} flex items-center justify-center transition-colors">
                        <i data-lucide="${getIconForTab(currentTab)}" class="w-4 h-4"></i>
                    </div>
                    <div class="overflow-hidden">
                        <p class="font-bold text-sm text-slate-800 truncate">${title}</p>
                        <p class="text-[10px] text-slate-400 truncate">${subtitle}</p>
                    </div>
                </div>
            </td>
        `;
        container.appendChild(row);
    });
    lucide.createIcons();
}

function getIconForTab(tab) {
    switch(tab) {
        case 'slider': return 'image';
        case 'states': return 'map-pin';
        case 'cine': return 'film';
        case 'event': return 'calendar';
        default: return 'file';
    }
}

function selectItem(index) {
    selectedItemIndex = index;
    renderItemsTable();
    renderItemEditor();
    syncPreview();
    
    const deleteBtn = document.getElementById('btn-delete-item');
    if(deleteBtn) deleteBtn.disabled = false;
}

function renderItemEditor() {
    const container = document.getElementById('editor-container');
    if(!container) return;

    if (selectedItemIndex === null) {
        container.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-slate-300 p-10">
                <i data-lucide="mouse-pointer-click" class="w-12 h-12 mb-4"></i>
                <h3 class="font-bold text-slate-400">Selecciona un item</h3>
                <p class="text-xs">Haz clic en la lista de la izquierda para editar.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    const item = workingData[currentTab][selectedItemIndex];
    let fields = '';

    // Special handling for Slider to switch types
    if (currentTab === 'slider') {
        fields += `
            <div class="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tipo de Slide</label>
                <div class="flex gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="slide-type" value="complex" ${item.type === 'complex' ? 'checked' : ''} onchange="updateSlideType('complex')">
                        <span class="text-sm font-medium text-slate-700">Complejo (Texto + Imagen)</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="slide-type" value="simple" ${item.type === 'simple' ? 'checked' : ''} onchange="updateSlideType('simple')">
                        <span class="text-sm font-medium text-slate-700">Simple (Solo Fondo)</span>
                    </label>
                </div>
            </div>
        `;
    }

    // Generate fields based on item properties
    // We filter properties based on type if it's a slider
    const propertiesToShow = Object.keys(item).filter(key => {
        if (key === 'id' || key === 'type') return false;
        if (currentTab === 'slider') {
            if (item.type === 'simple') {
                return ['backgroundImage', 'buttons'].includes(key);
            } else {
                return ['background', 'badge', 'title', 'description', 'image', 'buttons'].includes(key);
            }
        }
        return true;
    });

    // Add missing properties for the selected type if they don't exist
    if (currentTab === 'slider') {
        if (item.type === 'complex') {
            if (!item.background) item.background = '#ffffff';
            if (!item.badge) item.badge = 'Nuevo';
            if (!item.title) item.title = 'Título';
            if (!item.description) item.description = 'Descripción...';
            if (!item.image) item.image = '';
            ['background', 'badge', 'title', 'description', 'image'].forEach(k => {
                if (!propertiesToShow.includes(k)) propertiesToShow.push(k);
            });
        } else {
            if (!item.backgroundImage) item.backgroundImage = '';
            if (!propertiesToShow.includes('backgroundImage')) propertiesToShow.push('backgroundImage');
        }
    }

    propertiesToShow.forEach(key => {
        const value = item[key] || '';
        let inputType = 'text';
        let inputClass = 'w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all';
        
        if (key === 'buttons') {
             fields += `
                <div class="mb-4">
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Botones (JSON)</label>
                    <textarea rows="4" class="${inputClass} font-mono text-xs" onchange="updateItemField('${key}', JSON.parse(this.value))">${JSON.stringify(value, null, 2)}</textarea>
                    <p class="text-[10px] text-slate-400 mt-1">Edita la estructura JSON de los botones con cuidado.</p>
                </div>
            `;
        } else if (key.includes('image') || key.includes('bg') || key.includes('poster') || key.includes('background')) {
            // Image uploader
            fields += `
                <div class="mb-4">
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">${key}</label>
                    <div class="flex gap-2">
                        <input type="text" id="field-${key}" value="${value}" class="${inputClass} flex-1" onchange="updateItemField('${key}', this.value)">
                        <button class="px-3 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors" onclick="triggerUpload('${key}')">
                            <i data-lucide="upload" class="w-4 h-4 text-slate-600"></i>
                        </button>
                    </div>
                    ${(value && !value.startsWith('linear-gradient') && !value.startsWith('#')) ? `<img src="${value}" class="mt-2 h-20 rounded-lg border border-slate-200 object-cover">` : ''}
                </div>
            `;
        } else if (value.length > 50 || key === 'description' || key === 'synopsis') {
            // Textarea for long text
            fields += `
                <div class="mb-4">
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">${key}</label>
                    <textarea id="field-${key}" rows="3" class="${inputClass}" onchange="updateItemField('${key}', this.value)">${value}</textarea>
                </div>
            `;
        } else {
            // Standard input
            fields += `
                <div class="mb-4">
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">${key}</label>
                    <input type="${inputType}" id="field-${key}" value="${value}" class="${inputClass}" onchange="updateItemField('${key}', this.value)">
                </div>
            `;
        }
    });

    container.innerHTML = `
        <div class="animate-fadeIn">
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 class="font-bold text-lg text-slate-800">Editando Item #${selectedItemIndex + 1}</h3>
                <span class="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">JSON Object</span>
            </div>
            <div class="space-y-2">
                ${fields}
            </div>
        </div>
    `;
    lucide.createIcons();
}

function updateSlideType(type) {
    if (selectedItemIndex !== null && workingData.slider[selectedItemIndex]) {
        workingData.slider[selectedItemIndex].type = type;
        renderItemEditor(); // Re-render to show correct fields
        syncPreview();
    }
}

function updateItemField(key, value) {
    if (selectedItemIndex !== null && workingData[currentTab][selectedItemIndex]) {
        workingData[currentTab][selectedItemIndex][key] = value;
        syncPreview();
        renderItemsTable(); // Refresh list in case title changed
    }
}

function addItem() {
    const newItem = {};
    // Template based on current tab
    if (currentTab === 'slider') {
        newItem.image = 'assets/images/placeholder.jpg';
        newItem.title = 'Nuevo Slide';
        newItem.subtitle = 'Descripción corta';
        newItem.link = '#';
    } else if (currentTab === 'cine') {
        newItem.title = 'Nueva Película';
        newItem.synopsis = 'Sinopsis...';
        newItem.poster = 'assets/images/placeholder.jpg';
        newItem.videoUrl = '';
    } else {
        newItem.title = 'Nuevo Item';
        newItem.description = 'Descripción';
    }

    workingData[currentTab].push(newItem);
    selectItem(workingData[currentTab].length - 1);
}

function deleteSelectedItem() {
    if (selectedItemIndex === null) return;
    
    if (confirm('¿Estás seguro de eliminar este elemento?')) {
        workingData[currentTab].splice(selectedItemIndex, 1);
        selectedItemIndex = null;
        document.getElementById('btn-delete-item').disabled = true;
        renderItemsTable();
        renderItemEditor();
        syncPreview();
    }
}

// --- Preview & Save ---

function getPreviewDataForTab(tab) {
    const data = workingData[tab];
    // For slider, we usually want to see the whole slider to test transitions
    if (tab === 'slider') {
        return { tab, data: data };
    }
    // For others, maybe just the selected one or all depending on the view
    // Returning all for now to be safe
    return { tab, data: data };
}

function syncPreview() {
    if (previewWindow && !previewWindow.closed) {
        const previewData = getPreviewDataForTab(currentTab);
        previewWindow.postMessage({ type: 'UPDATE_PREVIEW', ...previewData }, '*');
    }
}

function openPreview() {
    if (previewWindow && !previewWindow.closed) {
        previewWindow.focus();
        syncPreview();
    } else {
        previewWindow = window.open('admin_preview.html', 'IntegridadPreview', 'width=1200,height=800');
        previewWindow.onload = () => {
            setTimeout(syncPreview, 1000);
        };
    }
}

async function saveCurrentData() {
    const btn = document.getElementById('btn-save');
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Guardando...';
    lucide.createIcons();

    try {
        const response = await fetch('../api/save_data.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slider: workingData.slider,
                states: workingData.states,
                cine: workingData.cine,
                event: workingData.event
            })
        });
        
        const result = await response.json();

        if (result.success) {
            btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> ¡Guardado!';
            btn.classList.remove('bg-slate-900');
            btn.classList.add('bg-green-600');
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.classList.remove('bg-green-600');
                btn.classList.add('bg-slate-900');
                lucide.createIcons();
            }, 2000);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar: ' + error.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// --- File Upload Mock ---
function triggerUpload(key) {
    // In a real implementation, this would trigger a hidden file input
    // For now, we'll prompt for a URL
    const url = prompt("Ingresa la URL de la imagen/video:");
    if (url) {
        updateItemField(key, url);
        // Refresh editor to show new image
        renderItemEditor();
    }
}
