// URL de la API
const url = 'http://localhost:3000/diverty/user/list';
const urlEdit = 'http://localhost:3000/diverty/user';
const rolesUrl = 'http://localhost:3000/diverty/role/list';

// Obtener elementos del DOM
const modal = document.getElementById("user-modal");
const addBtn = document.getElementById("open-modal");
const span = document.getElementsByClassName("close")[0];
const cancelBtn = modal.querySelector(".cancel-button");
const backdrop = document.querySelector(".modal-backdrop");
const tableContainer = document.querySelector(".table-container");
const userForm = document.getElementById("user-form");
const roleSelect = document.getElementById("role");

// Variable para controlar el modo del formulario
let isEditMode = false;

// Función para abrir el modal
function openModal(editMode = false) {
    modal.style.display = "block";
    backdrop.style.display = "block";
    document.body.style.overflow = "hidden";
    isEditMode = editMode;
    
    if (editMode) {
        modal.querySelector('h2').textContent = 'Editar Usuario';
        userForm.querySelector('button[type="submit"]').textContent = 'Actualizar Usuario';
    } else {
        modal.querySelector('h2').textContent = 'Agregar Usuario';
        userForm.querySelector('button[type="submit"]').textContent = 'Agregar Usuario';
        userForm.removeAttribute('data-id');
        userForm.reset();
    }
}

// Función para cerrar el modal
function closeModal() {
    modal.style.display = "none";
    backdrop.style.display = "none";
    document.body.style.overflow = "auto";
    userForm.reset();
}

// Eventos para abrir y cerrar el modal
addBtn.onclick = () => openModal(false);
span.onclick = closeModal;
cancelBtn.onclick = closeModal;

// Cerrar el modal cuando se hace clic fuera de él
window.onclick = function (event) {
    if (event.target == modal || event.target == backdrop) {
        closeModal();
    }
}

// Función para listar usuarios
async function listUsers() {
    try {
        const resp = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });

        if (!resp.ok) {
            throw new Error(`Error HTTP: ${resp.status}`);
        }

        const data = await resp.json();

        if (!data.users || !Array.isArray(data.users)) {
            throw new Error('La respuesta no contiene un array de usuarios');
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Permiso</th>
                        <th>Privilegios</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.users.forEach(user => {
            const privileges = user.role?.permission?.privileges?.map(p => p.name).join(', ') || 'Ninguno';

            tableHTML += `<tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role?.name || 'No asignado'}</td>
                <td>${user.role?.permission?.name || 'No asignado'}</td>
                <td>${privileges}</td>
                <td>
                    <button onclick="editUser('${user._id}')">Editar</button>
                    <button onclick="deleteUser('${user._id}')">Eliminar</button>
                </td>
            </tr>`;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = tableHTML;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        tableContainer.innerHTML = `<p>Error al cargar los usuarios: ${error.message}</p>`;
    }
}

// Función para cargar roles
async function loadRoles() {
    try {
        const resp = await fetch(rolesUrl, {
            method: 'GET',
            mode: 'cors',
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });

        if (!resp.ok) {
            throw new Error(`Error HTTP: ${resp.status}`);
        }

        const data = await resp.json();

        if (!data.roles || !Array.isArray(data.roles)) {
            throw new Error('La respuesta no contiene un array de roles');
        }

        roleSelect.innerHTML = '<option value="">Seleccionar Rol</option>';
        data.roles.forEach(role => {
            roleSelect.innerHTML += `<option value="${role._id}">${role.name}</option>`;
        });
    } catch (error) {
        console.error('Error al cargar roles:', error);
        roleSelect.innerHTML = '<option value="">Error al cargar roles</option>';
    }
}

// Función para crear usuario
async function createUser(userData) {
    try {
        const resp = await fetch(urlEdit, {
            method: 'POST',
            mode: 'cors',
            headers: {"Content-type": "application/json; charset=UTF-8"},
            body: JSON.stringify(userData)
        });

        if (!resp.ok) {
            throw new Error(`Error HTTP: ${resp.status}`);
        }

        const data = await resp.json();
        console.log('Usuario creado:', data);
        
        // Cerrar el modal
        closeModal();
        
        // Actualizar la lista de usuarios
        await listUsers();
    } catch (error) {
        console.error('Error al crear usuario:', error);
        alert(`Error al crear usuario: ${error.message}`);
    }
}

// Función para editar usuario
async function editUser(userId) {
    try {
        const resp = await fetch(`${urlEdit}/${userId}`, {
            method: 'GET',
            mode: 'cors',
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });

        if (!resp.ok) {
            throw new Error(`Error HTTP: ${resp.status}`);
        }

        const user = await resp.json();

        // Llenar el formulario con los datos del usuario
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('role').value = user.role._id;

        // Agregar un atributo data-id al formulario para identificar al usuario que se está editando
        userForm.setAttribute('data-id', userId);

        openModal(true);
    } catch (error) {
        console.error('Error al cargar usuario para editar:', error);
        alert(`Error al cargar usuario para editar: ${error.message}`);
    }
}

// Función para actualizar usuario
async function updateUser(userId, userData) {
    try {
        const resp = await fetch(`${urlEdit}/${userId}`, {
            method: 'PUT',
            mode: 'cors',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                role: userData.role
            })
        });

        if (!resp.ok) {
            throw new Error(`Error HTTP: ${resp.status}`);
        }

        const data = await resp.json();
        console.log('Usuario actualizado:', data);
        closeModal();
        listUsers();
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        alert(`Error al actualizar usuario: ${error.message}`);
    }
}

// Función para eliminar usuario
async function deleteUser(userId) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        try {
            const resp = await fetch(`${urlEdit}/${userId}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (!resp.ok) {
                throw new Error(`Error HTTP: ${resp.status}`);
            }

            console.log('Usuario eliminado');
            listUsers();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            alert(`Error al eliminar usuario: ${error.message}`);
        }
    }
}

// Event listener para el formulario
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value
    };

    const userId = userForm.getAttribute('data-id');
    if (userId) {
        // Si hay un ID, estamos editando un usuario existente
        await updateUser(userId, userData);
    } else {
        // Si no hay ID, estamos creando un nuevo usuario
        await createUser(userData);
    }
});

// Cargar usuarios y roles al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    listUsers();
    loadRoles();
});