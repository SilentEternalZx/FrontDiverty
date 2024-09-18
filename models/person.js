const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  cedula: { type: String, required: true, unique: true },
  fechaNacimiento: { type: Date, required: true },
  direccion: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String, required: true }
});

module.exports = mongoose.model('Person', personSchema);

