const userModal = {
    loadRoles: async () => {
        try {
            const response = await fetch('http://localhost:3000/diverty/role/list');
            const rolesSelect = document.getElementById('roles-select');
            const data = await response.json();
            data.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.text = role.nombre;
                rolesSelect.appendChild(option);
            });
        } catch (error) {
            console.error(error);
        }
    },

    openEditModal: (user) => {
        // Abrir el modal de edición con los datos del usuario
        modal.style.display = "block";
        backdrop.style.display = "block";
        document.body.style.overflow = "hidden";

        // Rellenar los campos del formulario con los datos del usuario
        const form = document.querySelector("form");
        form.querySelector("input[type='text']").value = user.nombre;
        form.querySelector("input[type='email']").value = user.email;
        form.querySelector("input[type='password']").value = user.contraseña;
        form.querySelector("select").value = user.rol;
    }
};

export default userModal;