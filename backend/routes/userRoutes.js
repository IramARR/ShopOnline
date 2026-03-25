const express = require('express');
const router = express.Router();
const User = require('../models/User');
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
router.post('/login', async(req,res) => {
    //1. Extraemos los datos que el usuario escribio en el formulario
    const { email, password } = req.body;

    //2. Buscamos en la base de datos si existe alguien con ese email
    const user = await User.findOne({ email });

    //3. Si el usuario existe, comparamos la contrasena escrita con la de la BD
    //bcrypt.compare desencripta y compara de forma segura.

    
    if(user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
            { id: user._id },
            'techshop_secret_key_2026',
            { expiresIn: '30d' }
        );

        // Si todo es correcto, respondemos con los datos del usuario y su TOKEN
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            // El TOKEN es como una firma digital que dura 30 dias
            token: token // Aqui generamos el JWT
        });
    }else{
        // Si algo falla, mandamos un error 401 (no autorizado)
        res.status(401).json({ message: 'Correo o contrasena invalidos' });
    }
});

module.exports = router;