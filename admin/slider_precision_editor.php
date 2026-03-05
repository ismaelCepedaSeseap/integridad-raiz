<?php
require_once("../assets/php/security/auth.php");
$autorizacion = new Auth();
if (!$autorizacion->isLoggedIn()) {
    header("Location: ../login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editor de Precisión - 1280x720</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Quicksand', sans-serif; background: #1e293b; margin: 0; overflow: hidden; }
        #canvas-container {
            width: 1280px;
            height: 720px;
            position: relative;
            background: #000;
            margin: auto;
            box-shadow: 0 0 50px rgba(0,0,0,0.5);
        }
        .slider-preview-viewport {
            width: 1280px;
            height: 720px;
            position: relative;
            overflow: hidden;
        }
        .btn-preview-base {
            cursor: grab;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 1.1rem;
            white-space: nowrap;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .btn-preview-base:active { cursor: grabbing; }
        .btn-preview-base.is-dragging {
            opacity: 0.9;
            scale: 1.05;
            outline: 2px solid #3b82f6;
            outline-offset: 4px;
            z-index: 1000;
        }
        .drag-guide-h, .drag-guide-v {
            position: absolute;
            background: rgba(59, 130, 246, 0.8);
            display: none;
            pointer-events: none;
            z-index: 100;
        }
        .drag-guide-h { width: 100%; height: 1px; left: 0; }
        .drag-guide-v { height: 100%; width: 1px; top: 0; }

        .slider-preview-content {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0 80px;
            z-index: 20;
            pointer-events: none;
        }
        .slider-preview-content > * { pointer-events: auto; }

        /* Estructura exacta del slider */
        .slider-main-container {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            pointer-events: none;
        }
        
        #preview-image-container {
            position: relative;
            max-width: 50%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        }

        #preview-image {
            max-height: 80%;
            width: auto;
            object-contain: contain;
            filter: drop-shadow(0 20px 50px rgba(0,0,0,0.3));
        }
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(255,255,255,0.9);
            padding: 10px 20px;
            border-radius: 12px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen">
    
    <div id="precision-ui" class="flex items-center gap-4">
        <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-xs font-bold text-slate-700 uppercase">Modo Precisión 1:1 Activo</span>
        </div>
        <div class="h-4 w-px bg-slate-300"></div>
        <span class="text-[10px] text-slate-500 font-medium">Las coordenadas se sincronizan automáticamente con el formulario</span>
    </div>

    <div id="canvas-container">
        <div id="preview-viewport" class="slider-preview-viewport">
            <!-- Guías -->
            <div id="guide-v" class="drag-guide-v"></div>
            <div id="guide-h" class="drag-guide-h"></div>
            
            <div id="preview-bg-image" class="absolute inset-0 bg-cover bg-center"></div>
            
            <div id="preview-card" class="slider-preview-content">
                <div id="preview-badge" class="badge inline-block bg-blue-600 text-white rounded-full self-start mb-4 font-bold uppercase tracking-wider px-4 py-1.5 text-sm">Badge</div>
                <h2 id="preview-title" class="text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">Título del Slider</h2>
                <p id="preview-description" class="text-xl text-white/90 max-w-2xl mb-8 leading-relaxed drop-shadow-md">Descripción corta del slider.</p>
                <div id="preview-buttons" class="flex flex-wrap gap-4"></div>
            </div>

            <!-- Contenedor Principal Ajustado -->
            <div class="slider-main-container">
                <div id="preview-image-container" style="display: none;">
                    <img id="preview-image" src="" alt="">
                </div>
            </div>
        </div>
    </div>

    <script>
        const viewport = document.getElementById('preview-viewport');
        const guideV = document.getElementById('guide-v');
        const guideH = document.getElementById('guide-h');
        
        let isDragging = false;
        let currentTarget = null;
        let dragStartX, dragStartY;
        let initialX, initialY;

        // Escuchar mensajes del padre
        window.addEventListener('message', (event) => {
            if (event.data.type === 'update') {
                updateView(event.data.data);
            }
        });

        function updateView(data) {
            const { type, background, backgroundImage, badge, title, description, image, buttons } = data;
            
            const bgImage = document.getElementById('preview-bg-image');
            bgImage.style.backgroundColor = background || '#ffffff';
            bgImage.style.backgroundImage = backgroundImage ? `url(../${backgroundImage})` : 'none';

            const pBadge = document.getElementById('preview-badge');
            pBadge.textContent = badge || 'Badge';
            pBadge.style.display = type === 'simple' ? 'none' : 'inline-block';

            const pTitle = document.getElementById('preview-title');
            pTitle.innerHTML = title || '';
            pTitle.style.display = type === 'simple' ? 'none' : 'block';

            const pDesc = document.getElementById('preview-description');
            pDesc.textContent = description || '';
            pDesc.style.display = type === 'simple' ? 'none' : 'block';

            const pImg = document.getElementById('preview-image');
            const pImgContainer = document.getElementById('preview-image-container');
            
            if (image && type === 'complex') {
                pImg.src = `../${image}`;
                pImgContainer.style.display = 'flex';
                // Posicionamiento exacto para sliders complejos
                pImgContainer.className = "absolute right-[80px] top-1/2 -translate-y-1/2 w-1/2 h-[80%] flex items-center justify-center";
            } else {
                pImgContainer.style.display = 'none';
            }

            // Botones
            const pButtons = document.getElementById('preview-buttons');
            pButtons.innerHTML = '';
            viewport.querySelectorAll('.btn-absolute-preview').forEach(b => b.remove());

            buttons.forEach((btn, index) => {
                if (!btn.text) return;
                
                const bEl = document.createElement('div');
                let styleClasses = '';
                if (btn.style === 'primary') styleClasses = 'bg-blue-600 text-white shadow-lg shadow-blue-500/30';
                else if (btn.style === 'glass') styleClasses = 'bg-white/20 backdrop-blur-md text-white border border-white/30';
                else if (btn.style === 'outline') styleClasses = 'border-2 border-white text-white hover:bg-white hover:text-blue-600';
                else if (btn.style === 'white') styleClasses = 'bg-white text-slate-900 shadow-xl';

                bEl.className = `btn-preview-base transition-all ${styleClasses}`;
                bEl.innerHTML = `<i data-lucide="${btn.icon || 'play-circle'}" class="w-5 h-5"></i> ${btn.text}`;
                
                const top = btn.position_top;
                const left = btn.position_left;
                const right = btn.position_right;
                const bottom = btn.position_bottom;

                if (top || left || right || bottom) {
                    bEl.classList.add('btn-absolute-preview');
                    bEl.style.position = 'absolute';
                    bEl.style.top = top || 'auto';
                    bEl.style.left = left || 'auto';
                    bEl.style.right = right || 'auto';
                    bEl.style.bottom = bottom || 'auto';
                    viewport.appendChild(bEl);
                    initDraggable(bEl, index);
                } else {
                    pButtons.appendChild(bEl);
                }
            });
            if (window.lucide) lucide.createIcons();
        }

        function initDraggable(el, index) {
            el.addEventListener('mousedown', (e) => {
                isDragging = true;
                currentTarget = { el, index };
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                
                const style = window.getComputedStyle(el);
                initialX = parseFloat(style.left) || 0;
                initialY = parseFloat(style.top) || 0;
                
                el.classList.add('is-dragging');
                document.addEventListener('mousemove', onDrag);
                document.addEventListener('mouseup', stopDrag);
            });
        }

        function onDrag(e) {
            if (!isDragging || !currentTarget) return;
            
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            
            let nx = initialX + dx;
            let ny = initialY + dy;
            
            const elWidth = currentTarget.el.offsetWidth;
            const elHeight = currentTarget.el.offsetHeight;
            
            nx = Math.max(0, Math.min(nx, 1280 - elWidth));
            ny = Math.max(0, Math.min(ny, 720 - elHeight));
            
            const rx = Math.round(nx);
            const ry = Math.round(ny);
            
            // Snap centrado
            const cx = 640;
            const cy = 360;
            const threshold = 10;
            
            let finalX = rx;
            let finalY = ry;
            
            if (Math.abs((rx + elWidth/2) - cx) < threshold) {
                finalX = Math.round(cx - elWidth/2);
                guideV.style.display = 'block';
                guideV.style.left = cx + 'px';
            } else {
                guideV.style.display = 'none';
            }
            
            if (Math.abs((ry + elHeight/2) - cy) < threshold) {
                finalY = Math.round(cy - elHeight/2);
                guideH.style.display = 'block';
                guideH.style.top = cy + 'px';
            } else {
                guideH.style.display = 'none';
            }
            
            currentTarget.el.style.left = finalX + 'px';
            currentTarget.el.style.top = finalY + 'px';
            currentTarget.el.style.right = 'auto';
            currentTarget.el.style.bottom = 'auto';
            
            // Notificar al padre
            window.opener.postMessage({
                type: 'buttonMoved',
                index: currentTarget.index,
                x: finalX,
                y: finalY
            }, '*');
        }

        function stopDrag() {
            isDragging = false;
            if (currentTarget) currentTarget.el.classList.remove('is-dragging');
            guideV.style.display = 'none';
            guideH.style.display = 'none';
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
        }

        // Avisar que estamos listos
        window.opener.postMessage({ type: 'ready' }, '*');
    </script>
</body>
</html>
