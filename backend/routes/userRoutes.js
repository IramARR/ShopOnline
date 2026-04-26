const express = require('express');
const router = express.Router();
const User = require('../models/User');

const { authUser } = require('../controller/userController');

const jwt = require('jsonwebtoken'); // Para crear el pase de entrada
const bcrypt = require('bcryptjs'); // Para comparar constrasenas seguras

// RUTA REGISTER: POST /api/users/register
router.post('/register', async(req,res) => {
    const { name, email, password } = req.body;

    //1. Verificamos si el usuario ya existe para no duplicarlo
    const userExists = await User.findOne({ email });

    if(userExists){
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    //2. Creamos al nuevo usuario
    // La password se encriptara solo gracias al "pre=save" que pusimos en el modelo
    const user = await User.create({
        name,
        email,
        password
    });

    if(user){
        //3. Si se crea con exito, mandamos sus datos y un token de una vez
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: jwt.sign({ id: user._id }, 'techshop_secret_key_2026', { expiresIn: '30d' })
        });
    }else{
        res.status(400).json({ message: 'Datos de usuario invalidos' });
    }

});


// RUTA LOGIN: POST /api/users/login
router.post('/login', authUser);

module.exports = router;