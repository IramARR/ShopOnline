import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react"; // Importa useState y useEffect para manejar el estado y los efectos secundarios
import axios from "axios"; // Importa axios para hacer solicitudes HTTP

const Home = () => {
    // 1. Creamos un estado para guardar los productos
    const [products, setProducts] = useState([]);

    //Filtrado de productos por categoria
    const [filteredProducts, setFilteredProducts] = useState([]); // El que mostraremos
    const [category, setCategory] = useState('Todos'); // Categoria seleccionada, por defecto 'Todos'

    //Busqueda de productos
    const [searchTerm, setSearchTerm] = useState(''); // El termino de busqueda que el usuario ingresa

    // 2. Estado opcional para saber si estamos cargando los productos
    const [loading, setLoading] = useState(true);

    // 3. Usamos useEffect para cargar los productos cuando el componente se monta
    useEffect(() => {
        // Simular una llamada a la API
        const fetchProducts = async () => {
            try {
                // Hacemos peticion al servidor local
                const res = await axios.get('http://localhost:5000/api/products');
                // Guardamos los productos en el estado
                setProducts(res.data);
                setFilteredProducts(res.data); // Inicialmente mostramos todos los productos
                setLoading(false); // Ya no estamos cargando
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false); // También detenemos la carga en caso de error
            }
        };

        fetchProducts();
    }, []); // El array vacío [] hace que este efecto solo se ejecute una vez al montar el componente

    // Logica de filtrado combinada con la busqueda
    const filterProducts = products.filter(product => {
        // 1. Filtrar por categoria
        const categoryMatch = category === 'Todos' || product.category === category;
        // 2. Filtrar por busqueda (buscamos en el nombre del producto, ignorando mayusculas)
        const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        // El producto se muestra solo si cumple ambos criterios
        return categoryMatch && searchMatch;
    });

    // 4. Si estamos cargando, mostramos un mensaje de carga
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <h1 className="text-2xl font-bold text-slate-600 animate-pulse">Cargando productos...</h1>
            </div>
        );
    }

    return (
        <>
            {/* Seccion de busqueda y filtros */}
            <div className="bg-white border-b border-slate-200 sticky top-20 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/**Contenedor del input de busqueda */}
                    <div className="relative max-w-md mx-auto mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Buscar productos..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                        />
                    </div>
            {/* Botones de filtro */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {['Todos', 'Computadoras', 'Componentes', 'Accesorios', 'Consolas'].map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold translate-all duration delay-200
                                    ${category === cat
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            

            {/* Grilla de productos */}
            <div className="max-w-7xl mx-auto px-4 mt-10">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filterProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-xl text-slate-400 font-medium">No encontramos productos que coincidan...</h3>
                    </div>
                )}
            </div>
        </>
    );
};


export default Home;