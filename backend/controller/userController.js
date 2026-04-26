const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Para crear el pase de entrada
const bcrypt = require('bcryptjs'); // Para comparar constrasenas seguras
const dotenv = require('dotenv');
dotenv.config();

// Funcion auxiliar para generar el token
const generateToken = (id) => {
    return jwt.sign({ id }, 'techshop_secret_key_2026', {
        expiresIn: '30d',
    });
};

// @desc Autenticar usuario y obtener token
// @route POST /api/users/login
// @access Public
const authUser = async (req, res) => {
    //1. Extraemos los datos que el usuario escribio en el formulario
    const { email, password } = req.body;

    //2. Buscamos en la base de datos si existe alguien con ese email
    const user = await User.findOne({ email });

    //3. Si el usuario existe, comparamos la contrasena escrita con la de la BD
    //bcrypt.compare desencripta y compara de forma segura.

    
    if(user && (await bcrypt.compare(password, user.password))) {

        // Si todo es correcto, respondemos con los datos del usuario y su TOKEN
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            // El TOKEN es como una firma digital que dura 30 dias
            token: generateToken(user._id) // Aqui generamos el JWT
        });
    }else{
        // Si algo falla, mandamos un error 401 (no autorizado)
        res.status(401).json({ message: 'Correo o contrasena invalidos' });
    }
};

module.exports = { authUser };