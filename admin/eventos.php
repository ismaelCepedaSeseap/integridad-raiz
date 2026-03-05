<?php
$actual = basename(__FILE__);
include_once "../assets/php/security/initSession.php";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Eventos - Integridad desde la Raíz</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        quicksand: ['Quicksand', 'sans-serif'],
                    },
                }
            }
        }
    </script>
    
    <link rel="stylesheet" href="../assets/css/pages/admin.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="font-quicksand">
    <header class="mobile-header" style="display: none;">
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
                        <h2 id="sidebar-user-role">Admin</h2>
                        <p>Panel de Control</p>
                    </div>
                </div>

                <nav class="navigation">
                    <p class="nav-section-title">Principal</p>
                    <a href="dashboard.php" id="nav-general" class="nav-item">
                        <i data-lucide="layout-dashboard"></i>
                        <span>General</span>
                    </a>
                    <a href="usuarios.php" id="nav-users" class="nav-item">
                        <i data-lucide="users"></i>
                        <span>Usuarios</span>
                    </a>
                    <p class="nav-section-title">Gestión</p>
                    <a href="estados.php" id="nav-estados" class="nav-item">
                        <i data-lucide="map"></i>
                        <span>Estados</span>
                    </a>
                    <a href="eventos.php" id="nav-events" class="nav-item active">
                        <i data-lucide="calendar-days"></i>
                        <span>Eventos y Rally</span>
                    </a>
                    <a href="cine.php" id="nav-cine" class="nav-item">
                        <i data-lucide="film"></i>
                        <span>Cine</span>
                    </a>
                    <a href="#" class="nav-item">
                        <i data-lucide="message-square"></i>
                        <span>Compromisos</span>
                    </a>
                    <a href="#" class="nav-item">
                        <i data-lucide="settings"></i>
                        <span>Configuración</span>
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
                    <h1>Gestión de Eventos</h1>
                    <p>Crea, edita y publica los próximos eventos y rallies.</p>
                </div>
                <div class="page-header__actions">
                    <button id="btn-new-item" class="btn btn-primary">
                        <i data-lucide="plus"></i> Nuevo Evento
                    </button>
                </div>
            </header>

            <section id="content-manager" class="animate-fadeIn">
                <div class="content-grid content-grid--full" style="margin-top: 1.5rem;">
                    <div class="table-container">
                        <div class="table-controls">
                            <div class="table-search">
                                <i data-lucide="search"></i>
                                <input type="text" id="search-input" placeholder="Buscar por título, estado o ubicación">
                            </div>
                            <p class="section-subtitle" id="item-count">0 eventos</p>
                        </div>

                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Evento</th>
                                        <th>Fecha</th>
                                        <th>Ubicación</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="events-table-body"></tbody>
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
                </div>
            </section>
        </main>
    </div>

    <div id="new-event-modal" class="modal modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">Nuevo Evento</h2>
                <button id="btn-close-modal" class="btn-close-modal"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body bg-slate-50">
                <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-[calc(90vh-120px)]">
                        <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                            <div id="modal-tabs" class="tabs-header"></div>
                            <div id="new-event-form" class="form-grid"></div>
                        </div>
                        <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                            <button id="btn-modal-cancel" class="btn-close-modal px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
                            <button id="btn-modal-preview" class="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                                <i data-lucide="eye" class="w-4 h-4"></i> Vista previa
                            </button>
                            <button id="btn-modal-save" class="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95">Guardar Evento</button>
                        </div>
                    </div>
                    <div class="preview-section h-[calc(90vh-120px)] overflow-hidden bg-slate-50/50 p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div class="w-full flex justify-between items-center mb-6">
                            <h3 class="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                                <i data-lucide="eye" class="w-4 h-4"></i> Vista Previa en Tiempo Real
                            </h3>
                            <span class="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">EVENTOS</span>
                        </div>
                        <div class="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div class="h-44 bg-slate-100">
                                <img id="preview-image" src="../assets/images/logo.png" alt="Evento" class="w-full h-full object-cover">
                            </div>
                            <div class="p-5 space-y-3">
                                <span id="preview-badge" class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">Evento</span>
                                <h4 id="preview-title" class="text-lg font-black text-slate-800">Título del Evento</h4>
                                <p id="preview-meta" class="text-xs text-slate-500">Fecha · Ubicación</p>
                                <p id="preview-description" class="text-sm text-slate-600 line-clamp-3">Descripción breve del evento.</p>
                            </div>
                        </div>
                        <div class="mt-6 w-full space-y-4">
                            <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <h4 class="text-xs font-black text-blue-600 uppercase mb-2 tracking-wider">Nota Informativa</h4>
                                <p class="text-xs text-blue-800 leading-relaxed">Los cambios del formulario se reflejan inmediatamente en esta vista previa.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="../assets/js/data/events-data.js"></script>
    <script src="../assets/js/pages/admin/generales/menu.js"></script>
    <script src="../assets/js/pages/admin/eventos.js"></script>
</body>
</html>
