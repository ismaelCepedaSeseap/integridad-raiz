// Datos para la página cine.html

// Filtros disponibles
const filtersData = [
    { id: 'todos', label: 'Todos' },
    { id: 'puebla', label: 'Puebla' },
    { id: 'hidalgo', label: 'Hidalgo' },
    // { id: 'veracruz', label: 'Veracruz' }, // Comentado como en el original
    { id: 'tlaxcala', label: 'Tlaxcala' }
];

// Lista de videos
const videosPageData = [
    {
        id: "V8Hvr99LLFk",
        title: "Rally Anticorrupción 2025",
        description: "¡Así se vivió el Rally Anticorrupción 2025! 🏃‍♂️💨 Estudiantes del BINE se unen para fomentar valores y aprender cómo construir, desde la integridad, una Puebla libre de corrupción.",
        state: "puebla",
        stateLabel: "Puebla",
        badgeClass: "bg-green-500/80",
        hashtag: "#RallyAnticorrupción"
    },
    {
        id: "5s0rRk9sER0",
        title: "Integridad desde la Raíz: Tlaxcala",
        description: "Descubre cómo las raíces de la integridad florecen en Tlaxcala, fortaleciendo nuestros valores y comunidad.",
        state: "tlaxcala",
        stateLabel: "Tlaxcala",
        badgeClass: "bg-red-500/80",
        hashtag: "#PorAmorATlaxcala"
    }
];
