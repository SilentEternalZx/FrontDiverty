const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const Person = require('./models/person');
const Event = require('./models/event');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/tu_base_de_datos', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

  router.get('/eventos/buscar', async (req, res) => {
    try {
        const { cedula } = req.query;
        
        // Primero, busca la persona por cédula
        const persona = await Person.findOne({ cedula });
        if (!persona) {
            return res.status(404).json({ message: 'No se encontró ningún cliente con esa cédula' });
        }

        // Luego, busca el evento asociado a esa persona
        const evento = await Event.findOne({ cliente: persona._id }).populate('cliente');
        if (!evento) {
            return res.status(404).json({ message: 'No se encontró ningún evento para este cliente' });
        }

        res.json(evento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para crear una persona
app.post('/personas', async (req, res) => {
  try {
    const person = new Person(req.body);
    await person.save();
    res.status(201).json(person);
  } catch (error) {
    console.error('Error al guardar la persona:', error);
    res.status(400).json({ message: error.message });
  }
});


// Ruta para obtener todas las personas
app.get('/personas', async (req, res) => {
  try {
    const personas = await Person.find();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para crear un evento
app.post('/eventos', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para obtener todos los eventos
app.get('/eventos', async (req, res) => {
  try {
    const eventos = await Event.find();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Ruta para obtener un evento por id
app.get('/eventos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const evento = await Event.findById(id);
    if (!evento) {
      res.status(404).json({ message: 'Evento no encontrado' });
      } else {
        res.json(evento);
        }
        } catch (error) {
          res.status(500).json({ message: error.message });
          }
          });


router.patch('/eventos/:id', async (req, res) => {
  try {
    const { fechaHoraEvento, serviciosTomados, direccionEvento } = req.body;
    const eventoActualizado = await Event.findByIdAndUpdate(req.params.id, 
      { fechaHoraEvento, serviciosTomados, direccionEvento },
      { new: true }
    );
    if (!eventoActualizado) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json(eventoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(3000, () => console.log('Servidor iniciado en el puerto 3000'));
module.exports = router;

