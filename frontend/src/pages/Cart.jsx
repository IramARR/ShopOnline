import React, { useEffect } from "react";
import { useCart } from "../context/useCart";
import { useNavigate, Link } from "react-router-dom"; // Para redirigir al usuario a otra pagina despues de la compra

const Cart = () => {
    // Extraemos la lista de productos y la funcion para limpiar el carrito del contexto
    const { cart, removeFromCart, placeOrder } = useCart();

    const navigate = useNavigate();

    // Recuperamos el usuario
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Proteccion: si no hay usuario, redirigir al login
    useEffect(() => {
        if(!userInfo){
            navigate('/login');
        }
    }, [userInfo, navigate]);

    // Calculamos el total sumando el precio de cada producto en el carrito
    //const total = cart.reduce((acc, item) => acc + item.price, 0);

    const handleCheckout = async () => {
        if(cart.length === 0) return;
        try {
            const orderData = {
                orderItems: cart,
                shippingAddress: {
                    address: "Calle Falsa 123",
                    city: "Springfield",
                    postalCode: "12345",
                    country: "USA",
                },
                paymentMethod: "PayPal",
                itemsPrice: cart.reduce((acc, item) => acc + item.price, 0),
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: cart.reduce((acc, item) => acc + item.price, 0),
            };
            const createdOrder = await placeOrder(orderData);

            alert(`¡Compra realizada con éxito! Tu numero de pedido es: ${createdOrder._id}`);
            navigate('/'); // Redirige al usuario a la página principal después de la compra
        } catch (error) {
            alert(error.response?.data?.message || "Error al procesar la compra");
        }
    };

    if(!userInfo) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-black text-slate-900 mb-8">Tu carrito</h2>
                {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border-2 border-dashed border-slate-200">
                    <div className="bg-slate-100 p-6 rounded-full mb-6">
                        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Tu carrito está triste</h2>
                    <p className="text-slate-500 mb-8">Aún no has agregado ninguna joya tecnológica.</p>
                    <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                    Explorar Productos
                    </Link>
                </div>
                ) : (
                <div className="space-y-4">
                    {/* 1. Lista de productos agregaods */}
                        {cart.map((item) => (
                            <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={item.image || 'https://via.placeholder.com/100'} 
                                        alt={item.name} 
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div>
                                        <h4 className="font-bold text-slate-800">{item.name}</h4>
                                        <p className="text-blue-600 font-bold">${item.price}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))} {/* Fin del mapeo */}

                    {/* 2. Resumen del total */}
                    <div className="mt-10 p-6 bg-slate-900 rounded-2xl text-white flex justify-between items-center shadow-xl">
                        <div>
                            <p className="text-slate-400 text-sm">Total a pagar:</p>
                            <p className="text-3xl font-black">${cart.reduce((acc, item) => acc + item.price, 0)}</p>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-500 px-6 py-4 rounded-xl font-bold translate-all shadow-lg shadow-blue-500/30" onClick={handleCheckout}>
                            Finalizar Compra
                        </button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};


export default Cart;