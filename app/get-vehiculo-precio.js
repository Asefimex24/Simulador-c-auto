// Cargar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', configurarEventoPrecios);
configurarEventoPrecios();

// Función para manejar el cambio de estado
function configurarEventoPrecios() {

    const selectVehiculos = document.getElementById('car-type');

    selectVehiculos.addEventListener('change', function () {
        const vehiculo = this.value;
        if (vehiculo) {

            get_Precio(vehiculo);

        } else {
            // Limpiar selects dependientes si no hay estado seleccionado
                const precio_vehiculo = document.getElementById('car-value');
                precio_vehiculo.textContent='';
        }
    });
}


// Función para cargar municipios por estado
async function get_Precio(idvehiculo) {

    const text_vehiculo = document.getElementById('car-value');

    try {
        // Hacer petición al API
        const response = await fetch(`http://localhost/cotizador/api/vehiculos/vehiculos-precio.php?idVehiculo=${idvehiculo}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {

            // establecer el precio del vehiculo
            let precio1 = data.data[0].precio;

            text_vehiculo.value= precio1.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            // console.log(`precio cargado ${idvehiculo}:`, data.data.length);

        } else {
            throw new Error(data.message || 'No se encontraron municipios para este estado');
        }
    }    
    catch (error) {
        console.error('Error cargando municipios:', error);

    }
}