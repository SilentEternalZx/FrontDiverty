// Manejar la búsqueda de eventos
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cedula = document.getElementById('cedula').value;
    await buscarEventoPorCedula(cedula);
});

async function buscarEventoPorCedula(cedula) {
    try {
        const response = await fetch(`http://localhost:3000/eventos/buscar?cedula=${cedula}`);
        if (response.ok) {
            const evento = await response.json();
            if (evento) {
                mostrarDetallesEvento(evento);
            } else {
                alert('No se encontró ningún evento para este número de cédula.');
            }
        } else {
            alert('Error al buscar el evento');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

function mostrarDetallesEvento(evento) {
    document.getElementById('eventoId').value = evento._id;
    document.getElementById('nombreEventoDisplay').textContent = `Nombre del evento: ${evento.nombreEvento}`;
    document.getElementById('clienteDisplay').textContent = `Cliente: ${evento.cliente.nombre} ${evento.cliente.apellido}`;
    document.getElementById('fechaHoraEvento').value = new Date(evento.fechaHoraEvento).toISOString().slice(0, 16);
    document.getElementById('direccionEvento').value = evento.direccionEvento;

    // Marcar los servicios seleccionados
    document.querySelectorAll('input[name="servicios"]').forEach(checkbox => {
        checkbox.checked = evento.serviciosTomados.includes(checkbox.value);
    });

    // Mostrar el formulario de edición
    document.getElementById('eventDetails').style.display = 'block';
}

// Manejar el envío del formulario de edición
document.getElementById('editEventForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const serviciosSeleccionados = Array.from(document.querySelectorAll('input[name="servicios"]:checked'))
        .map(checkbox => checkbox.value);

    const formData = {
        fechaHoraEvento: document.getElementById('fechaHoraEvento').value,
        serviciosTomados: serviciosSeleccionados,
        direccionEvento: document.getElementById('direccionEvento').value
    };

    const eventoId = document.getElementById('eventoId').value;

    try {
        const response = await fetch(`http://localhost:3000/eventos/${eventoId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result = await response.json();
            alert('Evento actualizado con éxito');
            console.log(result);
            // Limpiar el formulario y ocultar los detalles del evento
            document.getElementById('searchForm').reset();
            document.getElementById('eventDetails').style.display = 'none';
        } else {
            alert('Error al actualizar el evento');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
});