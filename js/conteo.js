const countdownElement = document.getElementById('countdown');
const messageElement = document.getElementById('message');
const startButton = document.getElementById('start-button');
const timeInput = document.getElementById('time');
let countdown; // segundos


startButton.addEventListener('click', () => {
  countdown = parseInt(timeInput.value, 10);
  countdownElement.style.opacity = 1;
  countdownElement.textContent = countdown;
  messageElement.style.opacity = 0;
  updateCountdown();
});

function updateCountdown() {
  countdownElement.textContent = countdown;
  
  if (countdown === 0) {
    showMessage();
  } else {
    countdown--;
    setTimeout(updateCountdown, 1000);
  }
}

function showMessage() {
  countdownElement.style.opacity = 0;
  messageElement.textContent = '¡Sonríe!';
  messageElement.style.opacity = 1;
}
/*const countdownElement = document.getElementById('countdown');
const messageElement = document.getElementById('message');
const startButton = document.getElementById('start-button');
const timeInput = document.getElementById('time');

let countdown;

startButton.addEventListener('click', () => {
    countdown = parseInt(timeInput.value, 10);
    countdownElement.textContent = countdown;
    messageElement.style.opacity = 0;
    updateCountdown();
});

function updateCountdown() {
    if (countdown === 0) {
        takePhoto();
    } else {
        countdownElement.textContent = countdown;
        countdown--;
        setTimeout(updateCountdown, 1000);
    }
}

function takePhoto() {
    countdownElement.style.opacity = 0;
    messageElement.textContent = '¡Sonríe!';
    messageElement.style.opacity = 1;
    // Aquí puedes añadir la lógica para tomar la foto, como usar la cámara del dispositivo
}*/
