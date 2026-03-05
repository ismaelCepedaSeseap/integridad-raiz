<?php
$actual = basename(__FILE__);
include_once "../assets/php/security/initSession.php";
?>
 <!DOCTYPE html>

<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Gestión de Sliders - Integridad desde la Raíz</title>

   

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

            overflow: hidden; /* Evitamos scroll aquí */

        }



        #slider-form {

            height: 100%;

            overflow-y: auto;

            padding-right: 10px;

        }



        /* Custom Scrollbar */

        #slider-form::-webkit-scrollbar {

            width: 6px;

        }



        #slider-form::-webkit-scrollbar-track {

            background: transparent;

        }



        #slider-form::-webkit-scrollbar-thumb {

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



        /* Slider Preview Emulation */

        .slider-preview-viewport {
            width: 1280px;
            height: 720px;
            position: relative;
            background-size: cover;
            background-position: center;
            transform-origin: top left;
            flex-shrink: 0;
            overflow: hidden;
        }

        /* Contenedor exacto para sliders complejos */
        .slider-main-container {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 10;
        }

        #preview-image-container {
            position: absolute;
            right: 80px;
            top: 50%;
            transform: translateY(-50%);
            width: 50%;
            height: 80%;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        }

        #preview-image {
            max-height: 100%;
            width: auto;
            object-fit: contain;
            filter: drop-shadow(0 20px 50px rgba(0,0,0,0.3));
        }

        /* Guías de centrado */
        .drag-guide-h, .drag-guide-v {
            position: absolute;
            background: rgba(59, 130, 246, 0.5);
            display: none;
            pointer-events: none;
            z-index: 100;
        }
        .drag-guide-h { width: 100%; height: 1px; left: 0; }
        .drag-guide-v { height: 100%; width: 1px; top: 0; }

        .btn-preview-base {
            cursor: grab;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 1.1rem;
            white-space: nowrap;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .btn-preview-base:active {
            cursor: grabbing;
        }

        .btn-preview-base.is-dragging {
            opacity: 0.9;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
            scale: 1.05;
            outline: 2px solid #3b82f6;
            outline-offset: 4px;
        }



        .slider-preview-card {

            width: 100%;

            aspect-ratio: 16/9;

            border-radius: 1rem;

            overflow: hidden;

            position: relative;

            background: #000;

            box-shadow: 0 10px 25px rgba(0,0,0,0.1);

        }



        .slider-preview-content {

            position: absolute;

            inset: 0;

            padding: 4rem; /* Aumentamos padding proporcionalmente a 1280px */

            display: flex;

            flex-direction: column;

            justify-content: center;

        }



        .slider-preview-content h2 {

            font-size: 3.5rem; /* Tamaño real simulado */

            line-height: 1.2;

        }



        .slider-preview-content p {

            font-size: 1.25rem;

            margin-top: 1.5rem;

        }



        .slider-preview-content .badge {

            font-size: 1rem;

            padding: 0.5rem 1rem;

        }



        .btn-preview-base {
            padding: 1rem 2rem;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 1.1rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-absolute-preview {
            cursor: move !important;
            user-select: none;
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

                    <a href="dashboard.php" class="nav-item">

                        <i data-lucide="layout-dashboard"></i>

                        <span>General</span>

                    </a>

                    <a href="usuarios.php" class="nav-item">

                        <i data-lucide="users"></i>

                        <span>Usuarios</span>

                    </a>

                   

                    <p class="nav-section-title">Gestión</p>

                    <a href="sliders.php" class="nav-item active">

                        <i data-lucide="layout-template"></i>

                        <span>Sliders</span>

                    </a>

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

                </nav>

            </div>



            <div class="sidebar__footer">

                <button id="btn-logout" class="btn btn-danger btn-full">

                    <i data-lucide="log-out"></i> Cerrar Sesión

                </button>

            </div>

        </aside>



        <!-- Main Content -->

        <main class="main-content">

            <header class="page-header">

                <div class="page-header__title">

                    <h1>Gestión de Sliders</h1>

                    <p>Administra las diapositivas del carrusel principal.</p>

                </div>

                <div class="page-header__actions">

                    <button id="btn-add-slider" class="btn btn-primary">

                        <i data-lucide="plus"></i> Nuevo Slider

                    </button>

                </div>

            </header>



            <div class="table-container">
                <div class="table-controls">
                    <div class="table-search">
                        <i data-lucide="search"></i>
                        <input type="text" id="search-input" placeholder="Buscar por título o descripción...">
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Orden</th>
                                <th>Tipo</th>
                                <th>Título</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="sliders-table-body">
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

    <div id="slider-modal" class="modal modal-xl">

        <div class="modal-content">

            <div class="modal-header">

                <h2 id="modal-title">Nuevo Slider</h2>

                <button class="btn-close-modal"><i data-lucide="x"></i></button>

            </div>

            <div class="modal-body">

                <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">

                    <!-- Form Column -->

                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-[calc(90vh-120px)]">

                        <form id="slider-form" class="p-6 space-y-5 overflow-y-auto pr-1 custom-scrollbar">
                            <input type="hidden" id="slider-id" name="id">

                           

                            <div class="grid grid-cols-2 gap-4">

                                <!-- Tipo -->

                                <div class="space-y-2">

                                    <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">

                                        <i data-lucide="layers" class="w-4 h-4 text-blue-500"></i> Tipo

                                    </label>

                                    <select id="type" name="type" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none text-slate-700 font-medium">

                                        <option value="complex">Complejo (Texto + Imagen)</option>

                                        <option value="simple">Simple (Imagen de fondo)</option>

                                    </select>

                                </div>

                                <!-- Orden -->

                                <div class="space-y-2">

                                    <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">

                                        <i data-lucide="list-ordered" class="w-4 h-4 text-blue-500"></i> Orden

                                    </label>

                                    <input type="number" id="orden" name="orden" value="0" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700">

                                </div>

                            </div>



                            <!-- Background (Complex Only) -->

                            <div class="space-y-2 complex-only">

                                <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">

                                    <i data-lucide="palette" class="w-4 h-4 text-blue-500"></i> Fondo (Color/Gradiente)

                                </label>

                                <input type="text" id="background" name="background" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700" placeholder="linear-gradient(...) o #hex">

                            </div>



                            <!-- Background Image (Simple Only / Global) -->

                            <div class="space-y-2">

                                <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">

                                    <i data-lucide="image" class="w-4 h-4 text-blue-500"></i> Imagen de Fondo

                                </label>

                                <div class="group relative">

                                    <input type="file" id="backgroundImage" name="backgroundImage" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*">

                                    <div class="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl group-hover:border-blue-400 transition-colors">

                                        <div class="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-500">

                                            <i data-lucide="upload-cloud" class="w-5 h-5"></i>

                                        </div>

                                        <span class="text-sm text-slate-600 font-medium truncate" id="bg-file-name">Seleccionar fondo...</span>

                                    </div>

                                    <input type="hidden" id="url_backgroundImage_actual" name="url_backgroundImage_actual">

                                </div>

                            </div>



                            <!-- Badge (Complex Only) -->

                            <div class="space-y-2 complex-only">

                                <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">

                                    <i data-lucide="tag" class="w-4 h-4 text-blue-500"></i> Badge (Etiqueta superior)

                                </label>

                                <input type="text" id="badge" name="badge" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700" placeholder="Ej: SESEA PUEBLA presenta">

                            </div>



                            <!-- Title (Complex Only) -->

                            <div class="space-y-2 complex-only">

                                <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">

                                    <i data-lucide="type" class="w-4 h-4 text-blue-500"></i> Título (HTML permitido)

                                </label>

                                <textarea id="title" name="title" rows="2" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700" placeholder="Sembrando <span class='text-green-600'>honestidad</span>..."></textarea>

                            </div>



                            <!-- Description (Complex Only) -->

                            <div class="space-y-2 complex-only">

                                <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">

                                    <i data-lucide="align-left" class="w-4 h-4 text-blue-500"></i> Descripción

                                </label>

                                <textarea id="description" name="description" rows="3" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700"></textarea>

                            </div>



                            <!-- Slide Image (Complex Only) -->

                            <div id="image-field-container" class="space-y-2 complex-only">

                                <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">

                                    <i data-lucide="file-image" class="w-4 h-4 text-blue-500"></i> Imagen Principal

                                </label>

                                <div class="group relative">

                                    <input type="file" id="image" name="image" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*">

                                    <div class="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl group-hover:border-blue-400 transition-colors">

                                        <div class="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-500">

                                            <i data-lucide="upload-cloud" class="w-5 h-5"></i>

                                        </div>

                                        <span class="text-sm text-slate-600 font-medium truncate" id="image-file-name">Seleccionar imagen...</span>

                                    </div>

                                    <input type="hidden" id="url_image_actual" name="url_image_actual">

                                </div>

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



                            <!-- Buttons -->

                            <div class="space-y-3 pt-2">

                                <div class="flex justify-between items-center">

                                    <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">

                                        <i data-lucide="mouse-pointer-2" class="w-4 h-4 text-blue-500"></i> Botones de Acción

                                    </label>

                                    <button type="button" id="btn-add-button" class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">

                                        + Agregar Botón

                                    </button>

                                </div>

                                <div id="buttons-container" class="space-y-3 max-h-[200px] ">

                                    <!-- Dynamic rows -->

                                </div>

                            </div>

                        </form>

                       

                        <!-- Fixed Footer Actions -->

                        <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">

                            <button type="button" class="btn-close-modal px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">

                                Cancelar

                            </button>

                            <button type="submit" form="slider-form" class="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95">

                                Guardar Slider

                            </button>

                        </div>

                    </div>



                    <!-- Preview Column -->
                    <div class="preview-section h-[calc(90vh-120px)] overflow-hidden">
                        <div class="w-full flex justify-between items-center mb-6">
                            <h3 class="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                                <i data-lucide="eye" class="w-4 h-4"></i> Vista Previa en Tiempo Real
                            </h3>
                            <button type="button" id="btn-precision-mode" class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20">
                                <i data-lucide="maximize" class="w-3 h-3"></i> MODO PRECISIÓN 1:1
                            </button>
                        </div>
                       
                        <div id="preview-container" class="preview-container-wrapper w-full shadow-2xl border border-slate-300 bg-slate-200 rounded-xl overflow-hidden">
                            <div id="preview-viewport" class="slider-preview-viewport">
                                <!-- Guías de Drag -->
                                <div id="guide-v" class="drag-guide-v"></div>
                                <div id="guide-h" class="drag-guide-h"></div>
                                
                                <div id="preview-bg-image" class="absolute inset-0 bg-cover bg-center"></div>
                                <div id="preview-card" class="slider-preview-content">
                                    <div id="preview-badge" class="badge inline-block bg-blue-600 text-white rounded-full self-start mb-4 font-bold uppercase tracking-wider">
                                        Badge
                                    </div>
                                    <h2 id="preview-title" class="text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">Título del Slider</h2>
                                    <p id="preview-description" class="text-xl text-white/90 max-w-2xl mb-8 leading-relaxed drop-shadow-md">Descripción corta del slider.</p>
                                    <div id="preview-buttons" class="flex flex-wrap gap-4"></div>
                                </div>

                                <!-- Contenedor Principal Corregido -->
                                <div class="slider-main-container">
                                    <div id="preview-image-container" style="display: none;">
                                        <img id="preview-image" src="" alt="">
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div class="mt-6 w-full space-y-4">
                            <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <h4 class="text-xs font-black text-blue-600 uppercase mb-2 tracking-wider">Nota Informativa</h4>
                                <p class="text-xs text-blue-800 leading-relaxed">
                                    <i data-lucide="info" class="w-3 h-3 inline mr-1"></i>
                                    Los píxeles ingresados son relativos a un ancho de 1280px. El sistema ajustará automáticamente la posición para que se vea igual en cualquier tamaño de pantalla.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>

    </div>



    <!-- Scripts -->

    <script src="../assets/js/pages/admin/generales/menu.js"></script>

    <script src="../assets/js/pages/admin/sliders.js"></script>

</body>

</html>
