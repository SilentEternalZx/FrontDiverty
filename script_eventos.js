// Función para cargar la lista de clientes
async function cargarClientes() {
    try {
        const response = await fetch('http://localhost:3000/personas');
        if (response.ok) {
            const clientes = await response.json();
            const selectCliente = document.getElementById('clienteId');
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente._id; // Usamos el ObjectId como valor
                // Incluimos nombre, apellido, cédula y correo en el texto de la opción
                option.textContent = `${cliente.nombre} ${cliente.apellido} - Cédula: ${cliente.cedula}`;
                selectCliente.appendChild(option);
            });
        } else {
            console.error('Error al cargar los clientes');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


// Cargar clientes cuando la página se carga
document.addEventListener('DOMContentLoaded', cargarClientes);

document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener los servicios seleccionados
    const serviciosSeleccionados = Array.from(document.querySelectorAll('input[name="servicios"]:checked'))
        .map(checkbox => checkbox.value);

    const formData = {
        nombreEvento: document.getElementById('nombreEvento').value,
        fechaHoraEvento: document.getElementById('fechaHoraEvento').value,
        cliente: document.getElementById('clienteId').value, // Esto será el ObjectId del cliente
        serviciosTomados: serviciosSeleccionados,
        direccionEvento: document.getElementById('direccionEvento').value
    };

    try {
        const response = await fetch('http://localhost:3000/eventos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result = await response.json();
            alert('Evento registrado con éxito');
            console.log(result);
            // Limpiar el formulario después de un registro exitoso
            document.getElementById('eventForm').reset();
        } else {
            alert('Error al registrar el evento');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
});

document.getElementById('personForm').addEventListener('submit', async (e) => {e.preventDefault();

    const formData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        cedula: document.getElementById('cedula').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        direccion: document.getElementById('direccion').value,
        correo: document.getElementById('correo').value,
        telefono: document.getElementById('telefono').value
    };

    try {
        const response = await fetch('http://localhost:3000/personas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result = await response.json();
            alert('Cliente registrado con éxito');
            console.log(result);
            document.getElementById('personForm').reset();
        } else {
            const errorData = await response.json();
            alert('Error al registrar el cliente: ' + errorData.message);
            
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
});