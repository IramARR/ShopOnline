import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";

const Navbar = () => {
    const navigate = useNavigate();
    const { cart } = useCart();

    // 1. Obtenemos los datos del usuario del localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // 2. Funcion para cerrar sesion
    const logoutHandler = () => {
        localStorage.removeItem('userInfo'); //Borramos la llave
        navigate('/login');
        window.location.reload(); // Recargamos para limpiar el estado global
    }

    return (
        <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 w-full overflow-x-hidden">
        {/* Cambiamos max-w-7xl por w-full y ajustamos el padding */}
        <div className="w-full px-2 sm:px-6 lg:px-8"> 
            <div className="flex justify-between items-center h-20 gap-2">
                
                {/* LOGO: flex-shrink-0 es VITAL aquí */}
                <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="font-black text-lg sm:text-xl">T</span>
                    </div>
                    <h1 className="text-sm sm:text-xl font-bold tracking-tighter uppercase italic whitespace-nowrap">
                        Tech<span className="text-blue-500">Shop</span>
                    </h1>
                </Link>

                {/* SECCIÓN DERECHA: Carrito y Usuario */}
                <div className="flex items-center gap-1 sm:gap-4 flex-shrink">
                    
                    {/* Carrito */}
                    <Link 
                    to={userInfo ? "/cart" : '/login'} 
                    className="relative p-2 hover:bg-slate-800 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {userInfo && cart.length > 0 && (
                            <span className="absolute top-0 right-0 bg-red-600 text-[10px] font-bold px-1.5 rounded-full">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    {/* Info Usuario */}
                    {userInfo && (
                        <div className="flex items-center gap-2 sm:gap-3 bg-slate-800/50 p-1 sm:p-2 rounded-xl border border-slate-700">
                            <span className="text-[10px] sm:text-xs text-slate-400 hidden xs:block">
                                {userInfo.name.split(' ')[0]}
                            </span>
                            
                            {userInfo.isAdmin && (
                                <Link to="/admin" className="text-[10px] bg-blue-600 px-2 py-1 rounded font-bold uppercase">
                                    Admin
                                </Link>
                            )}
                            
                            <button onClick={logoutHandler} className="text-[10px] text-red-400 font-bold uppercase px-1">
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </nav>
        );
    }


export default Navbar;  
