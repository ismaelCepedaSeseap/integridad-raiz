<?php
$actual = basename(__FILE__);
include_once "../assets/php/security/initSession.php";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Estados - Integridad desde la Raíz</title>
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
    <style>
        .modal-xl { max-width: 1200px; width: 95%; height: 90vh; }
        .modal-content { height: 100%; display: flex; flex-direction: column; }
        .modal-body { padding: 1.5rem; background: #f8fafc; flex: 1; overflow: hidden; }
        @media (max-width: 992px) { .preview-section { order: -1; margin-bottom: 1rem; } }
        .preview-section { position: sticky; top: 0; background: #f1f5f9; padding: 2rem; border-radius: 1.5rem; border: 1px solid #e2e8f0; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; min-height: 100%; }
        .preview-logo-container { background: white; border-radius: 1.5rem; padding: 1.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; width: 100%; aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; }
        #social-container::-webkit-scrollbar { width: 4px; }
        #social-container::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        #social-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        #social-container::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="font-quicksand">
    <header class="mobile-header">
        <div class="mobile-header__logo">
            <img src="../assets/images/logo.png" alt="Logo" class="logo-img">
            <span class="logo-text">SEA Puebla</span>
        </div>
        <button id="btn-toggle-sidebar" class="mobile-header__toggle"><i data-lucide="menu"></i></button>
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
                        <h2 id="sidebar-user-role">Administrador</h2>
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
                    <a href="estados.php" id="nav-estados" class="nav-item active">
                        <i data-lucide="map"></i>
                        <span>Estados</span>
                    </a>
                    <a href="eventos.php" id="nav-events" class="nav-item">
                        <i data-lucide="calendar-days"></i>
                        <span>Eventos y Rally</span>
                    </a>
                    <a href="guardianes.php" id="nav-guardianes" class="nav-item">
                        <i data-lucide="shield"></i>
                        <span>Guardianes</span>
                    </a>
                    <a href="#" class="nav-item"><i data-lucide="message-square"></i><span>Compromisos</span></a>
                    <a href="#" class="nav-item"><i data-lucide="settings"></i><span>Configuración</span></a>
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
                    <h1>Gestión de Estados</h1>
                    <p>Administra los estados, sus logotipos y redes sociales.</p>
                </div>
                <div class="page-header__actions">
                    <button id="btn-add-estado" class="btn btn-primary">
                        <i data-lucide="plus"></i> Nuevo Estado
                    </button>
                </div>
            </header>

            <div class="table-container">
                <div class="table-controls">
                    <div class="table-search">
                        <i data-lucide="search"></i>
                        <input type="text" id="search-input" placeholder="Buscar por nombre...">
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Logo</th>
                                <th>Nombre</th>
                                <th>Sitio Web</th>
                                <th>Redes Sociales</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="estados-table-body"></tbody>
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
                        <button id="btn-prev" class="pagination-btn" disabled><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
                        <div id="pagination-numbers" class="flex gap-1"></div>
                        <button id="btn-next" class="pagination-btn" disabled><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
                    </div>
                    <div class="pagination-summary">
                        Mostrando <span id="showing-count">0-0</span> de <span id="total-count">0</span>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <div id="estado-modal" class="modal modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">Nuevo Estado</h2>
                <button class="btn-close-modal"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body">
                <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-[calc(90vh-120px)]">
                        <form id="estado-form" class="p-6 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
                            <input type="hidden" id="estado-id" name="id">
                            <div class="space-y-2">
                                <label for="nombre" class="text-sm font-semibold text-slate-700 flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4 text-blue-500"></i> Seleccionar Estado</label>
                                <div class="relative">
                                    <select id="nombre" name="nombre" class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none text-slate-700 font-medium" required>
                                        <option value="">Seleccione un estado</option>
                                    </select>
                                    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><i data-lucide="chevron-down" class="w-4 h-4"></i></div>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label for="url_sitio" class="text-sm font-semibold text-slate-700 flex items-center gap-2"><i data-lucide="globe" class="w-4 h-4 text-blue-500"></i> URL Sitio Web</label>
                                <div class="relative">
                                    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><i data-lucide="link" class="w-4 h-4"></i></div>
                                    <input type="url" id="url_sitio" name="url_sitio" class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400" placeholder="https://www.ejemplo.com">
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label for="url_logo" class="text-sm font-semibold text-slate-700 flex items-center gap-2"><i data-lucide="image" class="w-4 h-4 text-blue-500"></i> Logo del Estado</label>
                                <div class="group relative">
                                    <input type="file" id="url_logo" name="logo" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*">
                                    <div class="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl group-hover:border-blue-400 transition-colors">
                                        <div class="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-500"><i data-lucide="upload-cloud" class="w-5 h-5"></i></div>
                                        <span class="text-sm text-slate-600 font-medium truncate" id="file-name-display">Seleccionar archivo...</span>
                                    </div>
                                    <input type="hidden" id="url_logo_actual" name="url_logo_actual">
                                </div>
                                <p class="text-[11px] text-slate-400 flex items-center gap-1 px-1"><i data-lucide="info" class="w-3 h-3"></i> Recomendado: 200x200px (JPG, PNG)</p>
                            </div>
                            <div class="space-y-2">
                                <label for="activo" class="text-sm font-semibold text-slate-700 flex items-center gap-2"><i data-lucide="activity" class="w-4 h-4 text-blue-500"></i> Estatus</label>
                                <div class="relative">
                                    <select id="activo" name="activo" class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none text-slate-700 font-medium">
                                        <option value="1">Activo</option>
                                        <option value="0">Inactivo</option>
                                    </select>
                                    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><i data-lucide="chevron-down" class="w-4 h-4"></i></div>
                                </div>
                            </div>
                            <div class="space-y-3 pt-2">
                                <div class="flex justify-between items-center px-1">
                                    <label class="text-sm font-semibold text-slate-700 flex items-center gap-2"><i data-lucide="share-2" class="w-4 h-4 text-blue-500"></i> Redes Sociales</label>
                                    <button type="button" id="btn-add-social" class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">
                                        <i data-lucide="plus" class="w-3.5 h-3.5"></i> Agregar
                                    </button>
                                </div>
                                <div id="social-container" class="space-y-2 pr-1"></div>
                            </div>
                        </form>
                    </div>

                    <div class="preview-section h-[calc(90vh-120px)] overflow-hidden">
                        <div class="w-full flex justify-between items-center mb-6">
                            <h3 class="text-sm font-bold text-slate-500 uppercase flex items-center gap-2"><i data-lucide="eye" class="w-4 h-4"></i> Vista Previa en Tiempo Real</h3>
                            <span class="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">SITIO WEB</span>
                        </div>
                        <div class="group flex flex-col items-center gap-3 w-40 sm:w-44">
                            <a id="preview-link" href="#" target="_blank" class="w-full h-32 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm p-4 group-hover:border-green-600 group-hover:shadow-md transition-all duration-300">
                                <img id="preview-logo-img" src="../assets/images/logo.png" alt="Logo" class="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300">
                            </a>
                            <div class="flex flex-col items-center gap-3">
                                <span id="preview-name" class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-green-800 transition-colors text-center leading-tight">Nombre del Estado</span>
                                <div id="preview-socials" class="flex flex-wrap justify-center gap-3 transition-all duration-300"></div>
                            </div>
                        </div>
                        <div class="mt-6 w-full space-y-4">
                            <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <h4 class="text-xs font-black text-blue-600 uppercase mb-2 tracking-wider">Nota Informativa</h4>
                                <p class="text-xs text-blue-800 leading-relaxed">Los cambios en logo, nombre y redes se reflejan inmediatamente en esta vista previa.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-close-modal">Cancelar</button>
                <button type="submit" form="estado-form" class="btn btn-primary">Guardar</button>
            </div>
        </div>
    </div>

    <script src="../assets/js/pages/admin/generales/menu.js"></script>
    <script src="../assets/js/pages/admin/estados.js"></script>
</body>
</html>
