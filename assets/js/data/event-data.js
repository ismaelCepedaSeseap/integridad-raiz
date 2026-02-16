const eventsList = (typeof EVENTS !== 'undefined' ? EVENTS : []).map(event => ({
    id: event.id,
    visible: Boolean(event.visible),
    badge: event.badge || 'Último Evento',
    title: event.title,
    description: event.description,
    location: event.location,
    date: event.date,
    url: event.url || '#',
    mainImage: event.mainImage || event.imageUrl || '',
    decorations: event.decorations || {
        topLeft: '',
        bottomRight: ''
    },
    gallery: Array.isArray(event.gallery) ? event.gallery : []
}));
