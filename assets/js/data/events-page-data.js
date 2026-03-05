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
const momentsGalleryData = sourceEvents.map((event, index) => {
    // Extract year from date string "11 Diciembre 2025"
    const yearMatch = event.date ? event.date.match(/\d{4}/) : null;
    const year = yearMatch ? yearMatch[0] : '';
    const cleanTitle = event.title ? event.title.replace(/<[^>]*>?/gm, '') : 'Evento';

    return {
        image: event.imageUrl || event.mainImage || (event.gallery && event.gallery[0]) || '',
        title: cleanTitle,
        year: `${event.state || ''} ${year}`.trim(),
        marginTop: index % 2 !== 0 // Stagger effect
    };
});

// Add "Próximamente" card
momentsGalleryData.push({
    isPlaceholder: true,
    title: "Próximamente",
    year: "",
    marginTop: momentsGalleryData.length % 2 !== 0
});
