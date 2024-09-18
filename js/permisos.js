const url = 'http://localhost:3000/api/Permiso'
const modal = document.querySelector("#modal");

const listarPermisos = async()=>{
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
            document.querySelectorAll('btn-open-privilege').forEach(btn => {
                btn.addEventListener('click', () => modal.showModal());
            });
           
        })
    })
}


const crearPermiso = async() => {
    const permiso = { //Objeto a enviar a la api
        nombre_permiso: document.getElementById('nombre_permiso').value,
        
    }
    //console.log(vehicle)
    fetch(url, { //Petición
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(permiso),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then((resp) => resp.json())//Obteniendo la respuesta
    .then(json => {
        //console.log(json.msg) //Imprimir la respuesta
        alert(json.msg) //Imprimir la respuesta
    })
}


