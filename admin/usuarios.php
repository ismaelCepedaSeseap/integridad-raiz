<?php
$actual = basename(__FILE__);
include_once "../assets/php/security/initSession.php";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Usuarios - Integridad desde la Raíz</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/pages/admin.css">
    <script src="https://cdn.tailwindcss.com"></script>
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
                    <a href="usuarios.php" id="nav-users" class="nav-item active">
                        <i data-lucide="users"></i>
                        <span>Usuarios</span>
                    </a>
                    <p class="nav-section-title">Gestión</p>
                    <a href="estados.php" id="nav-estados" class="nav-item">
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
                    <h1>Gestión de Usuarios</h1>
                    <p>Administra los accesos y roles de los usuarios del sistema.</p>
                </div>
                <div class="page-header__actions">
                    <button id="btn-add-user" class="btn btn-primary">
                        <i data-lucide="plus"></i> Nuevo Usuario
                    </button>
                </div>
            </header>

            <section class="content-section">
                <div class="table-controls">
                    <div class="table-search">
                        <i data-lucide="search"></i>
                        <input type="text" id="search-users" placeholder="Buscar usuario por nombre o correo...">
                    </div>
                    <div class="table-filter">
                        <select id="filter-state">
                            <option value="">Todos los estados</option>
                        </select>
                    </div>
                </div>

                <div class="table-container">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th class="px-8 py-4">Usuario</th>
                                    <th class="px-8 py-4">Rol</th>
                                    <th class="px-8 py-4">Estado</th>
                                    <th class="px-8 py-4">Estatus</th>
                                    <th class="px-8 py-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="user-table-body" class="text-sm divide-y divide-slate-100">
                                <tr>
                                    <td colspan="5" class="px-8 py-8 text-center text-slate-400">Cargando usuarios...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="pagination">
                    <span class="pagination-info">Mostrando <span id="showing-count">0</span> de <span id="total-count">0</span> usuarios</span>
                    <div class="pagination-controls">
                        <button class="btn-icon" disabled><i data-lucide="chevron-left"></i></button>
                        <button class="btn-icon" disabled><i data-lucide="chevron-right"></i></button>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <div id="modal-user" class="modal-overlay hidden">
        <div class="modal modal-xl">
            <div class="modal-header">
                <h3 id="modal-title">Nuevo Usuario</h3>
                <button id="btn-close-modal" class="btn-icon"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body">
                <form id="user-form"></form>
            </div>
            <div class="modal-actions">
                <button type="button" id="btn-cancel-modal" class="btn btn-secondary">Cancelar</button>
                <button type="button" id="btn-save-user" class="btn btn-primary">Guardar Usuario</button>
            </div>
        </div>
    </div>

    <script src="../assets/js/data/users-data.js"></script>
    <script src="../assets/js/pages/admin/generales/menu.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../assets/js/pages/admin/usuarios.js?v=20260303"></script>
    <script>lucide.createIcons();</script>
</body>
</html>
