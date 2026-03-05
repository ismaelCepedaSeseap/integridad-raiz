/**
 * Lógica para el Árbol de la Integridad
 * Maneja la rotación semanal de 6 frutos basados en una lista de 50.
 */
let treeTipsData = [];

async function loadTreeTipsData() {
    const response = await fetch('api/obtener_frutos.php');
    const json = await response.json();
    if (!response.ok || !json.exito || !Array.isArray(json.datos)) {
        throw new Error('No se pudieron cargar los frutos del árbol');
    }
    treeTipsData = json.datos;
}

function initTreeIntegrity() {
    const treeContainer = document.querySelector('#actividades svg');
    if (!treeContainer || !Array.isArray(treeTipsData) || treeTipsData.length === 0) return;

    // 1. Obtener la semana actual del año
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    const currentWeek = Math.floor(dayOfYear / 7);

    // 2. Seleccionar 6 frutos basados en la semana
    // Usamos el número de semana como semilla para la selección
    const totalTips = treeTipsData.length;
    const selectedTips = [];
    for (let i = 0; i < 6; i++) {
        // Fórmula simple para rotar: (semana + i * salto) % total
        // El salto de 7 asegura que los frutos cambien notablemente
        const index = (currentWeek + i * 7) % totalTips;
        selectedTips.push(treeTipsData[index]);
    }

    // 3. Posiciones predefinidas para los 6 frutos en el SVG (ajustadas para mejor dispersión)
    const positions = [
        { cx: 75, cy: 70 },   // Izquierda arriba (más al borde)
        { cx: 125, cy: 80 },  // Derecha centro (más al borde)
        { cx: 100, cy: 115 }, // Centro muy abajo (casi en la base del follaje)
        { cx: 100, cy: 50 },  // Muy arriba centro
        { cx: 65, cy: 100 },  // Izquierda abajo (bien disperso)
        { cx: 135, cy: 100 }  // Derecha abajo (bien disperso)
    ];

    // 4. Asegurar que existan los filtros de sombra y gradiente en el SVG
    let defs = treeContainer.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        treeContainer.prepend(defs);
    }
    
    // Crear gradiente y filtro de forma más robusta si no existen
    if (!defs.querySelector('#fruitGradient')) {
        const svgNS = "http://www.w3.org/2000/svg";
        
        // Gradiente para el fruto (más vibrante)
        const gradient = document.createElementNS(svgNS, "radialGradient");
        gradient.setAttribute("id", "fruitGradient");
        gradient.setAttribute("cx", "35%");
        gradient.setAttribute("cy", "35%");
        gradient.setAttribute("r", "50%");
        
        const stop1 = document.createElementNS(svgNS, "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "#fff176"); // Amarillo brillante central
        
        const stop2 = document.createElementNS(svgNS, "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", "#f9a825"); // Naranja/oro profundo en bordes
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);

        // Filtro de Resplandor (Glow) como el de la imagen
        const filter = document.createElementNS(svgNS, "filter");
        filter.setAttribute("id", "fruitGlow");
        filter.setAttribute("x", "-50%");
        filter.setAttribute("y", "-50%");
        filter.setAttribute("width", "200%");
        filter.setAttribute("height", "200%");

        // 1. Tomar la forma del fruto y desenfocarla mucho para el aura
        const blur = document.createElementNS(svgNS, "feGaussianBlur");
        blur.setAttribute("in", "SourceGraphic");
        blur.setAttribute("stdDeviation", "3"); // Desenfoque un poco menor para el fruto más pequeño
        blur.setAttribute("result", "blurOut");

        // 2. Darle color al resplandor (amarillo cálido)
        const matrix = document.createElementNS(svgNS, "feColorMatrix");
        matrix.setAttribute("in", "blurOut");
        matrix.setAttribute("type", "matrix");
        matrix.setAttribute("values", "0 0 0 0 1   0 0 0 0 0.8   0 0 0 0 0   0 0 0 0.6 0");
        matrix.setAttribute("result", "glowOut");

        // 3. Combinar el resplandor con el fruto original
        const merge = document.createElementNS(svgNS, "feMerge");
        const node1 = document.createElementNS(svgNS, "feMergeNode");
        node1.setAttribute("in", "glowOut");
        const node2 = document.createElementNS(svgNS, "feMergeNode");
        node2.setAttribute("in", "SourceGraphic");
        
        merge.appendChild(node1);
        merge.appendChild(node2);
        
        filter.appendChild(blur);
        filter.appendChild(matrix);
        filter.appendChild(merge);
        defs.appendChild(filter);
    }

    // 5. Limpiar frutos anteriores (usando una clase específica)
    const existingFruits = treeContainer.querySelectorAll('.dynamic-fruit');
    existingFruits.forEach(fruit => fruit.remove());

    // 6. Renderizar los nuevos frutos con estilos mejorados
    selectedTips.forEach((tip, index) => {
        // Validar que el tip exista para evitar errores
        if (!tip) return;

        const pos = positions[index];
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("class", "cursor-pointer fruit-group dynamic-fruit");
        group.setAttribute("onclick", `showTreeTipById(${tip.id})`);
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", pos.cx);
        circle.setAttribute("cy", pos.cy);
        circle.setAttribute("r", "7"); // Más pequeños como en la imagen
        circle.setAttribute("fill", "#facc15");
        circle.setAttribute("filter", "url(#fruitGlow)");
        circle.setAttribute("class", "seed-pulse");
        
        // Establecer el centro de transformación para la animación
        circle.style.transformOrigin = `${pos.cx}px ${pos.cy}px`;
        
        // Aplicar un retraso de animación aleatorio para que se muevan por separado
        const delay = (Math.random() * 3).toFixed(2);
        circle.style.animationDelay = `${delay}s`;
        
        // Agregar título para accesibilidad/hover
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = tip.tema;
        
        group.appendChild(circle);
        group.appendChild(title);
        treeContainer.appendChild(group);
    });
}

/**
 * Muestra el consejo seleccionado en el panel de texto por ID
 */
function showTreeTipById(id) {
    const tip = treeTipsData.find(t => t.id === id);
    if (!tip) return;
    
    const display = document.getElementById('tip-display');
    if (!display) return;

    // Aplicar efecto de transición
    display.style.opacity = '0';
    display.style.transform = 'scale(0.95)';

    setTimeout(() => {
        display.innerHTML = `
            <div class="flex flex-col items-center">
                <span class="text-yellow-400 font-black uppercase tracking-widest text-sm mb-2">${tip.tema}</span>
                <p class="text-white">"${tip.consejo}"</p>
            </div>
        `;
        display.style.opacity = '1';
        display.style.transform = 'scale(1)';
    }, 300);
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadTreeTipsData();
        initTreeIntegrity();
    } catch (error) {
    }
});
