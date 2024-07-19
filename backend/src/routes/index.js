const { Router } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const WaiterRating = require('../models/WaiterRating');
const user = require('../models/user');
const Order = require('../models/order')
const fs = require('fs');
const path = require('path');

let loggedUserName = ''; 

router.post('/register', async (req, res) => {
    const { nombre, cedula, email, password } = req.body;
    const newUser = new user ({nombre, cedula, email, password});
    await newUser.save();
    const token = jwt.sign({_id: newUser._id}, 'secretKey');
    res.status(200).json({_id: newUser._id});
})

router.post('/login', async(req, res) =>{
    const {email, password}= req.body;
    const userFind = await user.findOne({email});
    if(!userFind) return res.status(401).send("El correo no existe")
    if(userFind.password !== password) return res.status(401).send("incorrecta")
    
    const token = jwt.sign({ id: user._id}, 'secretKey');
    loggedUserName = userFind.nombre;
    console.log(loggedUserName);
    return res.status(200).json({token});
});

router.get('/api/name', async (req, res) => {
  try {
    if (!loggedUserName) {
      return res.status(401).send("Usuario no autenticado");
    }
    console.log(loggedUserName);
    res.json({ name: loggedUserName });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/update', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const userFind = await user.findOne({ email });
        if (!userFind) return res.status(404).send("Usuario no encontrado");
        console.log(userFind.password);
        userFind.password = newPassword;
        console.log(userFind.password);
        await userFind.save();
        res.status(200).send("Contraseña actualizada correctamente");
    } catch (error) {
        res.status(500).send("Error al actualizar la contraseña");
    }
})

router.delete('/delete', async (req, res) =>{
    const {email, password} = req.body;
    try
    {
        const userFind = await user.findOne({ email });
        if (!userFind) return res.status(401).send("El correo no existe");
        if (userFind.password !== password) return res.status(401).send("Contraseña incorrecta");

        
        await userFind.deleteOne({_id: user._id});
        res.status(200).send("El usuario ha sido eliminado");
    }
    catch(error)
    {
        res.status(500).send("La eliminación ha sido incorrecta");
    }
    
});

// registrar platos
router.post('/registrar-platos', async (req, res) => {
    const { name, description, price, path } = req.body;
    const newMenuItem = new MenuItem ({name, description, price,path });
    await newMenuItem.save();
    const token = jwt.sign({_id: newMenuItem._id}, 'secretKey');
    res.status(200).json({_id: newMenuItem._id});
})
// Endpoint para obtener la lista de platos disponibles en el menú
router.get('/api/platos', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Endpoint para crear un pedido

router.post('/api/pedidos', verifyToken, async (req, res) => {
  const { products } = req.body;
  console.log('pr:'+ products);

  if (!products || products.length === 0) {
      return res.status(400).send('El listado de productos es requerido');
  }

  let total = 0;
  products.forEach(product => {
      total += product.precio * product.cantidad;
      console.log(product);
  });

  const newOrder = new Order({
      userName: loggedUserName,
      products: products,
      total: total
  });

  try {
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
  } catch (error) {
      console.error('Error al realizar el pedido:', error);
      console.log('pr:'+ products);
      res.status(500).send('Hubo un problema al realizar el pedido');
  }
  
});

router.get('/api/pedidos/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/todos', async (req, res) => {
  try {
      const pedidos = await Order.find();
      res.json(pedidos);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

//actualizar plato
router.put('/update-plato/:id', async (req, res) => {
  const { description } = req.body;
  const { id } = req.params;
  
  try {
    console.log(`Updating plato with id: ${id}`);
    console.log(`New description: ${description}`);

    const menuItemFind = await MenuItem.findById(id);
    
    console.log(menuItemFind);
    if (!menuItemFind) {
      console.error(`Plato not found with id: ${id}`);
      return res.status(404).send("Plato no encontrado");
    }

    menuItemFind.description = description;
    await menuItemFind.save();

    res.status(200).send("Descripción actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar la descripción", error);
    res.status(500).send("Error al actualizar la descripción");
  }
});

//eliminar pedido
router.delete('/api/pedidos/:id', async (req, res) => {
  try {
      const pedido = await Order.findByIdAndDelete(req.params.id);
      if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });
      res.status(200).json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Endpoint para enviar la calificación del mesero
router.post('/api/calificaciones', async (req, res) => {
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

module.exports = router;

function verifyToken(req, res, next){
    if(!req.headers.authorizacion){
        console.log("1");
        return res.status(401).send('Unathorize Request 1');
    }
    //se coloca por defecto la palabra bearer espacio y el token obtenido
    //dividir el string recibido 
    const token = req.headers.authorizacion.split(' ')[1]// crea un arreglo ['Bearer', 'token']
     if (token == 'null'){
        console.log("2");
        return res.status(401).send('Unathorize Request');
     }

     const payload = jwt.verify(token, 'secretKey') //Contenido del token
     //console.log(payload)// muestra los datos contenidos en el payload deberia ser el id del usuario
     req.userId = payload._id ;
     next();
}