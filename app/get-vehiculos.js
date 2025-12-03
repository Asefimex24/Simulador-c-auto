// Cargar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', configurarEventoMarcas);
configurarEventoMarcas();

// Función para manejar el cambio de estado
function configurarEventoMarcas() {

    const selectMarca = document.getElementById('car-marc');

    selectMarca.addEventListener('change', function () {
        const marca = this.value;
        if (marca) {

            cargarVehiculos(marca);

        } else {
            // Limpiar selects dependientes si no hay estado seleccionado
                const selectVehiculos = document.getElementById('tipoVehiculos');
                selectVehiculos.innerHTML = '<option value="" selected disabled>Debe seleccionar una marca</option>';
        }
    });
}


// Función para cargar municipios por estado
async function cargarVehiculos(marca) {

    const selectVehiculos = document.getElementById('car-type');

    try {
        // Hacer petición al API
        const response = await fetch(`http://localhost/cotizador/api/vehiculos/?idMarca=${marca}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            // Limpiar y llenar el select de municipios

            selectVehiculos.innerHTML = '<option value="" selected disabled>Seleccione un vehiculo</option>';

            data.data.forEach(vehiculos => {
                const option = document.createElement('option');
                option.value = vehiculos.idVehiculo;
                option.textContent = vehiculos.tipo;
                selectVehiculos.appendChild(option);
            });

            console.log(`vehiculos cargados ${marca}:`, data.data.length);
        } else {
            throw new Error(data.message || 'No se encontraron municipios para este estado');
        }
    }
    
    catch (error) {
        console.error('Error cargando municipios:', error);

    }
}