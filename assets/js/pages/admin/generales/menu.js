document.addEventListener('DOMContentLoaded', async () => {
    const overlay = document.getElementById('sidebar-overlay');
    const toggleBtn = document.getElementById('btn-toggle-sidebar');
    const currentPage = window.location.pathname.split('/').pop() || '';

    let sidebar = document.getElementById('sidebar');

    if (sidebar) {
        try {
            const response = await fetch(`generales/menu.php?actual=${encodeURIComponent(currentPage)}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (response.ok) {
                const menuHtml = await response.text();
                sidebar.outerHTML = menuHtml;
                sidebar = document.getElementById('sidebar');
                if (window.lucide) window.lucide.createIcons();
            }
        } catch (error) {
        }
    }

    if (!sidebar) return;

    const closeSidebar = () => {
        sidebar.classList.remove('active');
        sidebar.classList.add('-translate-x-full');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    const openSidebar = () => {
        sidebar.classList.add('active');
        sidebar.classList.remove('-translate-x-full');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const toggleSidebar = () => {
        if (sidebar.classList.contains('active') || !sidebar.classList.contains('-translate-x-full')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    };

    const logout = async () => {
        try {
            await fetch('../assets/php/security/logout.php', { method: 'POST' });
        } catch (error) {
        } finally {
            window.location.href = '../login.php';
        }
    };

    const logoutButton = document.getElementById('btn-logout') || document.getElementById('cerrarSesion');
    if (logoutButton) logoutButton.addEventListener('click', logout);

    if (window.innerWidth <= 768) {
        closeSidebar();
    } else {
        sidebar.classList.remove('-translate-x-full');
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) closeSidebar();
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            sidebar.classList.remove('-translate-x-full');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        } else if (!sidebar.classList.contains('active')) {
            sidebar.classList.add('-translate-x-full');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeSidebar();
    });
});
