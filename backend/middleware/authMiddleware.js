const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async(req,res,next) => {
        //console.log("Headers recibidos: ", req.headers.authorization);
    let token;

    //El token suele venir en el "Header" de la peticion
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try{
            token = req.headers.authorization.split(' ')[1]; // Extraemos el codigo
                //console.log("Token extraido: ",token);
            const decoded = jwt.verify(token, 'techshop_secret_key_2026'); // Lo decodificamos
                //console.log("Token decodificado: ", decoded);
            // Buscamos al usuario en la BD (menos el password) y lo metemos en la peticion
            req.user = await User.findById(decoded.id).select('-password');

            //Si todo sale bien, llamamos next() y SALIMOS de la funcion con return
            return next(); // "Todo bien, puedes pasar"
        }catch (error){
            console.error("ERROR EN JWT: ", error.message);
            // Usamos return para que el codigo se detenga aqui
            return res.status(401).json({ message: 'No autorizado, token fallido'})
        }
    }

    //Si no hay token en absoluto
    if(!token){
        res.status(401).json({ message: 'No hay token, acceso denegado '});
    }
};

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401);
        throw new Error('No autorizado como administrador');
    }
};

module.exports = { protect, admin };