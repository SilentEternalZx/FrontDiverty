const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  nombreEvento: { type: String, required: true },
  fechaHoraEvento: { type: Date, required: true },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'People', required: true },
  serviciosTomados: { type: [String], required: true },
  direccionEvento: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
