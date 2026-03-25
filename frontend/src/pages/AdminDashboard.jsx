import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);

    // 1. Cargar productos desde el Backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data);
            } catch (error) {
                console.error("Error cargando productos ", error);
            }
        };
        fetchProducts();
    }, []);

    const createProductHandler = async (e) => {
        e.preventDefault(); //Detiene la carga de la pagina

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            
            if(isEditing){
                //Logica para actualizar
                const { data } = await axios.put(`http://localhost:5000/api/products/${currentProductId}`, newProduct, config);
                //Actualizamos la lista localmente
                setProducts(products.map((p) => (p._id === currentProductId ? data : p)));
                alert('Producto actualizado con exito');
            }else{
                // Enviamos la peticion al servidor
                const { data } = await axios.post('http://localhost:5000/api/products', newProduct, config);
                
                // Si todo sale bien:
                setProducts([...products, data]); //Agregamos el nuevo a la tabla sin recargar
                setShowModal(false);
                alert('Nuevo producto agregado!');
                setNewProduct({
                    name: '',
                    price: 0,
                    category: '',
                    image: '',
                    description: '',
                    countInStock: 0
                });
            }
            
        } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            alert('Error al crear: ' + message);
            
        }
    }

    // Funcion provisional para borrar
    const deleteHandler = async (id) => {
        if( window.confirm("Estas seguro de eliminar este producto?")){
            try {
                // 1. Obtenemos el token del usuario logueado
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                // 2. Peiticion DELETE al servidor
                await axios.delete(`http://localhost:5000/api/products/${id}`,config);

                // 3. Actualizamos el estado local para que el producto desaparezca de la tabla sin recargar
                setProducts(products.filter((p) => p._id !== id));
                alert('Producto eliminado');
            } catch (error) {
                const message = error.response ? error.response.data.message : error.message;
                alert('Error al borrar: ' + message);
            }
        }
    };

    const editHandler = (product) => {
        setIsEditing(true);
        setCurrentProductId(product._id);
        console.log(product);
        // Llenamos el formulario con los datos acutales del producto
        setNewProduct({
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            description: product.description,
            countInStock: product.countInStock
        });
        setShowModal(true);
    };

    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: '',
        image: '',
        description: '',
        countInStock: 1
    });

    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    return(
        <div className='flex min-h-screen bg-slate-50 max-w-full overflow-x-hidden'>
            {/* Sidebar */}
            <div className='w-64 bg-slate-900 text-white p-6 hidden md:block'>
                <h2 className='text-2xl font-black mb-10 text-blue-400'>AdminPanel</h2>
                <nav className='space-y-4'> 
                    <a href="#" className='block py-2.5 px-4 rounded transition duration-200 bg-blue-600'>Productos</a>
                    <a href="#" className='block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-800 text-slate-400'>Usuarios</a>
                    <a href="#" className='block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-600 text-slate-400'>Ventas</a>
                </nav>
            </div>
            {/* Main content */}
            <div className='flex-1 min-w-0 p-4 sm:p-8'>
                <header className='flex justify-between items-center mb-10'>
                    <h1 className='text-3xl font-bold text-slate-800'>Gestion de inventarios</h1>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setNewProduct({ name: '', price: 0, category: '', image: '', description: '', countInStock: 0});
                            setShowModal(true);
                        }} //<- Abre el modal
                        className='bg-blue-600 text-white px-6 py-2 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all'>
                        + Nuevo Producto
                    </button>
                </header>
                {/* Apartamos la futura tabla de productos */}
                <div className='bg-white rounded-2xl shadow-sm border border-slate-200'>
                    <div className='overflow-x-auto w-full'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-slate-50 border-b border-slate-200'>
                            <tr>
                                <th className='px-6 py-4 text-sm font-semibold text-slate-600 uppercase'>ID</th>
                                <th className='px-6 py-4 text-sm font-semibold text-slate-600 uppercase'>Nombre</th>
                                <th className='px-6 py-4 text-sm font-semibold text-slate-600 uppercase'>Precio</th>
                                <th className='px-6 py-4 text-sm font-semibold text-slate-600 uppercase'>Categoria</th>
                                <th className='px-6 py-4 text-sm font-semibold text-slate-600 uppercase'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-100'>
                            {products.map((products) => (
                                <tr key={products._id} className='hover:bg-slate-50 transition-colors'>
                                    <td className='px-6 py-4 text-xs text-slate-500 font-mono'>{products._id.substring(0, 8)}...</td>
                                    <td className='px-6 py-4 font-medium text-slate-800'>{products.name}</td>
                                    <td className='px-6 py-4 text-slate-600'>${products.price}</td>
                                    <td className='px-6 py-4 text-slate-600'>{products.category}</td>
                                    <td className='px-6 py-4 flex justify-center gap-3'>
                                        <button 
                                        className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg'
                                        onClick={() => editHandler(products)}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => deleteHandler(products._id)}
                                            className='p-2 text-red-600 hover:bg-red-50 rounded-lg'
                                        >
                                            🗑️ Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    
                    {products.length === 0 && (
                        <div className='p-20 text-center text-slate-400'>
                            No hay productos registrados en la base de datos.
                        </div>
                    )}
                </div>
            </div>
            {showModal && (
                <div className='fixed inset-8 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50'>
                    <div className='bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl'>
                        <h2 className='text-2xl font-bold mb-6 text-slate-800'>
                            {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
                        </h2>
                        <form onSubmit={createProductHandler} className='space-y-4'>
                            <div>
                                {/* Input nombre */}
                                <label className='block text-sm font-medium text-slate-700'>Nombre</label>
                                <input
                                    type="text"
                                    value={newProduct.name} 
                                    className='w-full mt-1 p-2.5 border border-slate-200 rounded-2xl focus:ring-blue-500 outline-none'
                                    placeholder='Ej. Mouse Gamer Razer'
                                    onChange={(e) => setNewProduct({...newProduct,name: e.target.value})}
                                    />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    {/* Input precio */}
                                    <label className='block text-sm font-medium text-slate-700'>Precio ($)</label>
                                    <input
                                        type='number'
                                        value={newProduct.price}
                                        className='w-full mt-1 p-2.5 border border-slate-200 rounded-xl'
                                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                    />
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className='block text-sm font-medium text-slate-700'>Stock</label>
                                    <input
                                        value={newProduct.countInStock}
                                        type='number'
                                        className='w-full mt-1 p-2.5 border border-slate-200 rounded-xl'
                                        onChange={(e) => setNewProduct({...newProduct, countInStock: Number(e.target.value)})}
                                    />
                                </div>

                                <div className='col-span-2'>
                                    <label className='block text-sm font-medium text-slate-700 font-bold'>Categoria</label>
                                    <select 
                                        className='w-full mt-1 p-2.5 border border-slate-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-blue-500'
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                        required
                                    >
                                        <option value="">Selecciona una categoria...</option>
                                        <option value="Computadoras">Computadoras</option>
                                        <option value="Componentes">Componentes</option>
                                        <option value="Accesorios">Accesorios</option>
                                        <option value="Perifericos">Perifericos</option>
                                    </select>
                                </div>

                                {/* Descripcion */}
                                <div className='col-span-2'>
                                    <label className='block text-sm font-medium text-slate-700 font-bold'>Descripcion</label>
                                    <textarea 
                                        
                                        className='w-full mt-1 p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500'
                                        rows="3"
                                        placeholder='Describe las caracteristicas principales...'
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                        required
                                        >
                                    </textarea>
                                </div>

                                {/* Imagenes */}
                                <div>
                                    {/* Input image-link */}
                                    <label className='block text-sm font-medium text-slate-700'>URL de la imagen</label>
                                    <input
                                        type='text'
                                        value={newProduct.image}
                                        placeholder='http://...'
                                        className='w-full mt-1 p-2.5 border border-slate-200 rounded-xl'
                                        onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                                    />
                                </div>

                                <div className='flex gap-3 mt-8'>
                                    <button
                                        type='button'
                                        onClick={() => setShowModal(false)}
                                        className='flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-all'
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type='submit'
                                        className='flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all'
                                    >
                                        Guardar Producto
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;