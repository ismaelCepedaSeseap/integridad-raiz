<?php
    $actual = basename(__FILE__);
    // include_once "../assets/php/security/initSession.php"; // Descomenta en producción
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Usuarios - SEA Puebla</title>
    <link rel="stylesheet" href="../assets/css/admin/usuarios.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>

</head>
<body class="text-slate-800">

    <div class="flex min-h-screen">
        <aside id="sidebar" class="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out lg:static">
            <div class="p-8">
                <div class="flex items-center gap-4 mb-10">
                    <img src="../images/logo.png" alt="Logo" class="w-12 h-12 rounded-full border-2 border-green-500 shadow-sm">
                    <div>
                        <h2 class="font-bold text-green-900 leading-tight">Super Admin</h2>
                        <span class="state-badge" style="font-size: 8px;">Puebla (Sede)</span>
                    </div>
                </div>

                <nav class="space-y-2">
                    <a href="dashboard.php" class="sidebar-item flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-500">
                        <i data-lucide="layout-dashboard" class="w-5 h-5"></i> General
                    </a>
                    <a href="#" class="sidebar-item active flex items-center gap-4 px-4 py-3 text-sm font-bold">
                        <i data-lucide="users" class="w-5 h-5"></i> Usuarios
                    </a>
                    <a href="#" class="sidebar-item flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-500">
                        <i data-lucide="settings" class="w-5 h-5"></i> Configuración
                    </a>
                </nav>

                <button class="mt-20 w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                    <i data-lucide="log-out" class="w-5 h-5"></i> Cerrar Sesión
                </button>
            </div>
        </aside>

        <main class="flex-1 p-6 lg:p-12 overflow-y-auto max-h-screen hide-scrollbar">
            
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 class="text-3xl font-bold text-slate-900 text-flex items-center gap-3">
                        <i data-lucide="user-cog" class="text-green-600"></i> Gestión de Usuarios
                    </h1>
                    <p class="text-slate-500 mt-1 font-medium italic">Alta, baja y modificación de cuentas de acceso</p>
                </div>
                
                <button onclick="abrirModalUsuario()" class="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                    <i data-lucide="user-plus" class="w-5 h-5"></i> Nuevo Usuario
                </button>
            </header>

            <div class="glass-card p-6 mb-8 flex flex-wrap gap-4 items-center justify-between">
                <div class="relative flex-1 min-w-[300px]">
                    <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></i>
                    <input type="text" placeholder="Buscar por nombre, correo o estado..." class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all">
                </div>
                <div class="flex gap-3">
                    <select class="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 focus:outline-none">
                        <option>Todos los Estados</option>
                        <option>Puebla</option>
                        <option>Hidalgo</option>
                        <option>Tlaxcala</option>
                    </select>
                </div>
            </div>

            <div class="glass-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <tr>
                                <th class="px-8 py-4">Usuario</th>
                                <th class="px-8 py-4">Rol / Nivel</th>
                                <th class="px-8 py-4">Estado Regional</th>
                                <th class="px-8 py-4">Estatus</th>
                                <th class="px-8 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="user-table-body" class="text-sm divide-y divide-slate-100">
                            </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../assets/js/pages/admin/generales/menu.js"></script>
    <script src="../assets/js/pages/admin/usuarios.js"></script>
    <script>
        
    </script>
</body>
</html>