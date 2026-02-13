const sourceEvents = typeof EVENTS !== 'undefined' ? EVENTS : [];

const eventsPageData = sourceEvents.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    state: event.state || '',
    location: event.location,
    imageUrl: event.imageUrl || event.mainImage || (event.gallery && event.gallery[0]) || '',
    description: event.description,
    gallery: Array.isArray(event.gallery) ? event.gallery : [],
    pillars: Array.isArray(event.pillars) ? event.pillars : [],
    videoUrl: event.videoUrl || '',
    impact: event.impact || '',
    pillars_count: event.pillars_count || '',
    banners: Array.isArray(event.banners) ? event.banners : []
}));

const uniqueStates = Array.from(new Set(eventsPageData.map(event => event.state).filter(Boolean)));

const filtersEventsData = [
    { id: 'todos', label: 'Todos' },
    ...uniqueStates.map(state => ({ id: state, label: state }))
];

// Galería de Momentos Inolvidables
const momentsGalleryData = [
    {
        image: "images/rally/f_02.jpg",
        title: "Diversión y Aprendizaje",
        year: "Puebla 2025"
    },
    {
        image: "images/rally/f_03.jpg",
        title: "Trabajo en Equipo",
        year: "Puebla 2025",
        marginTop: true
    },
    {
        image: "images/rally/f_04.jpg",
        title: "Valores en Movimiento",
        year: "Puebla 2025"
    },
    {
        image: "images/rally/f_05.jpg",
        title: "Comunidad Unida",
        year: "Puebla 2025",
        marginTop: true
    }
];
