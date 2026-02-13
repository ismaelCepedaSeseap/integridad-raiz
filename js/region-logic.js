document.addEventListener('DOMContentLoaded', () => {
    const statesContainer = document.getElementById('states-container');

    if (statesContainer && typeof statesData !== 'undefined') {
        // Limpiamos el contenedor por si acaso
        statesContainer.innerHTML = '';

        const socialIcons = {
            facebook: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
            twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768m2.464-2.464l6.768-6.768"/></svg>',
            instagram: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
            tiktok: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>',
            youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>',
            spotify: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5-1 4-1 4 1 4 1"/><path d="M7 11.5s2-1.5 5-1.5 5 1.5 5 1.5"/><path d="M6 9s2.5-2 6-2 6 2 6 2"/></svg>'
        };

        statesData.forEach(region => {
            const regionSection = document.createElement('section');
            regionSection.className = 'py-12 md:py-20 bg-slate-50 border-b border-slate-200';

            const statesHTML = region.states.map(state => {
                let socialLinksHTML = '';
                if (state.social) {
                    socialLinksHTML = Object.entries(state.social).map(([key, url]) => {
                        if (socialIcons[key]) {
                            return `<a href="${url}" target="_blank" class="text-slate-400 hover:text-green-800 hover:scale-110 transition-all" title="${key.charAt(0).toUpperCase() + key.slice(1)}">${socialIcons[key]}</a>`;
                        }
                        return '';
                    }).join('');
                }

                return `
                    <div class="group flex flex-col items-center gap-3 w-full sm:w-64">
                        <a href="${state.url}" target="_blank" class="w-full max-w-[240px] h-32 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm p-8 group-hover:border-green-600 group-hover:shadow-md transition-all duration-300">
                            <img src="${state.logo}" alt="SEA ${state.name}" class="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300">
                        </a>
                        <div class="flex flex-col items-center gap-3">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-green-800 transition-colors">${state.name}</span>
                            ${socialLinksHTML ? `<div class="flex flex-wrap justify-center gap-4 transition-all duration-300">${socialLinksHTML}</div>` : ''}
                        </div>
                    </div>
                `;
            }).join('');

            regionSection.innerHTML = `
                <div class="w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
                    <div class="mb-8">
                        <img src="${region.mainImage}" alt="${region.name}" class="max-w-[400px] w-full mx-auto drop-shadow-sm opacity-80">
                    </div>
                    <div class="flex flex-wrap gap-6 sm:gap-8 items-start justify-center">
                        ${statesHTML}
                    </div>
                </div>
            `;
            statesContainer.appendChild(regionSection);
        });
    }
});
