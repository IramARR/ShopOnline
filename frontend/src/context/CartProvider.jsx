import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CartContext from './CartContext';

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Cargar de DB al iniciar
    useEffect(() => {
        const syncInitialCart = async () => {
            if(userInfo?.token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` }};
                    const { data } = await axios.get('/api/cart', config);

                    //Si la DB tiene productos, los usamos
                    if(data.cartItems && data.cartItems.length > 0) {
                        setCart(data.cartItems);
                        localStorage.setItem('cartItems', JSON.stringify(data.cartItems));
                    }else{
                        // Si la DB esta vacia pero el localStorage tiene algo (el usuario agrego algo)
                        const localCart = JSON.parse(localStorage.getItem('cartItems')) || [];
                        if(localCart.length > 0){
                            await axios.post('/api/cart', { cartItems: localCart }, config);
                            setCart(localCart);
                        }
                    }
                } catch (error) {
                    console.error("Error sincronizando carrito inicial", error);
                }
            }
        };
        syncInitialCart();
    },[userInfo?.token]);

    // Sincronizar con DB
    const syncCart = async (newCart) => {
        if (userInfo?.token) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.post('/api/cart', { cartItems: newCart }, config);
            } catch (error) { console.error("Error en syncCart " + error); }
        }
    };

    // Funcion para formatear el carrito antes de enviarlo
    const formatCartForDB = (cartToFormat) => {
        return cartToFormat.map(item => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id || item.product
        }));
    };

    const addToCart = (product) => {
        const existItem = cart.find((x) => (x._id || x.product) === product._id);
        let newCart;

        if (existItem) {
            newCart = cart.map((x) =>
                (x._id || x.product) === existItem._id ? { ...x, qty: x.qty + 1 } : x
            );
        } else {
            newCart = [...cart, { ...product, qty: 1 }];
        }

        setCart(newCart);
        localStorage.setItem('cartItems', JSON.stringify(newCart));
        
        // Al sincronizar, mandamos el formato que MongoDB exige
        syncCart(formatCartForDB(newCart));
    };
    const removeFromCart = async (id) => {
        // Filtramos usando tanto _id como product por seguridad
        const newCart = cart.filter((x) => (x._id !== id && x.product !== id));
        setCart(newCart);
        localStorage.setItem('cartItems', JSON.stringify(newCart));

        if (userInfo?.token) {
            try {
                const config = {
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}` 
                    }
                };
                // Enviamos el carrito formateado
                const formattedCart = formatCartForDB(newCart);
                await axios.post('/api/cart', { cartItems: formattedCart }, config);
            } catch (error) {
                console.error("Error al eliminar de la DB", error);
            }
        }
    };

    // ... Agrega aquí tu removeFromCart y clearCart siguiendo la misma lógica de syncCart

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};