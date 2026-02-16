<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrador de Contenidos - Integridad desde la Raíz</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/pages/shared.css">
    <link rel="stylesheet" href="assets/css/pages/admin.css">
</head>
<body class="bg-slate-100 h-screen flex overflow-hidden">

    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col">
        <div class="p-6 border-b border-slate-800">
            <h1 class="text-xl font-bold flex items-center gap-2">
                <i data-lucide="layout-dashboard" class="text-emerald-500"></i>
                Admin Panel
            </h1>
            <p class="text-xs text-slate-400 mt-1">Integridad desde la Raíz</p>
        </div>
        <nav class="flex-1 p-4 space-y-2">
            <button onclick="switchTab('slider')" class="nav-btn w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-3 transition-colors text-slate-300 hover:text-white" id="btn-slider">
                <i data-lucide="images"></i> Slider Principal
            </button>
            <button onclick="switchTab('states')" class="nav-btn w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-3 transition-colors text-slate-300 hover:text-white" id="btn-states">
                <i data-lucide="map"></i> Estados y Redes
            </button>
            <button onclick="switchTab('cine')" class="nav-btn w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-3 transition-colors text-slate-300 hover:text-white" id="btn-cine">
                <i data-lucide="film"></i> Cine Integridad
            </button>
            <button onclick="switchTab('event')" class="nav-btn w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-3 transition-colors text-slate-300 hover:text-white" id="btn-event">
                <i data-lucide="calendar"></i> Último Evento
            </button>
        </nav>
        <div class="p-4 border-t border-slate-800">
            <a href="index.html" target="_blank" class="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300">
                <i data-lucide="external-link" class="w-4 h-4"></i> Ver sitio en vivo
            </a>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full overflow-hidden">
        <!-- Toolbar -->
        <header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 flex-shrink-0 z-10">
            <h2 class="text-lg font-bold text-slate-800" id="current-section-title">Slider Principal</h2>
            <div class="flex items-center gap-4">
                <button onclick="openPreview()" class="text-slate-500 hover:text-emerald-600 font-bold text-sm flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors border border-slate-200 hover:border-emerald-200">
                    <i data-lucide="external-link" class="w-4 h-4"></i> Abrir Vista Previa
                </button>
                <div class="h-6 w-px bg-slate-200 mx-2"></div>
                <span id="save-status" class="text-sm font-medium text-slate-400 transition-opacity opacity-0">Guardado</span>
                <button onclick="saveCurrentData()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95">
                    <i data-lucide="save" class="w-4 h-4"></i> Guardar Cambios
                </button>
            </div>
        </header>

        <!-- Workspace -->
        <div class="flex-1 flex overflow-hidden p-6 justify-center bg-slate-100">
            
            <!-- Editor (Centered) -->
            <div class="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                <div class="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 class="font-bold text-slate-700">Editor de Contenido</h3>
                    <button onclick="addItem()" class="text-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1 rounded-md shadow-sm flex items-center gap-1" id="add-btn">
                        <i data-lucide="plus" class="w-3 h-3"></i> Agregar Item
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto p-6 space-y-6" id="editor-container">
                    <!-- Forms generated via JS -->
                </div>
            </div>

        </div>
    </main>

    <!-- Scripts -->
    <script src="assets/js/data/slider-data.js"></script>
    <script src="assets/js/data/states-data.js"></script>
    <script src="assets/js/data/cine-data.js"></script>
    <script src="assets/js/data/events-data.js"></script>
    <script src="assets/js/data/event-data.js"></script>

    <script>
        // Global State
        let currentTab = 'slider';
        let workingData = {
            slider: JSON.parse(JSON.stringify(sliderData)),
            states: JSON.parse(JSON.stringify(statesData)),
            cine: JSON.parse(JSON.stringify(cineData)),
            event: JSON.parse(JSON.stringify(eventsList))
        };
        let previewWindow = null;

        // Init
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
            switchTab('slider');
        });

        function switchTab(tab) {
            currentTab = tab;
            
            // Update UI
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('bg-emerald-600', 'text-white');
                btn.classList.add('text-slate-300');
            });
            const activeBtn = document.getElementById(`btn-${tab}`);
            activeBtn.classList.remove('text-slate-300', 'hover:bg-slate-800');
            activeBtn.classList.add('bg-emerald-600', 'text-white');

            // Titles
            const titles = {
                'slider': 'Slider Principal',
                'states': 'Estados y Redes Sociales',
                'cine': 'Cine de la Integridad',
                'event': 'Último Evento'
            };
            document.getElementById('current-section-title').innerText = titles[tab];

            // Show/Hide Add Button
            const addBtn = document.getElementById('add-btn');
            addBtn.style.display = (tab === 'event') ? 'none' : 'flex'; 

            renderEditor();
            syncPreview();
        }

        function openPreview() {
            if (previewWindow && !previewWindow.closed) {
                previewWindow.focus();
            } else {
                previewWindow = window.open('admin_preview.html', 'IntegridadPreview', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
            }
            // Give it a moment to load then sync
            setTimeout(syncPreview, 1000);
        }

        // Exposed for the popup to call on load
        window.getPreviewData = () => {
            return { tab: currentTab, data: workingData[currentTab] };
        };

        function syncPreview() {
            if (previewWindow && !previewWindow.closed) {
                // Try postMessage for robustness
                previewWindow.postMessage({
                    type: 'UPDATE_PREVIEW',
                    tab: currentTab,
                    data: workingData[currentTab]
                }, '*');
                
                // Direct access fallback (same origin)
                if (previewWindow.updatePreview) {
                    previewWindow.updatePreview(currentTab, workingData[currentTab]);
                }
            }
        }

        function renderEditor() {
            const container = document.getElementById('editor-container');
            container.innerHTML = '';

            const data = workingData[currentTab];

            if (currentTab === 'slider') {
                data.forEach((slide, index) => {
                    const el = document.createElement('div');
                    el.className = 'border border-slate-200 rounded-xl p-5 bg-slate-50 relative group transition-all hover:shadow-md item-form';
                    el.innerHTML = `
                        <button onclick="removeItem(${index})" class="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                        <div class="space-y-4">
                            <h4 class="text-xs font-bold text-slate-400 uppercase">Slide #${index + 1}</h4>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
                                <select class="w-full rounded-lg border border-slate-300 p-2 text-sm" onchange="updateItem(${index}, 'type', this.value)">
                                    <option value="complex" ${slide.type === 'complex' ? 'selected' : ''}>Complejo (Texto + Imagen)</option>
                                    <option value="simple" ${slide.type === 'simple' ? 'selected' : ''}>Simple (Solo Imagen)</option>
                                </select>
                            </div>
                            ${slide.type === 'complex' ? `
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Badge</label>
                                <input type="text" value="${slide.badge || ''}" class="w-full rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'badge', this.value)">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Título</label>
                                <input type="text" value="${(slide.title || '').replace(/"/g, '&quot;')}" class="w-full rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'title', this.value)">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                                <textarea class="w-full rounded-lg border border-slate-300 p-2 text-sm" rows="2" oninput="updateItem(${index}, 'description', this.value)">${slide.description || ''}</textarea>
                            </div>
                            ` : ''}
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Imagen ${slide.type === 'simple' ? 'de Fondo' : ''}</label>
                                <div class="flex gap-2">
                                    <input type="text" value="${slide.image || slide.backgroundImage || ''}" class="flex-1 rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, '${slide.type === 'simple' ? 'backgroundImage' : 'image'}', this.value)">
                                    <label class="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-2 rounded-lg flex items-center justify-center transition-colors">
                                        <i data-lucide="upload" class="w-4 h-4"></i>
                                        <input type="file" class="hidden" onchange="uploadImage(this, ${index}, '${slide.type === 'simple' ? 'backgroundImage' : 'image'}')">
                                    </label>
                                </div>
                            </div>
                        </div>
                    `;
                    container.appendChild(el);
                });
            } else if (currentTab === 'states') {
                data.forEach((state, index) => {
                    const el = document.createElement('div');
                    el.className = 'border border-slate-200 rounded-xl p-5 bg-slate-50 relative group transition-all hover:shadow-md item-form';
                    el.innerHTML = `
                         <button onclick="removeItem(${index})" class="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                         <div class="space-y-4">
                            <h4 class="text-xs font-bold text-slate-400 uppercase">Estado: ${state.name}</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre</label>
                                    <input type="text" value="${state.name}" class="w-full rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'name', this.value)">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">ID</label>
                                    <input type="text" value="${state.id}" class="w-full rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'id', this.value)">
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Logo URL</label>
                                <div class="flex gap-2">
                                    <input type="text" value="${state.logo}" class="flex-1 rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'logo', this.value)">
                                    <label class="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-2 rounded-lg flex items-center justify-center transition-colors">
                                        <i data-lucide="upload" class="w-4 h-4"></i>
                                        <input type="file" class="hidden" onchange="uploadImage(this, ${index}, 'logo')">
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Enlace Sitio Web</label>
                                <input type="text" value="${state.url}" class="w-full rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'url', this.value)">
                            </div>
                            <div class="bg-white p-3 rounded-lg border border-slate-200">
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Redes Sociales</label>
                                <div class="space-y-2" id="socials-${index}">
                                    ${state.socials.map((social, sIndex) => `
                                        <div class="flex gap-2 items-center">
                                            <select class="w-24 rounded border border-slate-300 p-1 text-xs" onchange="updateSocial(${index}, ${sIndex}, 'icon', this.value)">
                                                <option value="facebook" ${social.icon === 'facebook' ? 'selected' : ''}>FB</option>
                                                <option value="twitter_x" ${social.icon === 'twitter_x' ? 'selected' : ''}>X</option>
                                                <option value="instagram" ${social.icon === 'instagram' ? 'selected' : ''}>IG</option>
                                                <option value="youtube" ${social.icon === 'youtube' ? 'selected' : ''}>YT</option>
                                                <option value="tiktok" ${social.icon === 'tiktok' ? 'selected' : ''}>TK</option>
                                                <option value="spotify" ${social.icon === 'spotify' ? 'selected' : ''}>SP</option>
                                            </select>
                                            <input type="text" value="${social.url}" class="flex-1 rounded border border-slate-300 p-1 text-xs" placeholder="URL" oninput="updateSocial(${index}, ${sIndex}, 'url', this.value)">
                                            <button onclick="removeSocial(${index}, ${sIndex})" class="text-red-400 hover:text-red-600"><i data-lucide="x" class="w-3 h-3"></i></button>
                                        </div>
                                    `).join('')}
                                </div>
                                <button onclick="addSocial(${index})" class="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1">+ Agregar Red</button>
                            </div>
                         </div>
                    `;
                    container.appendChild(el);
                });
            } else if (currentTab === 'cine') {
                data.forEach((item, index) => {
                    const el = document.createElement('div');
                    el.className = 'border border-slate-200 rounded-xl p-5 bg-slate-50 relative group transition-all hover:shadow-md item-form';
                    el.innerHTML = `
                        <button onclick="removeItem(${index})" class="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                        <div class="space-y-4">
                            <h4 class="text-xs font-bold text-slate-400 uppercase">Video: ${item.name}</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre</label>
                                    <input type="text" value="${item.name}" class="w-full rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'name', this.value)">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Slogan</label>
                                    <input type="text" value="${item.slogan}" class="w-full rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'slogan', this.value)">
                                </div>
                            </div>
                             <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Poster (Imagen)</label>
                                <div class="flex gap-2">
                                    <input type="text" value="${item.posterSrc}" class="flex-1 rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'posterSrc', this.value)">
                                    <label class="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-2 rounded-lg flex items-center justify-center transition-colors">
                                        <i data-lucide="upload" class="w-4 h-4"></i>
                                        <input type="file" class="hidden" onchange="uploadImage(this, ${index}, 'posterSrc')">
                                    </label>
                                </div>
                            </div>
                             <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Video (MP4)</label>
                                <div class="flex gap-2">
                                    <input type="text" value="${item.videoSrc}" class="flex-1 rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'videoSrc', this.value)">
                                    <label class="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-2 rounded-lg flex items-center justify-center transition-colors">
                                        <i data-lucide="film" class="w-4 h-4"></i>
                                        <input type="file" class="hidden" onchange="uploadImage(this, ${index}, 'videoSrc')">
                                    </label>
                                </div>
                            </div>
                        </div>
                    `;
                    container.appendChild(el);
                });
            } else if (currentTab === 'event') {
                 data.forEach((event, index) => {
                    const el = document.createElement('div');
                    el.className = 'border border-slate-200 rounded-xl p-5 bg-slate-50 relative group transition-all hover:shadow-md item-form ' + (event.visible ? 'ring-2 ring-emerald-500' : '');
                    el.innerHTML = `
                        <div class="absolute top-4 right-4 flex gap-2">
                            <label class="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                                <span class="text-xs font-bold text-slate-500">Visible</span>
                                <input type="checkbox" ${event.visible ? 'checked' : ''} onchange="toggleEventVisibility(${index})">
                            </label>
                        </div>
                        <div class="space-y-4">
                            <h4 class="text-xs font-bold text-slate-400 uppercase">Evento: ${event.id}</h4>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Título</label>
                                <input type="text" value="${(event.title || '').replace(/"/g, '&quot;')}" class="w-full rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'title', this.value)">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                                <textarea class="w-full rounded-lg border border-slate-300 p-2 text-sm" rows="2" oninput="updateItem(${index}, 'description', this.value)">${event.description}</textarea>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                                    <input type="text" value="${event.date}" class="w-full rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'date', this.value)">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Lugar</label>
                                    <input type="text" value="${event.location}" class="w-full rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'location', this.value)">
                                </div>
                            </div>
                             <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Imagen Principal</label>
                                <div class="flex gap-2">
                                    <input type="text" value="${event.mainImage}" class="flex-1 rounded-lg border border-slate-300 p-2 text-sm" oninput="updateItem(${index}, 'mainImage', this.value)">
                                    <label class="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-2 rounded-lg flex items-center justify-center transition-colors">
                                        <i data-lucide="upload" class="w-4 h-4"></i>
                                        <input type="file" class="hidden" onchange="uploadImage(this, ${index}, 'mainImage')">
                                    </label>
                                </div>
                            </div>
                        </div>
                    `;
                    container.appendChild(el);
                 });
            }

            lucide.createIcons();
        }

        // --- Data Manipulation ---
        function updateItem(index, key, value) {
            workingData[currentTab][index][key] = value;
            syncPreview();
        }

        function toggleEventVisibility(index) {
            workingData.event.forEach((e, i) => e.visible = (i === index));
            renderEditor();
            syncPreview();
        }

        function addItem() {
            if (currentTab === 'slider') {
                workingData.slider.push({ type: 'simple', backgroundImage: '', buttons: [] });
            } else if (currentTab === 'states') {
                workingData.states.push({ id: 'new', name: 'Nuevo', logo: '', url: '#', socials: [] });
            } else if (currentTab === 'cine') {
                workingData.cine.push({ id: 'new', name: 'NUEVO', slogan: 'Slogan', videoSrc: '', posterSrc: '' });
            }
            renderEditor();
            syncPreview();
        }

        function removeItem(index) {
            if (!confirm('¿Estás seguro?')) return;
            workingData[currentTab].splice(index, 1);
            renderEditor();
            syncPreview();
        }

        // --- Socials Specific ---
        function updateSocial(itemIndex, socialIndex, key, value) {
            workingData.states[itemIndex].socials[socialIndex][key] = value;
            if (key === 'icon') renderEditor(); // Re-render to show correct icon preview if we had one
            syncPreview();
        }
        function addSocial(itemIndex) {
            workingData.states[itemIndex].socials.push({ name: 'Facebook', url: '#', icon: 'facebook' });
            renderEditor();
            syncPreview();
        }
        function removeSocial(itemIndex, socialIndex) {
            workingData.states[itemIndex].socials.splice(socialIndex, 1);
            renderEditor();
            syncPreview();
        }

        // --- Image Upload ---
        async function uploadImage(input, index, key) {
            const file = input.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);

            try {
                const res = await fetch('api/upload_image.php', { method: 'POST', body: formData });
                const json = await res.json();
                
                if (json.success) {
                    // Find input text field and update it
                    // Also update data model
                    if (index !== undefined) {
                        workingData[currentTab][index][key] = json.path;
                    } else {
                        // For the standalone input in the template (not used in real flow but good for robustness)
                    }
                    renderEditor();
                    syncPreview();
                } else {
                    alert('Error: ' + json.error);
                }
            } catch (e) {
                alert('Upload failed');
            }
        }

        // --- Save ---
        async function saveCurrentData() {
            const btn = document.querySelector('button[onclick="saveCurrentData()"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Guardando...';
            btn.disabled = true;

            try {
                const res = await fetch('api/save_data.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: currentTab,
                        data: workingData[currentTab]
                    })
                });
                const json = await res.json();
                if (json.success) {
                    const status = document.getElementById('save-status');
                    status.style.opacity = '1';
                    setTimeout(() => status.style.opacity = '0', 2000);
                } else {
                    alert('Error al guardar: ' + json.error);
                }
            } catch (e) {
                alert('Error de conexión');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }
    </script>
</body>
</html>
