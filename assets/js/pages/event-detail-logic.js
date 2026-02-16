// Lógica para la página detalle_evento.html
// Depende de events-page-data.js

let visorIndex = 0;
let currentVisorEvent = null;
let visorInterval;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderEventDetail();
});

function renderEventDetail() {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id') || 'rally-puebla-2025'; // Fallback por si no hay ID
    const event = EVENTS.find(e => e.id === eventId);
    const container = document.getElementById('event-container');

    if (!event) {
        container.innerHTML = `<div class="flex items-center justify-center min-h-screen text-2xl font-bold text-slate-500">Evento no encontrado</div>`;
        return;
    }

    let pillarsHtml = '';
    if (event.banners && event.banners.length > 0) {
            pillarsHtml = event.banners.map(banner => `
            <div class="banner-roll-up h-[500px] w-auto flex-shrink-0 hover:scale-105 transition-transform duration-300">
                <img src="${banner}" class="h-full w-auto rounded-3xl shadow-xl" onerror="this.src='https://via.placeholder.com/300x500?text=Pilar'">
            </div>
        `).join('');
    } else if (event.pillars) {
        pillarsHtml = event.pillars.map((pillar) => `
            <div class="banner-roll-up min-w-[180px] h-[240px] bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg border-2 border-green-100 flex flex-col items-center justify-center p-4 text-center group hover:border-green-400 transition-all relative overflow-hidden flex-shrink-0">
                <div class="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 group-hover:scale-110 transition-transform">
                    <i data-lucide="star" class="w-8 h-8"></i>
                </div>
                <h4 class="text-xl font-bold text-slate-800 font-kids">${pillar}</h4>
                <div class="absolute bottom-0 right-0 opacity-10">
                    <i data-lucide="shield" class="w-24 h-24 text-green-800"></i>
                </div>
            </div>
        `).join('');
    }

    // --- NEW: Dynamic Chronicle Section ---
    let chronicleHtml = '';
    if (event.chronicle) {
        const contentHtml = Array.isArray(event.chronicle.content) 
            ? event.chronicle.content.map(p => `<p class="text-slate-600 leading-relaxed">${p}</p>`).join('')
            : `<p class="text-slate-600 leading-relaxed">${event.chronicle.content}</p>`;

        const valuesHtml = event.chronicle.values && event.chronicle.values.length > 0
            ? `<div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 my-6">
                 <h4 class="font-bold text-slate-800 mb-2 flex items-center gap-2"><i data-lucide="award" class="text-green-600 w-5 h-5"></i> Valores Abanderados</h4>
                 <p class="text-slate-600 text-sm">${event.chronicle.values.join(', ')}.</p>
               </div>`
            : '';
            
        const footerHtml = event.chronicle.footer 
            ? `<p class="text-slate-500 text-sm italic border-t border-slate-100 pt-4 mt-4">${event.chronicle.footer}</p>`
            : '';

        chronicleHtml = `
            <!-- Descripción Tipo Noticia -->
            <div class="mb-24 border-t border-b border-slate-100 py-16">
                <div class="flex flex-col md:flex-row gap-12 items-start">
                    <div class="w-full md:w-1/3 text-center md:text-right md:sticky md:top-24">
                        <span class="inline-block px-4 py-2 rounded-full bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest mb-4">${event.chronicle.label || 'Crónica del Evento'}</span>
                        <h3 class="text-3xl font-black text-slate-900 leading-tight mb-4 font-kids italic">${event.chronicle.title}</h3>
                        <p class="text-green-600 font-bold text-sm uppercase tracking-widest mb-2">${event.chronicle.date}</p>
                        <p class="text-slate-400 text-xs font-semibold">${event.chronicle.location}</p>
                    </div>
                    <div class="w-full md:w-2/3 border-l-0 md:border-l-4 border-green-500 pl-0 md:pl-12 space-y-6 max-h-[600px] overflow-y-auto pr-4" id="chronicle-scroll">


                        <p class="text-xl text-slate-700 leading-relaxed font-serif italic font-medium">
                            ${event.chronicle.quote} <br>
                            <span class="text-sm not-italic text-slate-400 font-sans font-bold uppercase mt-2 block">${event.chronicle.quoteAuthor}</span>
                        </p>
                        
                        ${contentHtml}

                        ${valuesHtml}

                        ${footerHtml}
                    </div>
                </div>
            </div>
        `;
    }

    // --- NEW: Dynamic Results Section ---
    let resultsHtml = '';
    if (event.results && event.results.length > 0) {
        const resultsItems = event.results.map(item => `
            <div class="bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                <p class="text-6xl font-black mb-4">${item.value}</p>
                <p class="text-sm font-bold uppercase tracking-widest text-green-300">${item.label}</p>
            </div>
        `).join('');

        resultsHtml = `
            <!-- Impact Footer Full Width -->
            <div class="bg-green-900 py-24 text-center text-white">
                <div class="max-w-7xl mx-auto px-6">
                    <h3 class="text-3xl font-kids text-yellow-400 mb-12 tracking-widest uppercase italic">Cosechando Resultados Reales</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                        ${resultsItems}
                    </div>
                </div>
            </div>
        `;
    }

    const galleryHtml = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
            <div class="text-center mb-16">
                <h3 class="text-4xl font-kids text-slate-900 tracking-tighter uppercase mb-4 italic">Galería</h3>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-sm">Explora los momentos más memorables</p>
            </div>

            <div class="visor-container group animate-fade-in">
                <div id="visor-slides">
                    ${event.gallery.map((img, index) => `
                        <div class="visor-slide ${index === 0 ? 'active' : ''}">
                            <img src="${img}" />
                        </div>
                    `).join('')}
                </div>

                <div class="visor-overlay"></div>

                <button onclick="manualMoveVisor(-1)" class="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all shadow-2xl opacity-0 group-hover:opacity-100 border border-white/20">
                    <i data-lucide="chevron-left" class="w-6 h-6 sm:w-8 sm:h-8"></i>
                </button>
                <button onclick="manualMoveVisor(1)" class="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all shadow-2xl opacity-0 group-hover:opacity-100 border border-white/20">
                    <i data-lucide="chevron-right" class="w-6 h-6 sm:w-8 sm:h-8"></i>
                </button>

                <div class="absolute bottom-4 left-4 sm:bottom-10 sm:left-10 z-10 text-white animate-fade-in">
                    <span id="slide-region" class="bg-green-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 inline-block">Cargando...</span>
                    <h2 id="slide-title" class="text-xl sm:text-3xl font-bold tracking-tight">Cargando galería</h2>
                    <p id="slide-date" class="text-white/60 font-medium text-sm">Espere un momento</p>
                </div>

                <div class="absolute top-4 right-4 sm:top-10 sm:right-10 z-10 bg-black/40 backdrop-blur-lg px-4 sm:px-6 py-2 rounded-full text-white font-bold text-sm border border-white/10">
                    <span id="visor-index">01</span> / <span id="visor-total">00</span>
                </div>
            </div>

            <div class="relative">
                <button onclick="scrollThumbs('left')" class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur shadow-lg p-2 rounded-full hover:bg-white transition-all text-slate-800 border border-slate-100 hidden md:flex">
                    <i data-lucide="chevron-left" class="w-6 h-6"></i>
                </button>
                <div class="thumb-strip hide-scrollbar mt-8" id="thumb-strip">
                    ${event.gallery.map((img, index) => `
                        <div class="thumb-item ${index === 0 ? 'active' : ''}" onclick="jumpToVisorSlide(${index})"><img src="${img}" class="w-full h-full object-cover"></div>
                    `).join('')}
                </div>
                <button onclick="scrollThumbs('right')" class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur shadow-lg p-2 rounded-full hover:bg-white transition-all text-slate-800 border border-slate-100 hidden md:flex">
                    <i data-lucide="chevron-right" class="w-6 h-6"></i>
                </button>
            </div>
        </div>
    `;

    container.innerHTML = `
        <!-- Hero Full Width -->
        <div class="hero-full">
            <img src="${event.imageUrl}" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-black/30"></div>
            
            <!-- Botón Regresar -->
            <a href="eventos.html" class="absolute top-4 left-4 sm:top-8 sm:left-8 z-20 bg-black/20 hover:bg-black/40 text-white backdrop-blur-md px-4 sm:px-5 py-2 rounded-full transition-all shadow-lg font-bold flex items-center gap-2 group border border-white/10">
                <i data-lucide="arrow-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform"></i>
                <span>Eventos</span>
            </a>

            <div class="absolute bottom-0 left-0 w-full px-6 sm:px-12 md:px-24 pb-0 md:pb-4">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-5xl md:text-8xl font-bold text-slate-900 leading-tight tracking-tighter drop-shadow-sm animate-zoom-in">${event.title}</h2>
                </div>
            </div>
        </div>

        <!-- Content Wrapper centered -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12">
            
            <!-- Badges -->
            <div class="flex flex-wrap gap-4 mb-16 animate-fade-in">
                    <div class="bg-green-50 text-green-700 px-4 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center gap-3 shadow-sm border border-green-100">
                    <i data-lucide="calendar" class="w-5 h-5 sm:w-6 sm:h-6"></i> ${event.date}
                    </div>
                    <div class="bg-blue-50 text-blue-700 px-4 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center gap-3 shadow-sm border border-blue-100">
                    <i data-lucide="map-pin" class="w-5 h-5 sm:w-6 sm:h-6"></i> ${event.location}
                    </div>
            </div>

            <!-- Intro Section -->
            <div class="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start mb-16 sm:mb-24">
                <div class="space-y-6 sm:space-y-8">
                        <h3 class="text-3xl sm:text-4xl font-kids text-slate-800 italic">${event.slogan || '¡La Integridad en Acción!'}</h3>
                        <p class="text-base sm:text-xl text-slate-600 leading-relaxed font-medium">${event.description}</p>
                        <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2 sm:pt-4">
                        <div class="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-slate-50 flex items-center gap-4 flex-1 min-w-0">
                            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                                <i data-lucide="users"></i>
                            </div>
                            <div class="min-w-0"><p class="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Impacto</p><p class="text-lg sm:text-xl font-bold break-words">${event.impact || 'N/A'}</p></div>
                        </div>
                        <div class="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-slate-50 flex items-center gap-4 flex-1 min-w-0">
                            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                                <i data-lucide="shield-check"></i>
                            </div>
                            <div class="min-w-0"><p class="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Valores</p><p class="text-lg sm:text-xl font-bold break-words">${event.pillars_count || 'Varios'}</p></div>
                        </div>
                    </div>
                </div>
                <div class="relative group max-w-xl lg:max-w-none mx-auto w-full">
                    <div class="hidden sm:block absolute -left-4 sm:-left-10 -top-4 sm:-top-10 w-28 sm:w-40 banderin-float z-20"><img src="assets/images/rally/banderin_1.png" class="rounded-3xl shadow-2xl" onerror="this.src='https://via.placeholder.com/150'"></div>
                    <div class="photo-frame-polaroid rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden w-full aspect-[4/3] bg-slate-200 sm:rotate-2 group-hover:rotate-0 transition-transform duration-700">
                        <img src="${event.gallery && event.gallery.length > 0 ? event.gallery[0] : event.imageUrl}" class="w-full h-full object-cover">
                    </div>
                    <div class="hidden sm:block absolute -right-4 sm:-right-10 -bottom-4 sm:-bottom-10 w-28 sm:w-40 banderin-float z-20" style="animation-delay:-2s"><img src="assets/images/rally/banderin_2.png" class="rounded-3xl shadow-2xl" onerror="this.src='https://via.placeholder.com/150'"></div>
                </div>
            </div>

            ${chronicleHtml}

            <!-- Pilares Section (Full Width Scroll inside centered container) -->
            <div class="mb-24">
                <div class="flex items-center justify-between mb-10">
                    <h3 class="text-3xl font-kids text-slate-900 italic tracking-tighter uppercase">Pilares Éticos</h3>
                    <div class="flex gap-3">
                        <button onclick="scrollBanners('left')" class="p-3 bg-slate-100 shadow-sm rounded-full hover:bg-green-600 hover:text-white transition-all"><i data-lucide="chevron-left" class="w-6 h-6"></i></button>
                        <button onclick="scrollBanners('right')" class="p-3 bg-slate-100 shadow-sm rounded-full hover:bg-green-600 hover:text-white transition-all"><i data-lucide="chevron-right" class="w-6 h-6"></i></button>
                    </div>
                </div>
                <div id="banner-scroll" class="flex gap-8 overflow-x-auto hide-scrollbar py-6 px-2 scroll-smooth">
                    ${pillarsHtml}
                </div>
            </div>
        </div>

        <!-- Gallery Section -->
        ${galleryHtml}

        ${resultsHtml}
    `;
    currentVisorEvent = event;
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    initVisor();
}

window.scrollBanners = function(dir) {
    const container = document.getElementById('banner-scroll');
    if (container) {
        container.scrollLeft += (dir === 'left' ? -300 : 300); 
    }
}

window.scrollThumbs = function(dir) {
    const container = document.getElementById('thumb-strip');
    if (container) {
        container.scrollLeft += (dir === 'left' ? -300 : 300); 
    }
}

function initVisor() {
    const slides = document.querySelectorAll('.visor-slide');
    const totalEl = document.getElementById('visor-total');
    if (!slides.length) return;
    if (totalEl) totalEl.textContent = String(slides.length).padStart(2, '0');
    visorIndex = 0;
    updateVisor();
    startVisorAutoplay();
}

function startVisorAutoplay() {
    clearInterval(visorInterval);
    visorInterval = setInterval(() => {
        moveVisor(1);
    }, 5000); // Cambia cada 5 segundos
}

function resetVisorAutoplay() {
    clearInterval(visorInterval);
    startVisorAutoplay();
}

function updateVisor() {
    const slides = document.querySelectorAll('.visor-slide');
    const thumbs = document.querySelectorAll('#thumb-strip .thumb-item');
    const indexEl = document.getElementById('visor-index');
    const regionEl = document.getElementById('slide-region');
    const titleEl = document.getElementById('slide-title');
    const dateEl = document.getElementById('slide-date');
    if (!slides.length || !thumbs.length) return;

    slides.forEach((slide, idx) => slide.classList.toggle('active', idx === visorIndex));
    thumbs.forEach((thumb, idx) => thumb.classList.toggle('active', idx === visorIndex));
    if (indexEl) indexEl.textContent = String(visorIndex + 1).padStart(2, '0');
    if (currentVisorEvent) {
        if (regionEl) regionEl.textContent = currentVisorEvent.state;
        if (titleEl) titleEl.innerHTML = currentVisorEvent.title;
        if (dateEl) dateEl.textContent = currentVisorEvent.date;
    }
}

function moveVisor(direction) {
    const slides = document.querySelectorAll('.visor-slide');
    if (!slides.length) return;
    visorIndex = (visorIndex + direction + slides.length) % slides.length;
    updateVisor();
}

// Wrapper para botones manuales
window.manualMoveVisor = function(direction) {
    moveVisor(direction);
    resetVisorAutoplay();
}

window.jumpToVisorSlide = function(index) {
    const slides = document.querySelectorAll('.visor-slide');
    if (!slides.length) return;
    visorIndex = index;
    updateVisor();
    resetVisorAutoplay();
}
