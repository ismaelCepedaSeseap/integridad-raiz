document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const paginationControls = document.getElementById('pagination-controls');
    const postsCounter = document.getElementById('posts-counter');

    if (!postsContainer || !paginationControls || !postsCounter) return;

    let currentPage = 1;
    const postsPerPage = 5;
    const totalPosts = postsData.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    function renderPosts() {
        postsContainer.innerHTML = '';
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const postsToRender = postsData.slice(start, end);

        postsToRender.forEach(post => {
            const card = document.createElement('div');
            card.className = "bg-white p-5 sm:p-7 rounded-[24px] shadow-md flex flex-col sm:flex-row gap-4 animate-fade-in-up w-full overflow-hidden";
            
            const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
            const avatarColor = colors[Math.floor(Math.random() * colors.length)];

            card.innerHTML = `
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-${avatarColor}-200 flex items-center justify-center text-slate-700 font-bold text-lg border-2 border-white shadow-sm">
                    ${post.name.charAt(0).toUpperCase()}
                </div>
                <div class="flex-grow min-w-0">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2 min-w-0">
                        <h4 class="font-bold text-slate-800 text-lg sm:text-xl break-words leading-tight min-w-0">${post.name}</h4>
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wide max-w-full">
                                <i data-lucide="map-pin" class="w-4 h-4"></i>
                                <span class="break-words">${post.location}</span>
                            </span>
                        </div>
                    </div>
                    <p class="text-slate-600 italic text-sm sm:text-base break-words">"${post.text}"</p>
                </div>
            `;
            postsContainer.appendChild(card);
        });
        lucide.createIcons();
        updatePaginationControls();
    }

    function updatePaginationControls() {
        paginationControls.innerHTML = `
            <button id="prev-page" class="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">&lt; Anterior</button>
            <span class="font-bold text-slate-600">Página ${currentPage} de ${totalPages}</span>
            <button id="next-page" class="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">Siguiente &gt;</button>
        `;

        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPosts();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPosts();
            }
        });
    }
    
    postsCounter.innerText = `${totalPosts} compromisos publicados`;
    renderPosts();
});
