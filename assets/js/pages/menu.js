// Función para cargar el menú en cualquier página
function cargarMenu() {
    const navHTML = `
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-20 items-center">
                <!-- Logo -->
                <div class="flex items-center gap-4">
                    <a href="index.html" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img src="assets/images/logo.png" alt="Logo SEA" class="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-green-500">
                        <span class="font-bold text-lg md:text-2xl text-green-900 leading-tight truncate max-w-[200px] md:max-w-none">Integridad desde la Raíz</span>
                    </a>
                </div>
                
                <!-- Desktop Menu -->
                <div class="hidden lg:flex space-x-8">
                    <a href="index.html#inicio" class="text-slate-600 hover:text-green-600 font-bold transition-colors text-sm uppercase tracking-wide">Inicio</a>
                    <a href="cine.html" class="text-slate-600 hover:text-green-600 font-bold transition-colors text-sm uppercase tracking-wide">Cine</a>
                    <a href="eventos.html" class="text-slate-600 hover:text-green-600 font-bold transition-colors text-sm uppercase tracking-wide">Eventos</a>
                    <a href="index.html#muro" class="text-slate-600 hover:text-green-600 font-bold transition-colors text-sm uppercase tracking-wide">Muro</a>
                    
                </div>

                <!-- Mobile Menu Button -->
                <div class="lg:hidden flex items-center">
                    <button id="mobile-menu-btn" class="text-slate-600 hover:text-green-600 focus:outline-none p-2 rounded-lg hover:bg-slate-100 transition-colors">
                        <i data-lucide="menu" id="menu-icon-open" class="w-8 h-8"></i>
                        <i data-lucide="x" id="menu-icon-close" class="w-8 h-8 hidden"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu Panel -->
        <div id="mobile-menu" class="hidden lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 absolute w-full left-0 shadow-xl transition-all duration-300 origin-top transform">
            <div class="px-6 py-8 space-y-4 flex flex-col h-screen sm:h-auto">
                <a href="index.html#inicio" class="block w-full text-center px-4 py-4 rounded-2xl text-xl font-bold text-slate-700 hover:text-green-600 hover:bg-green-50 transition-all border border-transparent hover:border-green-100">Inicio</a>
                <a href="cine.html" class="block w-full text-center px-4 py-4 rounded-2xl text-xl font-bold text-slate-700 hover:text-green-600 hover:bg-green-50 transition-all border border-transparent hover:border-green-100">Cine</a>
                <a href="eventos.html" class="block w-full text-center px-4 py-4 rounded-2xl text-xl font-bold text-slate-700 hover:text-green-600 hover:bg-green-50 transition-all border border-transparent hover:border-green-100">Eventos</a>
                <a href="index.html#muro" class="block w-full text-center px-4 py-4 rounded-2xl text-xl font-bold text-slate-700 hover:text-green-600 hover:bg-green-50 transition-all border border-transparent hover:border-green-100">Muro</a>
                
            </div>
        </div>
    </nav>
    `;

    // Inserta el menú al principio del body
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // Inicializar iconos Lucide
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }

    // Lógica del menú móvil
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const openIcon = document.getElementById('menu-icon-open');
    const closeIcon = document.getElementById('menu-icon-close');

    if (btn && menu) {
        // Usar tanto click como touchend para asegurar compatibilidad en móviles
        const toggleMenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isHidden = menu.classList.contains('hidden');
            
            if (isHidden) {
                menu.classList.remove('hidden');
                if (openIcon) openIcon.classList.add('hidden');
                if (closeIcon) closeIcon.classList.remove('hidden');
            } else {
                menu.classList.add('hidden');
                if (openIcon) openIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            }
            
            // Recrear iconos para asegurar que Lucide los renderice
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        };

        btn.addEventListener('click', toggleMenu);
        
        // Cerrar menú al hacer click en un enlace
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
                if (openIcon && closeIcon) {
                    openIcon.classList.remove('hidden');
                    closeIcon.classList.add('hidden');
                }
            });
        });

        // Cerrar al hacer click fuera
        document.addEventListener('click', (e) => {
            if (menu && !menu.classList.contains('hidden')) {
                if (!menu.contains(e.target) && !btn.contains(e.target)) {
                    menu.classList.add('hidden');
                    if (openIcon && closeIcon) {
                        openIcon.classList.remove('hidden');
                        closeIcon.classList.add('hidden');
                    }
                }
            }
        });
    }
}

// Ejecutar la función inmediatamente si es posible, o en DOMContentLoaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    cargarMenu();
} else {
    document.addEventListener('DOMContentLoaded', cargarMenu);
}
