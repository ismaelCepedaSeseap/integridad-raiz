<?php
$actual = basename(__FILE__);
include_once "../assets/php/security/initSession.php";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Guardianes - Integridad desde la Raíz</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS -->
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
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="../assets/css/pages/admin.css">
    <style>
        .modal-xl {
            max-width: 1200px;
            width: 95%;
            height: 90vh;
        }
        
        .modal-content {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .modal-body {
            padding: 1.5rem;
            background: #f8fafc;
            flex: 1;
            overflow: hidden;
        }

        #guardian-form {
            height: 100%;
            overflow-y: auto;
            padding-right: 10px;
        }

        /* Custom Scrollbar */
        #guardian-form::-webkit-scrollbar {
            width: 6px;
        }

        #guardian-form::-webkit-scrollbar-track {
            background: transparent;
        }

        #guardian-form::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
        }

        .preview-section {
            position: sticky;
            top: 0;
            background: #f1f5f9;
            padding: 2rem;
            border-radius: 1.5rem;
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            min-height: 100%;
        }

        /* Guardian Preview Phone Style */
        .phone-frame {
            width: 280px;
            height: 500px;
            background: #1e293b;
            border-radius: 3rem;
            padding: 12px;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 4px solid #334155;
            z-index: 1;
        }

        .phone-screen {
            width: 100%;
            height: 100%;
            background: #000;
            border-radius: 2.2rem;
            overflow: hidden;
            position: relative;
        }

        .phone-camera {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 25px;
            background: #1e293b;
            border-bottom-left-radius: 1rem;
            border-bottom-right-radius: 1rem;
            z-index: 10;
        }

        .preview-info-card {
            width: 260px;
            background: white;
            border-radius: 1.5rem;
            padding: 1.5rem 1rem;
            text-align: center;
            margin-top: -2.5rem;
            position: relative;
            z-index: 10;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border: 1px solid #f1f5f9;
        }

        .preview-state-name {
            color: #064e3b;
            font-weight: 900;
            font-style: italic;
            font-size: 1.5rem;
            text-transform: uppercase;
            line-height: 1;
            margin-bottom: 0.5rem;
            letter-spacing: -0.025em;
        }

        .preview-slogan-text {
            color: #10b981;
            font-weight: 700;
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            line-height: 1.4;
        }

        .guardian-preview-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    </style>
    
    <!-- Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
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
        
        <!-- Sidebar Overlay (Mobile) -->
        <div id="sidebar-overlay" class="sidebar-overlay"></div>

        <!-- Sidebar -->
        <aside id="sidebar" class="sidebar">
            <div class="sidebar__inner">
                <!-- User Profile Summary -->
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

                <!-- Navigation -->
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

                    <a href="sliders.php" id="nav-sliders" class="nav-item">
                        <i data-lucide="layout-template"></i>
                        <span>Sliders</span>
                    </a>

                    <a href="estados.php" id="nav-estados" class="nav-item">
                        <i data-lucide="map"></i>
                        <span>Estados</span>
                    </a>

                    <a href="eventos.php" id="nav-events" class="nav-item">
                        <i data-lucide="calendar-days"></i>
                        <span>Eventos y Rally</span>
                    </a>

                    <a href="guardianes.php" id="nav-guardianes" class="nav-item active">
                        <i data-lucide="shield"></i>
                        <span>Guardianes</span>
                    </a>
                </nav>
            </div>

            <!-- Footer Actions -->
            <div class="sidebar__footer">
                <button id="btn-logout" class="btn btn-danger btn-full">
                    <i data-lucide="log-out"></i> Cerrar Sesión
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            
            <!-- Header -->
            <header class="page-header">
                <div class="page-header__title">
                    <h1>Gestión de Guardianes</h1>
                    <p>Administra los videos y mensajes de los guardianes por estado.</p>
                </div>
                <div class="page-header__actions">
                    <button id="btn-add-guardian" class="btn btn-primary">
                        <i data-lucide="plus"></i> Nuevo Guardián
                    </button>
                </div>
            </header>

            <!-- Table Container -->
            <div class="table-container">
                <!-- Table Controls -->
                <div class="table-controls">
                    <div class="table-search">
                        <i data-lucide="search"></i>
                        <input type="text" id="search-input" placeholder="Buscar por estado o slogan...">
                    </div>
                    <div class="table-filter">
                        <select id="filter-state" class="form-select">
                            <option value="">Todos los estados</option>
                            <!-- Opciones dinámicas -->
                        </select>
                    </div>
                </div>

                <!-- Table -->
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>Slogan</th>
                                <th>Poster</th>
                                <th>Video</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="guardianes-table-body">
                            <!-- Rows loaded via JS -->
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
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
    <div id="guardian-modal" class="modal modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">Nuevo Guardián</h2>
                <button class="btn-close-modal"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body">
                <div class="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
                    <!-- Form Column -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-[calc(90vh-120px)]">
                        <form id="guardian-form" class="p-6 space-y-5 overflow-y-auto pr-1 custom-scrollbar">
                            <input type="hidden" id="guardian-id" name="id">
                            
                            <!-- Estado -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <i data-lucide="map-pin" class="w-4 h-4 text-blue-500"></i> Estado
                                </label>
                                <select id="estado_id" name="estado_id" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none text-slate-700 font-medium" required>
                                    <option value="">Seleccione un estado</option>
                                    <!-- Opciones cargadas dinámicamente -->
                                </select>
                            </div>

                            <!-- Slogan -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <i data-lucide="quote" class="w-4 h-4 text-blue-500"></i> Slogan / Mensaje
                                </label>
                                <textarea id="slogan" name="slogan" rows="3" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700" placeholder="Ej: La honestidad nos une" required></textarea>
                            </div>

                            <!-- Poster -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <i data-lucide="image" class="w-4 h-4 text-blue-500"></i> Imagen Poster (JPG, PNG)
                                </label>
                                <div class="group relative">
                                    <input type="file" id="poster" name="poster" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*">
                                    <div class="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl group-hover:border-blue-400 transition-colors">
                                        <div class="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-500">
                                            <i data-lucide="upload-cloud" class="w-5 h-5"></i>
                                        </div>
                                        <span class="text-sm text-slate-600 font-medium truncate" id="poster-file-name">Seleccionar poster...</span>
                                    </div>
                                    <input type="hidden" id="url_poster_actual" name="url_poster_actual">
                                </div>
                                <small class="text-slate-400 block mt-1">Dejar vacío para mantener el actual</small>
                            </div>

                            <!-- Video -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <i data-lucide="video" class="w-4 h-4 text-blue-500"></i> Video (MP4)
                                </label>
                                <div class="group relative">
                                    <input type="file" id="video" name="video" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="video/mp4">
                                    <div class="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl group-hover:border-blue-400 transition-colors">
                                        <div class="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-500">
                                            <i data-lucide="upload-cloud" class="w-5 h-5"></i>
                                        </div>
                                        <span class="text-sm text-slate-600 font-medium truncate" id="video-file-name">Seleccionar video...</span>
                                    </div>
                                    <input type="hidden" id="url_video_actual" name="url_video_actual">
                                </div>
                                <small class="text-slate-400 block mt-1">Dejar vacío para mantener el actual</small>
                            </div>

                            <!-- Estatus -->
                            <div class="space-y-2">
                                <label for="activo" class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <i data-lucide="activity" class="w-4 h-4 text-blue-500"></i> Estatus
                                </label>
                                <div class="relative">
                                    <select id="activo" name="activo" class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none text-slate-700 font-medium">
                                        <option value="1">Activo</option>
                                        <option value="0">Inactivo</option>
                                    </select>
                                    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <i data-lucide="chevron-down" class="w-4 h-4"></i>
                                    </div>
                                </div>
                            </div>
                        </form>
                        
                        <!-- Fixed Footer Actions -->
                        <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                            <button type="button" class="btn-close-modal px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                                Cancelar
                            </button>
                            <button type="submit" form="guardian-form" class="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95">
                                Guardar Guardián
                            </button>
                        </div>
                    </div>

                    <!-- Preview Column -->
                    <div class="preview-section h-[calc(90vh-120px)] overflow-hidden">
                        <div class="w-full flex justify-between items-center mb-6">
                            <h3 class="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                                <i data-lucide="eye" class="w-4 h-4"></i> Vista Previa en Tiempo Real
                            </h3>
                            <span class="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">SITIO WEB</span>
                        </div>

                        <!-- Phone Style Preview -->
                        <div class="phone-frame">
                            <div class="phone-camera"></div>
                            <div class="phone-screen">
                                <video id="preview-video" class="guardian-preview-video" loop muted playsinline poster=""></video>
                            </div>
                        </div>

                        <!-- Info Card -->
                        <div class="preview-info-card">
                            <div id="preview-state" class="preview-state-name">Puebla</div>
                            <div id="preview-slogan" class="preview-slogan-text">"PRINCIPIOS QUE TRANSFORMAN"</div>
                        </div>

                        <div class="mt-6 w-full space-y-4">
                            <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <h4 class="text-xs font-black text-blue-600 uppercase mb-2 tracking-wider">Nota Informativa</h4>
                                <p class="text-xs text-blue-800 leading-relaxed">
                                    Los cambios en el slogan y archivos se reflejan inmediatamente en esta vista previa. El video se reproducirá automáticamente si está disponible.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Confirm Delete -->
    <div id="delete-modal" class="modal">
        <div class="modal-content modal-sm">
            <div class="modal-header">
                <h2>Confirmar Eliminación</h2>
                <button class="btn-close-modal"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body">
                <p>¿Estás seguro de que deseas eliminar este guardián? Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-close-modal">Cancelar</button>
                <button id="btn-confirm-delete" class="btn btn-danger">Eliminar</button>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="../assets/js/pages/admin/generales/menu.js"></script>
    <script src="../assets/js/pages/admin/guardianes.js"></script>
</body>
</html>
