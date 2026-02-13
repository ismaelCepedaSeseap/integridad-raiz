// Lógica del Slider Dinámico

// Variables de estado
let currentSlide = 0;
const totalSlides = sliderData.length;
let slideInterval;
let transitionTimeout;

// Elementos del DOM
const track = document.getElementById('slider-track');
const dotsContainer = document.getElementById('slider-dots');

function isVideoSource(src) {
    if (!src || typeof src !== 'string') return false;
    const clean = src.split('?')[0].split('#')[0].toLowerCase();
    return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.ogg');
}

function getVideoType(src) {
    const clean = src.split('?')[0].split('#')[0].toLowerCase();
    if (clean.endsWith('.webm')) return 'video/webm';
    if (clean.endsWith('.ogg')) return 'video/ogg';
    return 'video/mp4';
}

function ensureSliderVideoModal() {
    if (document.getElementById('slider-video-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'slider-video-modal';
    modal.className = 'fixed inset-0 z-[1000] hidden';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        <div class="relative w-full h-full flex items-center justify-center p-4">
            <div class="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <button type="button" id="slider-video-close" class="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
                <video id="slider-video-player" class="w-full h-auto max-h-[80vh] bg-black" controls playsinline></video>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#slider-video-close');
    const backdrop = modal.firstElementChild;

    if (closeBtn) closeBtn.addEventListener('click', () => window.closeSliderVideoModal());
    if (backdrop) backdrop.addEventListener('click', () => window.closeSliderVideoModal());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.closeSliderVideoModal();
    });
}

window.openSliderVideoModal = function(videoSrc) {
    if (!videoSrc || typeof videoSrc !== 'string') return;

    ensureSliderVideoModal();
    const modal = document.getElementById('slider-video-modal');
    const player = document.getElementById('slider-video-player');
    if (!modal || !player) return;

    if (slideInterval) clearInterval(slideInterval);

    player.src = videoSrc;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (window.lucide) lucide.createIcons();

    try {
        const p = player.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) {}
};

window.closeSliderVideoModal = function() {
    const modal = document.getElementById('slider-video-modal');
    const player = document.getElementById('slider-video-player');
    if (!modal || !player) return;

    modal.classList.add('hidden');
    document.body.style.overflow = '';

    try { player.pause(); } catch (_) {}
    player.removeAttribute('src');
    try { player.load(); } catch (_) {}

    resetTimer();
};

