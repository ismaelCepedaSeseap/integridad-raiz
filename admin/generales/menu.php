<?php
$currentPage = $actual ?? ($_GET['actual'] ?? basename($_SERVER['PHP_SELF']));
$isActive = static function (array $files) use ($currentPage): string {
    return in_array($currentPage, $files, true) ? ' active' : '';
};
?>
<aside id="sidebar" class="sidebar">
    <div class="sidebar__inner">
        <div class="profile-summary">
            <div class="profile-summary__avatar">
                <img src="../assets/images/logo.png" alt="Logo SEA" class="avatar-img">
                <div class="avatar-status"></div>
            </div>
            <div class="profile-summary__info">
                <h2 id="sidebar-user-role">Administrador</h2>
                <div id="state-display-sidebar">
                    <span class="state-badge">Nivel Nacional</span>
                </div>
            </div>
        </div>

        <nav class="navigation">
            <p class="nav-section-title">Principal</p>

            <a href="dashboard.php" id="nav-general" class="nav-item<?= $isActive(['dashboard.php']) ?>">
                <i data-lucide="layout-dashboard"></i>
                <span>General</span>
            </a>

            <a href="usuarios.php" id="nav-users" class="nav-item<?= $isActive(['usuarios.php']) ?>">
                <i data-lucide="users"></i>
                <span>Usuarios</span>
            </a>

            <p class="nav-section-title">Gestión</p>

            <a href="sliders.php" id="nav-sliders" class="nav-item<?= $isActive(['sliders.php']) ?>">
                <i data-lucide="layout-template"></i>
                <span>Sliders</span>
            </a>

            <a href="estados.php" id="nav-estados" class="nav-item<?= $isActive(['estados.php']) ?>">
                <i data-lucide="map"></i>
                <span>Estados</span>
            </a>

            <a href="arbol.php" id="nav-arbol" class="nav-item<?= $isActive(['arbol.php']) ?>">
                <i data-lucide="tree-pine"></i>
                <span>Árbol</span>
            </a>

            <a href="guardianes.php" id="nav-guardianes" class="nav-item<?= $isActive(['guardianes.php']) ?>">
                <i data-lucide="shield"></i>
                <span>Guardianes</span>
            </a>

            <a href="eventos.php" id="nav-events" class="nav-item<?= $isActive(['eventos.php']) ?>">
                <i data-lucide="calendar-days"></i>
                <span>Eventos y Rally</span>
            </a>

            <a href="cine.php" id="nav-cine" class="nav-item<?= $isActive(['cine.php']) ?>">
                <i data-lucide="film"></i>
                <span>Cine</span>
            </a>

            <a href="#" class="nav-item">
                <i data-lucide="message-square"></i>
                <span>Compromisos</span>
            </a>

            <a href="#" class="nav-item">
                <i data-lucide="settings"></i>
                <span>Configuración</span>
            </a>
        </nav>

        <div class="sidebar__footer">
            <button id="btn-logout" class="btn btn-danger btn-full">
                <i data-lucide="log-out"></i> Cerrar Sesión
            </button>
        </div>
    </div>
</aside>
