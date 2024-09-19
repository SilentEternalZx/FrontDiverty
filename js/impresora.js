const calibrateButton = document.getElementById('calibrate-button');
const posicionArea = document.getElementById('posicion-area');

calibrateButton.addEventListener('click', () => {
    // Aquí podrías realizar la lógica de calibración, por ejemplo:
    let newX = prompt("Ingresa la nueva posición X:");
    let newY = prompt("Ingresa la nueva posición Y:");

    // Convertimos los valores ingresados a números y actualizamos la posición
    posicionArea.style.left = `${newX}px`;
    posicionArea.style.top = `${newY}px`;
});