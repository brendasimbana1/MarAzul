// index.js

/*const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const WaiterRating = require('./models/WaiterRating');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/taller4', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

// Endpoint para obtener la lista de platos disponibles en el menú
app.get('/api/platos', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint para enviar el pedido del cliente
app.post('/api/pedidos', async (req, res) => {
  // Aquí implementarías la lógica para procesar el pedido
  // Por ejemplo, guardar los detalles del pedido en la base de datos
  // y enviar una confirmación al cliente
  res.status(201).json({ message: 'Pedido recibido' });
});

// Endpoint para enviar la calificación del mesero
app.post('/api/calificaciones', async (req, res) => {
  try {
    const { waiterName, rating, comment } = req.body;
    const newRating = new WaiterRating({
      waiterName,
      rating,
      comment,
    });
    const savedRating = await newRating.save();
    res.status(201).json(savedRating);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});*/
