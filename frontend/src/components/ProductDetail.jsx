import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/useCart';

const ProductDetail = () => {
    const { id } = useParams(); //Obtenemos el ID de la URL
    const [product,setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    const navigate = useNavigate();

    const addToCartHandler = (product) =>{
        //1. Buscamos si hay sesion en el localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if(!userInfo){
            // 2. Si no hay, lo mandamos al login
            alert("Oye! Primero inicia sesion para comprar");
            navigate('/login');
        }else{
            // 3. Si si hay aqui es donde llamas la logica de tu carrito
            console.log("Producto agregado al carrito");
            addToCart(product);
        }
    }

    useEffect(() => {
        const getProduct = async () => {
            try{
                
                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                console.log("Datos recibidos: ",res.data);
                setProduct(res.data)
                setLoading(false);
            }catch (err){
                console.error(err);
            }finally{
                setLoading(false);
            }
        };
        if (id) getProduct();
    }, [id]);

    // 1. Primero revisamos si todavía está cargando
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <h1 className="text-2xl font-bold animate-pulse text-slate-400">
                    Cargando especificaciones...
                </h1>
            </div>
        );
    }

    // 2. SOLO SI ya terminó de cargar, revisamos si el objeto 'product' tiene datos
    // Si 'loading' es false y 'product' sigue siendo null, entonces sí es un error real
    if (!product || Object.keys(product).length === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-500 mb-4">
                    Producto no encontrado.
                </h1>
                <button 
                    onClick={() => window.location.reload()} 
                    className="text-blue-500 underline"
                >
                    Reintentar cargar
                </button>
            </div>
        );
    }

    return(
        <div className='min-h-screen bg-slate-50 py-12 px-4'>
            <div className='max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden'>
                <div className='flex flex-col md:flex-row'>
                    {/* Lado izquierdo: imagen */}
                    <div className='md:w-1/2 bg-slate-200'>
                        <img src={product.image} alt={product.name} className='w-full h-full object-cover'/>
                    </div>
                    {/* Lado derecho: informacion */}
                    <div className='md:w-1/2 p-8 md:p-12 flex flex-col justify-center'>
                        <span className='text-blue-600 font-bold uppercase tracking-widest text-sm mb-2'>
                            {product.category}
                        </span>

                        {/* Boton para regresar */}
                        <button
                            onClick={() => window.history.back()}
                            className='mb-4 flex items-center text-slate-500 hover:text-blue-600 transition-colors'
                        >
                            <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Volver a la tienda
                        </button>

                        <h1 className='text-4xl font-black text-slate-900 mb-4'>{product.name}</h1>
                        <p className='text-slate-600 text-lg mb-8 leading-relaxed'>
                            {product.description}
                        </p>
                        <div className='flex items-center justify-between mb-10'>
                            <span className='text-4xl font-black text-slate-900'>${product.price}</span>
                            <span className='text-green-500 font-semibold text-sm'>En stock / Envio inmediato</span>
                        </div>
                        <button
                            onClick={() => addToCartHandler(product)}
                            className='w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3'
                        >
                            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Agregar al carrito
                        </button>
                        <div className='mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-8'>
                            <div className='text-sm text-slate-500'>
                                <strong>Garantia:</strong> 1 año con fabricante
                            </div>
                        <div className='text-sm text-slate-500'>
                            <strong>ID del producto:</strong> {product._id.substring(0, 8)}...
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;