// Función para generar el HTML de un slide
function createSlideHTML(slide) {
    const getBtnStyle = (btn) => {
        if (btn.position) {
            return `position: absolute; left: ${btn.position.left || 'auto'}; top: ${btn.position.top || 'auto'}; right: ${btn.position.right || 'auto'}; bottom: ${btn.position.bottom || 'auto'}; z-index: 50;`;
        }
        return '';
    };

    if (slide.type === 'complex') {
        return `
            <div class="w-full flex-shrink-0 pt-16 pb-24 relative overflow-hidden" style="background: ${slide.background};">
                <div class="absolute -bottom-[10%] -left-[10%] -right-[10%] h-[60%] bg-[#ffcc00] rounded-[100%_100%_0_0] opacity-90 -z-0 pointer-events-none"></div>
                <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div class="md:w-1/2">
                        <span class="inline-block px-4 py-1 rounded-full bg-green-200 text-green-800 text-[10px] font-black mb-6 uppercase tracking-widest">${slide.badge}</span>
                        <h1 class="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-[1.1]">${slide.title}</h1>
                        <p class="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">${slide.description}</p>
                        <div class="flex flex-wrap gap-4 relative">
                            ${slide.buttons.map(btn => `
                                ${btn.videoSrc ? `
                                    <button type="button" onclick="openSliderVideoModal('${btn.videoSrc}')" style="${getBtnStyle(btn)}" class="px-8 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-xl hover:bg-green-700 transition-all flex items-center gap-2">
                                        <i data-lucide="${btn.icon}"></i> ${btn.text}
                                    </button>
                                ` : `
                                    <a href="${btn.url}" style="${getBtnStyle(btn)}" class="px-8 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-xl hover:bg-green-700 transition-all flex items-center gap-2">
                                        <i data-lucide="${btn.icon}"></i> ${btn.text}
                                    </a>
                                `}
                            `).join('')}
                        </div>
                    </div>
                    <div class="md:w-1/2 flex justify-center relative">
                        <div class="relative w-full max-w-lg aspect-square flex items-center justify-center">
                            <div class="absolute w-[85%] h-[85%] bg-white rounded-full shadow-2xl border-8 border-green-500/20"></div>
                            <img src="${slide.image}" alt="Imagen Slide" class="relative z-20 w-full h-auto transform scale-110 drop-shadow-2xl">
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        const bgSrc = slide.backgroundVideo || slide.backgroundImage;
        const isVideo = isVideoSource(bgSrc);
        const bgStyleAttr = !isVideo && bgSrc ? ` style="background-image: url('${bgSrc}');"` : '';
        const containerClasses = `w-full flex-shrink-0 relative pt-16 pb-24 overflow-hidden ${isVideo ? 'bg-black' : 'bg-cover bg-center'}`;

        return `
            <div class="${containerClasses}"${bgStyleAttr}>
                ${isVideo ? `
                    <video class="absolute inset-0 w-full h-full object-cover pointer-events-none" autoplay muted loop playsinline preload="metadata">
                        <source src="${bgSrc}" type="${getVideoType(bgSrc)}">
                    </video>
                    <div class="absolute inset-0 bg-black/20"></div>
                ` : ''}
                <div class="absolute inset-0 flex items-center justify-center">
                    ${slide.buttons.map(btn => `
                        ${btn.videoSrc ? `
                            <button type="button" onclick="openSliderVideoModal('${btn.videoSrc}')" style="${getBtnStyle(btn)}" class="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/50 text-white rounded-2xl font-bold shadow-xl hover:bg-white/30 hover:scale-105 transition-all flex items-center gap-2 text-xl">
                                <i data-lucide="${btn.icon}"></i> ${btn.text}
                            </button>
                        ` : `
                            <a href="${btn.url}" style="${getBtnStyle(btn)}" class="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/50 text-white rounded-2xl font-bold shadow-xl hover:bg-white/30 hover:scale-105 transition-all flex items-center gap-2 text-xl">
                                <i data-lucide="${btn.icon}"></i> ${btn.text}
                            </a>
                        `}
                    `).join('')}
                </div>
            </div>
        `;
    }
}

function syncSlideVideos() {
    if (!track) return;
    const videos = track.querySelectorAll('video');
    videos.forEach(v => {
        try { v.pause(); } catch (_) {}
    });

    const activeSlide = track.children[currentSlide];
    if (!activeSlide) return;
    activeSlide.querySelectorAll('video').forEach(v => {
        try {
            v.currentTime = v.currentTime || 0;
            const p = v.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
        } catch (_) {}
    });
}

// Inicializar Slider
function initSlider() {
    if (!track) return;

    // 1. Generar HTML de los slides
    let slidesHTML = sliderData.map(slide => createSlideHTML(slide)).join('');
    
    // 2. Agregar el clon del primer slide al final para el efecto infinito
    slidesHTML += createSlideHTML(sliderData[0]);

    // 3. Insertar en el track
    track.innerHTML = slidesHTML;

    // 4. Configurar anchos
    // El track debe medir (totalSlides + 1) * 100%
    track.style.width = `${(totalSlides + 1) * 100}%`;
    
    // Cada slide debe medir 100% / (totalSlides + 1) de ancho relativo al track?
    // NO, en el CSS original: track width=400% (para 4 slides), slide width=1/4 (25%).
    // Aquí, si tenemos N slides + 1 clon, el width es (N+1)*100%.
    // Y cada hijo debe tener width: 100% / (N+1).
    // O mejor, usamos flexbox y dejamos que cada hijo sea flex-1 o width exacto.
    // El CSS original usaba style="width: 400%" en el track y class="w-1/4" en los hijos.
    
    // Vamos a ajustar el ancho de los hijos dinámicamente
    const children = track.children;
    const slideWidthPercentage = 100 / (totalSlides + 1);
    
    for (let i = 0; i < children.length; i++) {
        children[i].style.width = `${slideWidthPercentage}%`;
    }

    // 5. Generar Dots
    if (dotsContainer) {
        dotsContainer.innerHTML = sliderData.map((_, index) => `
            <button onclick="goToSlide(${index})" class="w-3 h-3 rounded-full bg-green-600/20 dot hover:bg-green-600 hover:scale-125 transition-all cursor-pointer" id="dot-${index}"></button>
        `).join('');
    }

    // 6. Iniciar lógica de navegación
    updateDots();
    startTimer();
    syncSlideVideos();
    
    // Refrescar iconos Lucide
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Funciones de Control (Globales para que funcionen los onclick)
window.goToSlide = function(index) {
    if (transitionTimeout) clearTimeout(transitionTimeout);
    currentSlide = index;
    updateSlider(true);
    resetTimer();
}

window.nextSlideManual = function() {
    if (transitionTimeout) clearTimeout(transitionTimeout);
    nextSlide();
    resetTimer();
}

window.prevSlideManual = function() {
    prevSlide();
    resetTimer();
}

// Lógica interna
function updateSlider(withTransition = true) {
    if (!withTransition) {
        track.style.transition = 'none';
    } else {
        track.style.transition = 'transform 700ms ease-in-out';
    }
    
    // Calcular offset
    // Si tenemos 3 slides + 1 clon (total 4), cada uno es 25%.
    // Offset = -(currentSlide * (100 / (totalSlides + 1)))
    const percentage = 100 / (totalSlides + 1);
    const offset = -(currentSlide * percentage);
    track.style.transform = `translateX(${offset}%)`;
    
    updateDots();
    syncSlideVideos();
}

function updateDots() {
    // Si estamos en el clon (slide == totalSlides), iluminamos el dot 0
    let activeIndex = currentSlide;
    if (activeIndex >= totalSlides) activeIndex = 0;

    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === activeIndex) {
            dot.classList.remove('bg-green-600/20');
            dot.classList.add('bg-green-600', 'scale-125');
        } else {
            dot.classList.add('bg-green-600/20');
            dot.classList.remove('bg-green-600', 'scale-125');
        }
    });
}

function nextSlide() {
    // Si estamos en el clon, saltamos al inicio instantáneamente antes de avanzar
    // OJO: La lógica original era: 
    // Si currentSlide >= totalSlides (el clon), reset a 0 sin transición.
    
    // Nueva lógica robusta:
    // Si ya estamos visualmente en el clon (el último índice), primero reseteamos al 0 real sin transición.
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
        updateSlider(false);
        void track.offsetWidth; // Forzar reflow
    }

    currentSlide++;
    updateSlider(true);

    // Si acabamos de llegar al clon, programamos el reset silencioso
    if (currentSlide === totalSlides) {
        if (transitionTimeout) clearTimeout(transitionTimeout);
        transitionTimeout = setTimeout(() => {
            currentSlide = 0;
            updateSlider(false);
        }, 700); // Esperar a que termine la transición
    }
}

function prevSlide() {
    if (transitionTimeout) clearTimeout(transitionTimeout);

    if (currentSlide === 0) {
        currentSlide = totalSlides; // Ir al clon (último elemento visual)
        updateSlider(false);
        void track.offsetWidth;
        currentSlide--; // Ir al último real
        updateSlider(true);
    } else {
        currentSlide--;
        updateSlider(true);
    }
}

function startTimer() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

function resetTimer() {
    startTimer();
}

const header = document.getElementById('inicio');
if (header) {
    header.addEventListener('mouseenter', () => clearInterval(slideInterval));
    header.addEventListener('mouseleave', resetTimer);
}

// Arrancar al cargar
document.addEventListener('DOMContentLoaded', initSlider);
