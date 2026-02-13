document.addEventListener('DOMContentLoaded', () => {
    const statesSelect = document.getElementById('c-location');

    if (statesSelect && typeof statesData !== 'undefined') {
        // Limpiar opciones existentes (excepto la primera)
        while (statesSelect.options.length > 1) {
            statesSelect.remove(1);
        }

        // Poblar con los datos correctos
        statesData.forEach(stateName => {
            const option = document.createElement('option');
            option.value = stateName;
            option.textContent = stateName; // Usar textContent para seguridad y claridad
            statesSelect.appendChild(option);
        });
    }
});
