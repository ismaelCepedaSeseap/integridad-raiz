// Lógica para renderizar la sección de Último Evento

function initEvent() {
    const container = document.getElementById('event-container');
    if (!container) return;

    // Buscar el primer evento marcado como visible
    // Asume que eventsList está definido en event-data.js
    const eventData = typeof eventsList !== 'undefined' 
        ? eventsList.find(e => e.visible) 
        : null;

    if (!eventData) {
        // Si no hay evento visible, ocultamos la sección
        const section = document.getElementById('ultimo-evento');
        if (section) section.style.display = 'none';
        return;
    }

    // Renderizar sección principal del evento
    container.innerHTML = `
        <div class="event-main-card">
            <!-- Header del Evento -->
            <div class="p-6 sm:p-10 lg:p-16 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center bg-gradient-to-br from-green-50 to-white">
                <div class="lg:w-1/2">
                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-green-200 text-green-700 text-xs font-black mb-6 uppercase tracking-widest shadow-sm">
                        <i data-lucide="sparkles" class="w-4 h-4 fill-green-500 text-green-500"></i> ${eventData.badge}
                    </div>
                    <h2 class="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight italic">${eventData.title}</h2>
                    <p class="text-lg text-slate-600 mb-8 leading-relaxed italic">${eventData.description}</p>
                     <div class="flex flex-wrap gap-4 mb-8">
                    <div class="bg-slate-50 px-4 py-2 rounded-xl text-slate-500 font-bold text-xs flex items-center gap-2">
                        <i data-lucide="map-pin" class="w-4 h-4"></i> ${eventData.location}
                    </div>
                    <div class="bg-slate-50 px-4 py-2 rounded-xl text-slate-500 font-bold text-xs flex items-center gap-2">
                        <i data-lucide="calendar" class="w-4 h-4"></i> ${eventData.date}
                    </div>
                </div>
                    ${eventData.url && eventData.url !== '#' ? `
                        <a href="${eventData.url}" class="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-green-700 transition-all flex items-center gap-3">
                            <i data-lucide="plus-circle"></i> Ver Detalles del Evento
                        </a>
                    ` : ''}
                </div>

                <div class="lg:w-1/2 relative">
                    ${eventData.decorations && eventData.decorations.topLeft ? `
                        <div class="absolute -left-6 -top-6 w-24 z-20 banderin-float"><img src="${eventData.decorations.topLeft}" class="rounded-xl shadow-lg" onerror="this.src='https://via.placeholder.com/100?text=Logo'"></div>
                    ` : ''}
                    <div class="rounded-[3rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white aspect-video relative z-10 cursor-pointer" onclick="openLightbox('${eventData.mainImage}')">
                        <img src="${eventData.mainImage}" class="w-full h-full object-cover">
                    </div>
                    ${eventData.decorations && eventData.decorations.bottomRight ? `
                        <div class="absolute -right-6 -bottom-6 w-24 z-20 banderin-float" style="animation-delay: -1.5s;"><img src="${eventData.decorations.bottomRight}" class="rounded-xl shadow-lg" onerror="this.src='https://via.placeholder.com/100?text=Logo'"></div>
                    ` : ''}
                </div>
            </div>


            <!-- Galería con Slider (Opcional) -->
            ${eventData.gallery && eventData.gallery.length > 0 ? `
                <div class="p-10 border-t border-slate-100 bg-white">
                    <div class="flex justify-between items-center mb-8">
                        <h3 class="text-xl font-black text-slate-900 uppercase italic">Galería de Momentos</h3>
                        <div class="flex gap-2">
                            <button onclick="scrollGallery('left')" class="p-2 rounded-full bg-slate-100 hover:bg-green-600 hover:text-white transition"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
                            <button onclick="scrollGallery('right')" class="p-2 rounded-full bg-slate-100 hover:bg-green-600 hover:text-white transition"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
                        </div>
                    </div>

                    <div id="gallery-slider" class="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth mb-4 pb-4">
                        ${eventData.gallery.map(img => `
                            <div class="gallery-item" onclick="openLightbox('${img}')"><img src="${img}" class="w-full h-full object-cover"></div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    // Reinicializar iconos Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Funciones globales para la galería (manteniendo compatibilidad)
window.scrollGallery = function(direction) {
    const slider = document.getElementById('gallery-slider');
    if (slider) {
        const scrollAmount = 300;
        slider.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
};

window.openLightbox = function(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.style.display = 'flex';
        // Pequeño timeout para permitir la transición de opacidad si la hubiera
        setTimeout(() => lightbox.classList.add('active'), 10);
    }
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        lightbox.classList.remove('active');
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initEvent);
