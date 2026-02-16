<aside id="sidebar" class="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out lg:static">
            <div class="p-8">
                <div class="flex items-center gap-4 mb-10">
                    <img src="../assets/images/logo.png" alt="Logo SEA" class="w-12 h-12 rounded-full border-2 border-green-500 shadow-sm">
                    <div>
                        <h2 class="font-bold text-green-900 leading-tight" id="sidebar-user-role">Super Admin</h2>
                        <div id="state-display-sidebar" class="mt-1">
                            <!-- Inyectado por JS -->
                        </div>
                    </div>
                </div>

                <nav class="space-y-2">
                    <a href="#" class="sidebar-item active flex items-center gap-4 px-4 py-3 text-sm font-bold">
                        <i data-lucide="layout-dashboard" class="w-5 h-5"></i> General
                    </a>
                    <a href="#" id="nav-users" class="sidebar-item flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-500">
                        <i data-lucide="users" class="w-5 h-5"></i> Usuarios
                    </a>
                    <a href="#" class="sidebar-item flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-500">
                        <i data-lucide="calendar" class="w-5 h-5"></i> Eventos
                    </a>
                    <a href="#" class="sidebar-item flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-500">
                        <i data-lucide="message-square" class="w-5 h-5"></i> Compromisos
                    </a>
                    <a href="#" class="sidebar-item flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-500">
                        <i data-lucide="settings" class="w-5 h-5"></i> Configuración
                    </a>
                </nav>

                <div class="mt-20 p-6 rounded-3xl bg-green-50 border border-green-100">
                    <p class="text-xs font-bold text-green-800 mb-2">Filtro Regional</p>
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-green-500"></div>
                        <span id="state-filter-status" class="text-[10px] text-green-600 font-bold uppercase tracking-widest">Nivel Nacional</span>
                    </div>
                </div>

                <button id="cerrarSesion" class="mt-8 w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                    <i data-lucide="log-out" class="w-5 h-5"></i> Cerrar Sesión
                </button>
            </div>
        </aside>