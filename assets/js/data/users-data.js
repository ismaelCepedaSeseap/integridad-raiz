/**
 * Datos simulados de usuarios basados en el dump SQL
 */

// Catálogo de Roles
const ROLES = [
    { id: 1, nombre: 'Super administrador', descripcion: 'Puede realizar cualquier acción', activo: true },
    { id: 2, nombre: 'Administrador', descripcion: 'Administrador parcial por estado', activo: true }
];

// Catálogo de Estados
const ESTADOS = [
    { id: 1, nombre: 'Aguascalientes', activo: true },
    { id: 2, nombre: 'Baja California', activo: false },
    { id: 3, nombre: 'Baja California Sur', activo: false },
    { id: 4, nombre: 'Campeche', activo: false },
    { id: 5, nombre: 'Chiapas', activo: false },
    { id: 6, nombre: 'Chihuahua', activo: false },
    { id: 7, nombre: 'Coahuila', activo: false },
    { id: 8, nombre: 'Colima', activo: false },
    { id: 9, nombre: 'Ciudad de México', activo: false },
    { id: 10, nombre: 'Durango', activo: false },
    { id: 11, nombre: 'Guanajuato', activo: false },
    { id: 12, nombre: 'Guerrero', activo: false },
    { id: 13, nombre: 'Hidalgo', activo: true },
    { id: 14, nombre: 'Jalisco', activo: false },
    { id: 15, nombre: 'México', activo: false },
    { id: 16, nombre: 'Michoacán', activo: false },
    { id: 17, nombre: 'Morelos', activo: false },
    { id: 18, nombre: 'Nayarit', activo: false },
    { id: 19, nombre: 'Nuevo León', activo: false },
    { id: 20, nombre: 'Oaxaca', activo: false },
    { id: 21, nombre: 'Puebla', activo: true },
    { id: 22, nombre: 'Querétaro', activo: false },
    { id: 23, nombre: 'Quintana Roo', activo: false },
    { id: 24, nombre: 'San Luis Potosí', activo: false },
    { id: 25, nombre: 'Sinaloa', activo: false },
    { id: 26, nombre: 'Sonora', activo: false },
    { id: 27, nombre: 'Tabasco', activo: false },
    { id: 28, nombre: 'Tamaulipas', activo: false },
    { id: 29, nombre: 'Tlaxcala', activo: true },
    { id: 30, nombre: 'Veracruz', activo: false },
    { id: 31, nombre: 'Yucatán', activo: false },
    { id: 32, nombre: 'Zacatecas', activo: false }
];

// Usuarios Iniciales (Simulación de DB)
// Contraseñas hasheadas en DB real, aquí simuladas
const USERS = [
    {
        id: 1,
        nombre: 'Rodrigo',
        primerApellido: 'Carranza',
        segundoApellido: 'Juárez',
        estado: 21, // Puebla
        rol: 1, // Super Admin
        correo: 'roy.wmun@gmail.com',
        pass: '$2y$10$JF.6BsgjZsoAhUmEttLwy./N70gQ/qBDOtfsfXV4I84TaC2TIIpHa', // Hash real del dump
        activo: true
    }
];

// Función helper para obtener nombre de rol por ID
function getRoleName(id) {
    const role = ROLES.find(r => r.id === parseInt(id));
    return role ? role.nombre : 'Desconocido';
}

// Función helper para obtener nombre de estado por ID
function getStateName(id) {
    const state = ESTADOS.find(s => s.id === parseInt(id));
    return state ? state.nombre : 'Desconocido';
}
