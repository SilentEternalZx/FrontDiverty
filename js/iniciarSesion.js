const url = 'http://localhost:3000/iniciarSesion'


const iniciarSesion = async() => {
    const usuario = { //Objeto a enviar a la api
        correo: document.getElementById('correo').value,
        contraseña: document.getElementById('contraseña').value
    }
    //console.log(vehicle)
    fetch(url, { //Petición
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(usuario),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then((resp) => resp.json())//Obteniendo la respuesta
    .then(json => {
        //console.log(json.msg) //Imprimir la respuesta
        alert(json.msg) //Imprimir la respuesta
    })
}
