import { useCart } from '../context/useCart';
import { Link, useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
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

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col">
        {/* Contenedor de Imagen con efecto Zoom */}
            <div className="relative h-56 overflow-hidden">
                <Link to={`/product/${product._id}`}>
                <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                </Link>
                <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {product.category}
                    </span>
                </div>
            </div>
        
            {/* Contenido */}
            <div className="p-5 flex flex-col h-full">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{product.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                {product.description}
                </p>
                
                {/* Precio y Botón de Añadir al Carrito */}
                {/* Fila de Precio y Botón con Salto de Línea */}
                <div className="flex flex-col gap-3 mt-auto">
                    <span className="text-2xl font-black text-slate-900">${product.price}</span>
                    <button 
                        onClick={() => addToCartHandler(product)}
                        className="w-full bg-slate-900 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <span>Añadir</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ProductCard;