// models/Pedido.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userName: {
      type: String
  },
  products: [{
      nombre: String,
      precio: Number,
      cantidad: Number
  }],
  total: {
      type: Number,
      required: true
  }
});

module.exports = mongoose.model('Order', orderSchema);