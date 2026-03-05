<?php
$actual = basename(__FILE__);
include_once "../assets/php/security/initSession.php";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión del Árbol - Integridad desde la Raíz</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../assets/css/pages/admin.css">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        .seed-pulse {
            animation: pulse-seed 2.2s ease-in-out infinite;
            cursor: pointer;
            transform-origin: center;
            transform-box: fill-box;
        }

        @keyframes pulse-seed {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.25); }
        }
    </style>
</head>
<body class="font-quicksand">
    <header class="mobile-header">
        <div class="mobile-header__logo">
            <img src="../assets/images/logo.png" alt="Logo" class="logo-img">
            <span class="logo-text">SEA Puebla</span>
        </div>
        <button id="btn-toggle-sidebar" class="mobile-header__toggle">
            <i data-lucide="menu"></i>
        </button>
    </header>

    <div class="main-container">
        <div id="sidebar-overlay" class="sidebar-overlay"></div>
        <aside id="sidebar" class="sidebar">
            <div class="sidebar__inner">
                <div class="profile-summary">
                    <div class="profile-summary__avatar">
                        <img src="../assets/images/logo.png" alt="Logo SEA" class="avatar-img">
                        <div class="avatar-status"></div>
                    </div>
                    <div class="profile-summary__info">
                        <h2>Administrador</h2>
                        <p>Panel de Control</p>
                    </div>
                </div>
                <nav class="navigation">
                    <p class="nav-section-title">Principal</p>
                    <a href="dashboard.php" class="nav-item">
                        <i data-lucide="layout-dashboard"></i>
                        <span>General</span>
                    </a>
                    <a href="usuarios.php" class="nav-item">
                        <i data-lucide="users"></i>
                        <span>Usuarios</span>
                    </a>
                    <p class="nav-section-title">Gestión</p>
                    <a href="estados.php" class="nav-item">
                        <i data-lucide="map"></i>
                        <span>Estados</span>
                    </a>
                    <a href="eventos.php" class="nav-item">
                        <i data-lucide="calendar-days"></i>
                        <span>Eventos y Rally</span>
                    </a>
                    <a href="guardianes.php" class="nav-item">
                        <i data-lucide="shield"></i>
                        <span>Guardianes</span>
                    </a>
                    <a href="cine.php" class="nav-item">
                        <i data-lucide="film"></i>
                        <span>Cine</span>
                    </a>
                    <a href="arbol.php" class="nav-item active">
                        <i data-lucide="tree-pine"></i>
                        <span>Árbol</span>
                    </a>
                </nav>
            </div>
            <div class="sidebar__footer">
                <button id="btn-logout" class="btn btn-danger btn-full">
                    <i data-lucide="log-out"></i> Cerrar Sesión
                </button>
            </div>
        </aside>

        <main class="main-content">
            <header class="page-header">
                <div class="page-header__title">
                    <h1>Administrador del Árbol</h1>
                    <p>Gestiona los frutos dorados desde base de datos.</p>
                </div>
                <div class="page-header__actions">
                    <button id="btn-add-tip" class="btn btn-primary">
                        <i data-lucide="plus"></i> Nuevo Fruto
                    </button>
                </div>
            </header>

            <div class="table-container">
                <div class="table-controls">
                    <div class="table-search">
                        <i data-lucide="search"></i>
                        <input type="text" id="search-input" placeholder="Buscar por tema o consejo...">
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tema</th>
                                <th>Consejo</th>
                                <th>Orden</th>
                                <th>Estatus</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tips-table-body"></tbody>
                    </table>
                </div>
                
                <div class="pagination-container">
                    <div class="pagination-info">
                        <span>Mostrar</span>
                        <select id="items-per-page" class="pagination-select">
                            <option value="5">5</option>
                            <option value="10" selected>10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <span>registros</span>
                    </div>

                    <div class="pagination-controls">
                        <button id="btn-prev" class="pagination-btn" disabled>
                            <i data-lucide="chevron-left" class="w-4 h-4"></i>
                        </button>
                        <div id="pagination-numbers" class="flex gap-1"></div>
                        <button id="btn-next" class="pagination-btn" disabled>
                            <i data-lucide="chevron-right" class="w-4 h-4"></i>
                        </button>
                    </div>
                    
                    <div class="pagination-summary">
                        Mostrando <span id="showing-count">0-0</span> de <span id="total-count">0</span>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Modal Form -->
    <div id="tip-modal" class="modal modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">Nuevo Fruto</h2>
                <button class="btn-close-modal"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body">
                <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
                    <!-- Form Column -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-[calc(90vh-120px)]">
                        <form id="tip-form" class="p-6 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
                            <input type="hidden" id="tip-id">
                            
                            <!-- Tema -->
                            <div class="space-y-2">
                                <label for="tip-tema" class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <i data-lucide="sprout" class="w-4 h-4 text-blue-500"></i> Tema
                                </label>
                                <input id="tip-tema" type="text" class="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-400" placeholder="Ej. Honestidad" required>
                            </div>

                            <!-- Consejo -->
                            <div class="space-y-2">
                                <label for="tip-consejo" class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <i data-lucide="message-square" class="w-4 h-4 text-blue-500"></i> Consejo
                                </label>
                                <textarea id="tip-consejo" rows="4" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400 resize-none" placeholder="Escribe el consejo aquí..." required></textarea>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <!-- Orden -->
                                <div class="space-y-2">
                                    <label for="tip-orden" class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <i data-lucide="list-ordered" class="w-4 h-4 text-blue-500"></i> Orden
                                    </label>
                                    <input id="tip-orden" type="number" min="1" class="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium" required>
                                </div>

                                <!-- Estatus -->
                                <div class="space-y-2">
                                    <label for="tip-activo" class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <i data-lucide="activity" class="w-4 h-4 text-blue-500"></i> Estatus
                                    </label>
                                    <div class="relative">
                                        <select id="tip-activo" class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none text-slate-700 font-medium">
                                            <option value="1">Activo</option>
                                            <option value="0">Inactivo</option>
                                        </select>
                                        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <i data-lucide="chevron-down" class="w-4 h-4"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                            <button type="button" class="btn-close-modal px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                                Cancelar
                            </button>
                            <button type="submit" form="tip-form" class="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95">
                                Guardar Fruto
                            </button>
                        </div>
                    </div>

                    <!-- Preview Column -->
                    <div class="preview-section h-[calc(90vh-120px)] overflow-hidden">
                        <div class="w-full flex justify-between items-center mb-6">
                            <h3 class="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                                <i data-lucide="eye" class="w-4 h-4"></i> Vista Previa en Tiempo Real
                            </h3>
                            <span class="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">ÁRBOL</span>
                        </div>
                        
                        <div class="w-full bg-green-900 rounded-2xl border border-green-800 p-6 overflow-hidden relative">
                            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDAgTDIwMCAxMDAgTDEwMCAyMDAgTDAgMTAwIFoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-20"></div>
                            <div class="relative w-full max-w-[260px] aspect-square mx-auto mb-6">
                                <svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-2xl">
                                    <path d="M100 180 Q100 140 100 100" stroke="#523015" stroke-width="12" stroke-linecap="round" />
                                    <circle cx="100" cy="80" r="50" fill="#15803d" />
                                    <circle cx="70" cy="100" r="40" fill="#166534" />
                                    <circle cx="130" cy="100" r="40" fill="#166534" />
                                    
                                    <g id="preview-fruit-group" class="cursor-pointer fruit-group dynamic-fruit" style="transform-origin: 100px 100px;">
                                        <defs>
                                            <radialGradient id="previewFruitGradient" cx="35%" cy="35%" r="50%">
                                                <stop offset="0%" stop-color="#fff176"></stop>
                                                <stop offset="100%" stop-color="#f9a825"></stop>
                                            </radialGradient>
                                            <filter id="previewFruitGlow" x="-50%" y="-50%" width="200%" height="200%">
                                                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blurOut"></feGaussianBlur>
                                                <feColorMatrix in="blurOut" type="matrix" values="0 0 0 0 1   0 0 0 0 0.8   0 0 0 0 0   0 0 0 0.6 0" result="glowOut"></feColorMatrix>
                                                <feMerge>
                                                    <feMergeNode in="glowOut"></feMergeNode>
                                                    <feMergeNode in="SourceGraphic"></feMergeNode>
                                                </feMerge>
                                            </filter>
                                        </defs>
                                        <circle cx="100" cy="100" r="10" fill="#facc15" filter="url(#previewFruitGlow)" class="seed-pulse"></circle>
                                    </g>
                                </svg>
                            </div>

                            <div id="preview-display" class="w-full bg-white/10 backdrop-blur-md p-5 rounded-[18px] border border-white/20 min-h-[110px] flex flex-col items-center justify-center text-center transition-all duration-300 relative z-10">
                                <span id="preview-tema" class="text-yellow-400 font-black uppercase tracking-widest text-xs mb-2">TEMA</span>
                                <p id="preview-consejo" class="text-white text-sm italic">"El consejo aparecerá aquí"</p>
                            </div>
                        </div>

                        <div class="mt-6 w-full space-y-4">
                            <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <h4 class="text-xs font-black text-blue-600 uppercase mb-2 tracking-wider">Nota Informativa</h4>
                                <p class="text-xs text-blue-800 leading-relaxed">
                                    Los cambios en tema y consejo se reflejan inmediatamente en esta vista previa.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="../assets/js/pages/admin/generales/menu.js"></script>
    <script src="../assets/js/pages/admin/arbol.js"></script>
</body>
</html>
