const url = 'http://localhost:3000/api/Privilegio'

const listarPrivilegios = async()=>{
    const cuerpoTablaPermisos = document.getElementById('cuerpoTablaPermisos')
    let response = ''
    fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then((resp) => resp.json()) //Obtener la respuesta y convertirla a json
    .then(function(data) {
        let list = data.permisos //Capturar el array devuelto por la api
        list.map(function(permiso) {//Recorrer el array
            response += `
                <tr>
                    <td>${permiso.nombre_permiso}</td>
                    <td><input type="checkbox" ${permiso.estado_permiso ? 'checked' : ''}></td>
                    <td>
                        <button class="edit-btn">Editar</button>
                        <button class="delete-btn">Eliminar</button>
                        <button id="btn-open-privilege">Privilegios</button>
                    </td>
                </tr>
            `
            cuerpoTablaPermisos.innerHTML = response
        })
    })
}