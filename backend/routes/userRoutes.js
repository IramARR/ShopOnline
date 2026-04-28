const express = require('express');
const router = express.Router();
const User = require('../models/User');

const { authUser, registerUser } = require('../controller/userController');

const jwt = require('jsonwebtoken'); // Para crear el pase de entrada
const bcrypt = require('bcryptjs'); // Para comparar constrasenas seguras

// RUTA REGISTER: POST /api/users/register
router.post('/register', registerUser);


// RUTA LOGIN: POST /api/users/login
router.post('/login', authUser);

module.exports = router;