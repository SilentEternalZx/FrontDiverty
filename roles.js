// URL de la API
const url = 'http://localhost:3000/diverty/role/list';
const urlEdit = 'http://localhost:3000/diverty/role';
const permisosUrl = 'http://localhost:3000/diverty/permissions/list';

// Obtener elementos del DOM
const modal = document.getElementById("role-modal");
const addBtn = document.getElementById("open-role-modal");
const span = document.getElementsByClassName("close")[0];
const cancelBtn = modal.querySelector(".cancel-button");
const backdrop = document.querySelector(".modal-backdrop");
const tableContainer = document.querySelector(".table-container");
const roleForm = document.getElementById("role-form");
const permisosContainer = document.querySelector('.permisos-checkbox');

// Variable para controlar el modo del formulario
let isEditMode = false;

// Función para abrir el modal
function openModal(editMode = false) {
    modal.style.display = "block";
    backdrop.style.display = "block";
    document.body.style.overflow = "hidden";
    isEditMode = editMode;

    if (editMode) {
        modal.querySelector('h2').textContent = 'Editar Rol';
        roleForm.querySelector('button[type="submit"]').textContent = 'Actualizar Rol';
    } else {
        modal.querySelector('h2').textContent = 'Agregar Rol';
        roleForm.querySelector('button[type="submit"]').textContent = 'Agregar Rol';
        roleForm.removeAttribute('data-id');
        roleForm.reset();
    }
}

// Función para cerrar el modal
function closeModal() {
    modal.style.display = "none";
    backdrop.style.display = "none";
    document.body.style.overflow = "auto";
    roleForm.reset();
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

// Función para listar roles
async function listRoles() {
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

        if (!data.roles || !Array.isArray(data.roles)) {
            throw new Error('La respuesta no contiene un array de roles');
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Permisos</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.roles.forEach(role => {
            const permisosHTML = role?.permission?.privileges?.map(p => p.name).join(', ') || 'Ninguno'

            tableHTML += `<tr>
                <td>${role.name}</td>
                <td>${permisosHTML}</td>
                <td>
                    <button onclick="editRole('${role._id}')">Editar</button>
                    <button onclick="deleteRole('${role._id}')">Eliminar</button>
                </td>
            </tr>`;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = tableHTML;

        // Log the roles data for debugging
        console.log('Roles data:', data.roles);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        tableContainer.innerHTML = `<p>Error al cargar los roles: ${error.message}</p>`;
    }
}



// Función para cargar permisos
async function loadPermisos(selectedPermissions = []) {
    try {
        const resp = await fetch(permisosUrl, {
            method: 'GET',
            mode: 'cors',
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });

        if (!resp.ok) {
            throw new Error(`Error HTTP: ${resp.status}`);
        }

        const data = await resp.json();

        if (!data.permissions || !Array.isArray(data.permissions)) {
            throw new Error('La respuesta no contiene un array de permisos');
        }

        permisosContainer.innerHTML = '';
        data.permissions.forEach(permiso => {
            const isChecked = selectedPermissions.some(p => p._id === permiso._id);
            const checkboxHtml = `
                <div class="checkbox">
                    <input type="checkbox" id="permiso_${permiso._id}" name="permisos[]" value="${permiso._id}" ${isChecked ? 'checked' : ''}>
                    <label for="permiso_${permiso._id}">${permiso.name}</label>
                </div>
            `;
            permisosContainer.innerHTML += checkboxHtml;
        });
    } catch (error) {
        console.error('Error al cargar permisos:', error);
        permisosContainer.innerHTML = '<p>Error al cargar permisos</p>';
    }
}

// Función para crear rol
async function createRole(roleData) {
    try {
        const resp = await fetch(urlEdit, {
            method: 'POST',
            mode: 'cors',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(roleData)
        });

        if (!resp.ok) {
            throw new Error(`Error HTTP: ${resp.status}`);
        }

        const data = await resp.json();
        console.log('Rol creado:', data);

        closeModal();
        await listRoles();
    } catch (error) {
        console.error('Error al crear rol:', error);
        alert(`Error al crear rol: ${error.message}`);
    }
}

// Función para editar rol
async function editRole(roleId) {
    try {
        const resp = await fetch(`${urlEdit}/${roleId}`, {
            method: 'GET',
            mode: 'cors',
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });

        if (!resp.ok) {
            throw new Error(`Error HTTP: ${resp.status}`);
        }

        const role = await resp.json();

        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.value = role.name;
        } else {
            console.error('Name input not found');
        }

        await loadPermisos(role.permissions || []);

        roleForm.setAttribute('data-id', roleId);

        openModal(true);
    } catch (error) {
        console.error('Error al cargar rol para editar:', error);
        alert(`Error al cargar rol para editar: ${error.message}`);
    }
}


// Función para actualizar rol
async function updateRole(roleId, roleData) {
    try {
        const resp = await fetch(`${urlEdit}/${roleId}`, {
            method: 'PUT',
            mode: 'cors',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(roleData)
        });

        if (!resp.ok) {
            throw new Error(`Error HTTP: ${resp.status}`);
        }

        const data = await resp.json();
        console.log('Rol actualizado:', data);
        closeModal();
        await listRoles();
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        alert(`Error al actualizar rol: ${error.message}`);
    }
}


// Función para eliminar rol
async function deleteRole(roleId) {
    if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
        try {
            const resp = await fetch(`${urlEdit}/${roleId}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (!resp.ok) {
                throw new Error(`Error HTTP: ${resp.status}`);
            }

            console.log('Rol eliminado');
            listRoles();
        } catch (error) {
            console.error('Error al eliminar rol:', error);
            alert(`Error al eliminar rol: ${error.message}`);
        }
    }
}

// Event listener para el formulario
roleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const roleData = {
        name: document.getElementById('name').value,
        permissions: Array.from(document.querySelectorAll('input[name="permisos[]"]:checked')).map(checkbox => checkbox.value)
    };

    const roleId = roleForm.getAttribute('data-id');
    if (roleId) {
        await updateRole(roleId, roleData);
    } else {
        await createRole(roleData);
    }
});

// Cargar roles y permisos al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    listRoles();
    loadPermisos();
});