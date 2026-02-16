// Función para cargar el footer en cualquier página
function cargarFooter() {
    const footerHTML = `
    <footer class="bg-slate-900 text-white py-12 text-center border-t border-green-800/30">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col lg:flex-row items-center justify-between gap-10 mb-12 opacity-80 hover:opacity-100 transition-opacity">
                <div class="flex-shrink-0">
                    <img src="images/golfoitsmo.png" alt="Logo Región" class="h-24 md:h-32 w-auto brightness-0 invert opacity-90 drop-shadow-sm">
                </div>
                <div class="hidden lg:block h-16 w-[1px] bg-white/10 mx-4"></div>
                <div class="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                    <div class="flex items-center gap-3"><a target="_blank" href="https://seseap.puebla.gob.mx/"><img src="images/logo_puebla.png" alt="Puebla" class="h-10 md:h-12 w-auto brightness-0 invert opacity-70" style="height: 164px;"></a></div>
                    <div class="flex items-center gap-3"><a target="_blank" href="https://sistemaanticorrupcion.hidalgo.gob.mx/"><img src="images/logo_hidalgo.png" alt="Hidalgo" class="h-10 md:h-12 w-auto brightness-0 invert opacity-70"></a></div>
                    <div class="flex items-center gap-3"><a target="_blank" href="https://saetlax.org/"><img src="images/logo_tlaxcala.png" alt="Tlaxcala" class="h-10 md:h-12 w-auto brightness-0 invert opacity-70"></a></div>
                </div>
            </div>
            <div class="w-full h-[1px] bg-white/5 mb-10"></div>
            <div class="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
                <div class="flex items-center gap-4">
                    <img src="images/logo.png" alt="Logo SEA" class="w-12 h-12 rounded-full border border-white/20">
                    <div class="text-left">
                        <h3 class="font-bold text-lg uppercase tracking-tighter leading-none">SESEA Puebla</h3>
                        <p class="text-green-500 text-[10px] font-black uppercase tracking-[0.2em]">Secretaría Ejecutiva</p>
                    </div>
                </div>
                <div class="hidden md:block w-[1px] h-6 bg-white/10 mx-2"></div>
                <p class="text-slate-500 italic text-sm">"Sembrando honestidad, cosechamos integridad"</p>
            </div>
        
            <div class="pt-8 border-t border-white/5 text-slate-600 text-[10px] uppercase tracking-[0.3em]" style="font-weight: bold;">
                © 2026 SESEA Puebla. Todos los derechos reservados.
            </div>
        </div>
    </footer>
    `;

    // Inserta el footer al final del body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
    // Reinicializar iconos Lucide si es necesario
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Ejecutar la función cuando cargue la página
// Usamos DOMContentLoaded para asegurar que el body esté listo, aunque insertAdjacentHTML funciona bien si el script está al final o defer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarFooter);
} else {
    cargarFooter();
}
