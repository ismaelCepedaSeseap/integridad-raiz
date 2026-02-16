<?php
    $actual = basename(__FILE__);
    include_once "../assets/php/security/initSession.php";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Integridad desde la Raíz</title>
    <link rel="stylesheet" href="../assets/css/admin/dashboard.css">

    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="text-slate-800">
    <div class="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100">
        <div class="flex items-center gap-3">
            <img src="../assets/images/logo.png" alt="Logo" class="w-10 h-10 rounded-full border-2 border-green-500">
            <span class="font-bold text-lg text-green-900">SEA Puebla</span>
        </div>
        <button onclick="toggleSidebar()" class="p-2 text-slate-600">
            <i data-lucide="menu"></i>
        </button>
    </div>

    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <?php include_once "generales/menu.php";?>

        <!-- Main Content -->
        <main class="flex-1 p-6 lg:p-12 overflow-y-auto max-h-screen hide-scrollbar">
            <!-- Header -->
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 class="text-3xl font-bold text-slate-900">¡Hola, <span id="user-name-display">Administrador</span>! 👋</h1>
                    <p class="text-slate-500 mt-1 font-medium italic" id="welcome-message">Gestionando la integridad a nivel regional</p>
                </div>
                <div class="flex items-center gap-4 bg-white p-3 rounded-3xl shadow-sm border border-slate-100">
                    <div class="hidden md:block text-right px-2">
                        <p class="text-sm font-bold text-slate-900" id="header-user-name">Admin User</p>
                        <span id="state-badge-header" class="state-badge">Cargando...</span>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                        <img id="user-avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar">
                    </div>
                </div>
            </header>

            <!-- Stats Overview -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div class="glass-card p-6 border-b-4 border-green-500">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-green-100 text-green-600 rounded-2xl"><i data-lucide="users"></i></div>
                        <span class="text-green-500 text-xs font-bold">+12% hoy</span>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900">248</h3>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Usuarios Registrados</p>
                </div>
                <div class="glass-card p-6 border-b-4 border-blue-500">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-blue-100 text-blue-600 rounded-2xl"><i data-lucide="calendar"></i></div>
                        <span class="text-blue-500 text-xs font-bold">3 próximos</span>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900">12</h3>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Eventos en <span class="state-text">...</span></p>
                </div>
                <div class="glass-card p-6 border-b-4 border-yellow-500">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-yellow-100 text-yellow-600 rounded-2xl"><i data-lucide="message-square"></i></div>
                        <span class="text-yellow-500 text-xs font-bold">15 nuevos</span>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900">1,204</h3>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Compromisos</p>
                </div>
                <div class="glass-card p-6 border-b-4 border-slate-800">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-slate-100 text-slate-800 rounded-2xl"><i data-lucide="shield-check"></i></div>
                        <span class="text-slate-500 text-xs font-bold">Estable</span>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900">100%</h3>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Status Sistema</p>
                </div>
            </div>

            <!-- Modules Grid -->
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <i data-lucide="layout-grid" class="w-5 h-5 text-green-600"></i> Módulos Disponibles
                </h2>
                <!-- Switcher para propósitos de DEMO -->
                <div class="flex gap-2 p-1 bg-slate-100 rounded-xl text-[10px] font-black uppercase">
                    <button onclick="setUserRole('SUPER')" class="px-2 py-1 rounded-lg hover:bg-white transition-all">Super</button>
                    <button onclick="setUserRole('HIDALGO')" class="px-2 py-1 rounded-lg hover:bg-white transition-all">Hidalgo</button>
                    <button onclick="setUserRole('TLAXCALA')" class="px-2 py-1 rounded-lg hover:bg-white transition-all">Tlaxcala</button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Gestión de Usuarios -->
                <div id="module-users" class="module-card glass-card p-8 group cursor-pointer">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-16 h-16 rounded-3xl bg-green-600 text-white flex items-center justify-center shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                            <i data-lucide="user-cog" class="w-8 h-8"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg text-slate-900">Usuarios</h3>
                            <p class="text-xs text-slate-400">Altas, bajas y cambios</p>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <button class="w-full text-left p-3 text-sm font-bold text-slate-600 hover:text-green-600 flex items-center justify-between rounded-xl hover:bg-green-50 transition-colors">
                            Crear nuevo usuario <i data-lucide="plus-circle" class="w-4 h-4"></i>
                        </button>
                        <button class="w-full text-left p-3 text-sm font-bold text-slate-600 hover:text-green-600 flex items-center justify-between rounded-xl hover:bg-green-50 transition-colors">
                            Listado completo <i data-lucide="chevron-right" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <!-- Gestión de Eventos -->
                <div class="module-card glass-card p-8 group cursor-pointer">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                            <i data-lucide="calendar-days" class="w-8 h-8"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg text-slate-900">Eventos / Rally</h3>
                            <p class="text-xs text-slate-400">Solo en <span class="state-text">...</span></p>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <button class="w-full text-left p-3 text-sm font-bold text-slate-600 hover:text-blue-600 flex items-center justify-between rounded-xl hover:bg-blue-50 transition-colors">
                            Programar Rally <i data-lucide="plus-circle" class="w-4 h-4"></i>
                        </button>
                        <button class="w-full text-left p-3 text-sm font-bold text-slate-600 hover:text-blue-600 flex items-center justify-between rounded-xl hover:bg-blue-50 transition-colors">
                            Galería y Recap <i data-lucide="image" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <!-- Gestión de Contenidos -->
                <div class="module-card glass-card p-8 group cursor-pointer">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-16 h-16 rounded-3xl bg-yellow-500 text-white flex items-center justify-center shadow-lg shadow-yellow-200 group-hover:scale-110 transition-transform">
                            <i data-lucide="file-edit" class="w-8 h-8"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg text-slate-900">Contenidos</h3>
                            <p class="text-xs text-slate-400">Tips, Árbol y Banners</p>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <button class="w-full text-left p-3 text-sm font-bold text-slate-600 hover:text-yellow-600 flex items-center justify-between rounded-xl hover:bg-yellow-50 transition-colors">
                            Editar Frutos/Tips <i data-lucide="tree-pine" class="w-4 h-4"></i>
                        </button>
                        <button class="w-full text-left p-3 text-sm font-bold text-slate-600 hover:text-yellow-600 flex items-center justify-between rounded-xl hover:bg-yellow-50 transition-colors">
                            Banners del Muro <i data-lucide="layout" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <div class="mt-12 glass-card overflow-hidden">
                <div class="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 class="font-bold text-lg">Últimos Compromisos Recibidos</h3>
                        <p class="text-xs text-slate-400 font-medium">Mostrando registros de: <span class="state-text font-black text-green-600 uppercase tracking-widest">Nacional</span></p>
                    </div>
                    <button class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">Exportar Reporte</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <tr>
                                <th class="px-8 py-4">Usuario</th>
                                <th class="px-8 py-4">Estado</th>
                                <th class="px-8 py-4">Compromiso</th>
                                <th class="px-8 py-4">Fecha</th>
                                <th class="px-8 py-4">Acción</th>
                            </tr>
                        </thead>
                        <tbody id="table-body" class="text-sm divide-y divide-slate-100">
                            <!-- Inyectado por JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../assets/js/pages/admin/generales/menu.js"></script>
    <script src="../assets/js/pages/dashboard.js"></script>
</body>
</html>