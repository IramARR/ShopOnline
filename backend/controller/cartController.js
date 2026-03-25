const Cart = require('../models/Cart');

// @desc    Guardar o actualizar el carrito del usuario
// @route   POST/api/cart
// @access  Private

const saveCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        
        // Log para ver qué está llegando exactamente del frontend
        //console.log("Datos recibidos en el body:", cartItems);
        //console.log("ID del usuario logueado:", req.user._id);

        let cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            cart.cartItems = cartItems;
            const updatedCart = await cart.save();
            return res.status(200).json(updatedCart);
        } else {
            const newCart = new Cart({
                user: req.user._id,
                cartItems
            });
            const createdCart = await newCart.save();
            return res.status(201).json(createdCart);
        }
    } catch (error) {
        // ESTO ES LO MÁS IMPORTANTE: Ver el error real en la terminal
        //console.error("ERROR CRÍTICO EN SAVECART:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtener el carrito del usuario logueado
// @route   GET/api/cart
// @access  Private
const getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if(cart){
        res.json(cart);
    }else{
        res.json({ cartItems: [] });
    }
};

module.exports = { saveCart, getCart };
