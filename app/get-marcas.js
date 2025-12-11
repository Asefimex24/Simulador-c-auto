// Cargar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', get_Marcas);


// Función para cargar niveles de atención
async function get_Marcas() {
    const selectmarcas = document.getElementById('car-marc');

    try {
        const response = await fetch('http://localhost/cotizador/api/marcas/');
        const data = await response.json();

        
        if (data.success && data.data.length > 0) {

            selectmarcas.innerHTML = '<option value="" selected disabled>Seleccione una marca</option>';                  

            data.data.forEach(marcas => {

                const option = document.createElement('option');
                option.value = marcas.idMarca;
                option.textContent = marcas.marca;
                selectmarcas.appendChild(option);
            });

            // console.log('Marcas cargados:', data.data.length);
        } else {
            throw new Error(data.message || 'No se pudieron cargar los niveles');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}