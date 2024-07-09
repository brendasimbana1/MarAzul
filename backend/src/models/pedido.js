// models/Pedido.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
  cliente: { type: String, required: true },
  productos: [
    {
      menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem' }, // Ahora no es requerido
      cantidad: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Pedido', pedidoSchema);
