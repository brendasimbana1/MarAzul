const { Router } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const WaiterRating = require('../models/WaiterRating');
const user = require('../models/user');
const Pedido = require('../models/pedido');
const fs = require('fs');
const path = require('path');

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
    if(!user) return res.status(401).send("El correo no existe")
    if(userFind.password !== password) return res.status(401).send("incorrecta")
    
    const token = jwt.sign({ id: user._id}, 'secretKey');
    return res.status(200).json({token});
})

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
    
})

//respuesta al servidor con arreglo de tareas
router.get('/task',(req, res) =>{
    res.json([
        {
            cedula:"1750568188",
            nombre: 'Brenda Simbana',
            date:"2024-11-17T20:39:05.211Z"
        },
        {
            cedula:"1713303871",
            nombre: 'Paola Simbana',
            date:"2024-11-17T20:39:05.211Z"
        },
        {
            cedula:"1724945603",
            nombre: 'Belen Simbana',
            date:"2024-11-17T20:39:05.211Z"
        }
    ])
})

//Se ejecuta primero la ruta a continuación se ejecuta la funcion 
router.get('/private-task', verifyToken,(req, res) =>{
    res.json([
        {
            cedula:"1750568188",
            nombre: 'Brenda Simbana',
            email: "brenda@gmail.com",
            ingreso: 30000,
            egreso: 15000,
            date:"2024-11-17T20:39:05.211Z"
        },
        {
            cedula:"1713303871",
            nombre: 'Paola Simbana',
            email: "paola@gmail.com",
            ingreso: 42000,
            egreso: 20000,
            date:"2024-11-17T20:39:05.211Z"
        },
        {
            cedula:"1724945603",
            nombre: 'Belen Simbana',
            email: "paola@gmail.com",
            ingreso: 32000,
            egreso: 10000,
            date:"2024-11-17T20:39:05.211Z"
        }
    ])
})

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
    try {
      const { cliente, productos } = req.body;
  
      // Calcular total
      let total = 0;
      for (const item of productos) {
        let menuItem;
        if (item.menuItem) {
          menuItem = await MenuItem.findById(item.menuItem);
          if (!menuItem) {
            console.log(`Producto no encontrado para menuItem ID: ${item.menuItem}`);
            // Puedes decidir cómo manejar esto, por ejemplo:
            // return res.status(400).json({ message: 'Producto no encontrado' });
          }
        }
        
        // Si no se encuentra el menuItem, se puede decidir ignorarlo o manejarlo según tu lógica
        if (menuItem) {
          total += menuItem.price * item.cantidad;
        }
      }
  
      const newPedido = new Pedido({ cliente, productos, total });
      const savedPedido = await newPedido.save();
      res.status(201).json(savedPedido);
    } catch (err) {
      console.error('Error al crear pedido:', err);
      res.status(500).json({ message: err.message });
    }
  });
  

router.get('/api/pedidos', async (req, res) => {
    try {
        const pedidos = await Pedido.find();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
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