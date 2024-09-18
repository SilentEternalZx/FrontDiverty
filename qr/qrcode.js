let qrdiv = document.getElementById('qrcode'),
    btnConvert = document.getElementById('convert'),
    textInput = document.getElementById('text'),
    errorDiv = document.getElementById('error'); // Agregamos un elemento para mostrar errores

const qrcode = new QRCode(qrdiv,{
    width: 200,
    height: 200
})

function createQR() {
  btnConvert.addEventListener('click', e => {  
      let text = textInput.value.trim(); // Eliminamos espacios en blanco

      const urlRegex = /^(?:https?:\/\/|www\.|ftp:\/\/)?([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)(?:\/[^\s]*)?$/; // Expresión regular para validar URLs
      if (!urlRegex.test(text)) {
          const errorMessage = 'Invalid URL. Please enter a valid URL, e.g. https://example.com or example.com';
          errorDiv.innerHTML = `
            <span class="error-icon">!</span>
            <span>${errorMessage}</span>
          `;
          errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'; // Agregamos un fondo rojo al mensaje de error
          errorDiv.style.padding = '10px';
          errorDiv.style.borderRadius = '10px';
          errorDiv.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
          textInput.focus();
          return;
      }

      
      qrcode.makeCode(text);
      // Eliminamos completamente el mensaje de error
      errorDiv.innerHTML = '';
      errorDiv.style.backgroundColor = '';
      errorDiv.style.padding = '';
      errorDiv.style.borderRadius = '';
      errorDiv.style.boxShadow = '';
      textInput.value = ''; // Limpiamos el input de texto

      // Agregamos animación al código QR
      qrdiv.classList.add('animate');
      setTimeout(() => {
          qrdiv.classList.remove('animate');
      }, 2000); // Removemos la animación después de 2 segundos
  })
}

function clearQR() {
    textInput.addEventListener('input', e => {
        qrcode.clear(); // Limpiamos el código QR cuando el usuario cambia la entrada de texto
    })
}

// Agregamos evento de mouseover y mouseout para la animación
let timeout;

qrdiv.addEventListener('mouseover', () => {
  timeout = setTimeout(() => {
    qrdiv.classList.add('animate');
  }, 500); // Activamos la animación después de 500ms
});

qrdiv.addEventListener('mouseout', () => {
  clearTimeout(timeout);
  qrdiv.classList.remove('animate');
});

createQR();
clearQR();