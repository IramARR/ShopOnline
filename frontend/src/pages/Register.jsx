import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [name, setName ] = useState('');
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');

    const [addressData, setAddressData] = useState({
        address: '', city: '', postalCode: '', country: ''
    });
    const [showManualInputs, setShowManualInputs] = useState(false);

    const [loading, setLoading] = useState(false);

    const getLocation = () => {
        setLoading(true);
        if(!navigator.geolocation){
            alert('Geolocalizacion no es soportada por tu navegador');
            setShowManualInputs(true);
            setLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Llamada a una API para convertir coordenadas a texto
                    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`);
                    const data = await res.json();
                    setAddressData({
                        address: data.locality || '',
                        city: data.city || '',
                        postalCode: data.postcode || '',
                        country: data.countryName || ''
                    });
                    setShowManualInputs(true); //Mostramos los campos ya rellenos para que confirme
                } catch (error) {
                    alert('No se pudo obtener tu ubicacion, por favor ingresa tu direccion manualmente');
                    console.log('Error al obtener direccion', error);
                    setShowManualInputs(true);
                }finally{
                    setLoading(false);
                }
            },
            (error) => {
                console.log('Error al obtener ubicacion', error);
                alert('No se pudo obtener tu ubicacion, por favor ingresa tu direccion manualmente');
                setShowManualInputs(true);
                setLoading(false);
            }
        );
    };


    const submitHandler = async (e) => {
        e.preventDefault();
        try{
            const { data } = await axios.post('http://localhost:5000/api/users/register', { name, email, password, shippingAddress: addressData });
            console.log("Respuesta exitosa del servidor", data);
            //Guardamos la sesion automaticamente al registrarse
            localStorage.setItem('userInfo', JSON.stringify(data));
            alert('Cuenta creada con exito');
            window.location.href = '/';
        }catch (error){
            console.log('Error detallado', error.response ? error.response.data : error.message);
            alert(error.response.data.message || 'Error al registrarse');
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-slate-50 px-4'>
            <div className='max-w-md w-full bg-white p-10 rounded-3xl shadow-lg border border-slate-100'>
                <h2 className='text-3xl font-black text-slate-900 mb-2 text-center'>Crea tu cuenta</h2>
                <p className='text-slate-500 text-center mb-8'>Unete a la comunidad de TechShop</p>

                <form onSubmit={submitHandler} className='space-y-5'>
                    {/* Nombre */}
                    <div>
                        <label className='block text-sm font-bold text-slate-700 mb-1'>Nombre Completo</label>
                        <input 
                            type="text"
                            className='w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none'
                            placeholder='Nombre ...'
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label className='block text-sm font-bold text-slate-700 mb-1'>Correo Electronico</label>
                        <input 
                            type="email"
                            className='w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none'
                            placeholder='Usuario@correo.com'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {/* Password */}
                    <div>
                        <label className='block text-sm font-bold text-slate-700 mb-1'>Contraseña</label>
                        <input 
                            type="password"
                            className='w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none'
                            placeholder='*******'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {/* Seccion de direccion */}
                    <div className = "space-y-4">
                        <button
                            type="button"
                            onClick={getLocation}
                            className='bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition'
                        >
                            {loading ? 'Obteniendo ubicacion...' : 'Usar mi ubicacion actual'}
                        </button>

                        {showManualInputs && (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-fade-in text-left'>
                                {/* Calle y direccion */}
                                <div className='flex flex-col'>
                                    <label className='text-xs font-bold text-slate-500 ml-2 mb-1'>Calle y Numero</label>
                                    <input 
                                        type="text"
                                        placeholder='Ej. Av. Universidad 123' 
                                        /* value={addressData.address} */
                                        onChange={(e) => setAddressData({...addressData, address: e.target.value})}
                                        className='p-3 border rounded-xl outline-none focus:border-blue-500' 
                                    />
                                </div>
                                {/* Ciudad */}
                                <div className='flex flex-col'>
                                    <label className='text-xs font-bold text-slate-500 ml-2 mb-1'>Ciudad</label>
                                    <input 
                                        type="text"
                                        placeholder='Ciudad' 
                                        value={addressData.city}
                                        onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                                        className='p-3 border rounded-xl outline-none focus:border-blue-500' 
                                    />
                                </div>
                                {/* Codigo Postal */}
                                <div className='flex flex-col'>
                                    <label className='text-xs font-bold text-slate-500 ml-2 mb-1'>Codigo Postal</label>
                                    <input 
                                        type="text"
                                        placeholder='Codigo Postal' 
                                        value={addressData.postalCode}
                                        onChange={(e) => setAddressData({...addressData, postalCode: e.target.value})}
                                        className='p-3 border rounded-xl outline-none focus:border-blue-500' 
                                    />
                                </div>
                                {/* Pais */}
                                <div className='flex flex-col'>
                                    <label className='text-xs font-bold text-slate-500 ml-2 mb-1'>Pais</label>
                                    <input 
                                        type="text"
                                        placeholder='Pais' 
                                        value={addressData.country}
                                        onChange={(e) => setAddressData({...addressData, country: e.target.value})}
                                        className='p-3 border rounded-xl outline-none focus:border-blue-500' 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <button className='w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100'>
                        Registrarse
                    </button>
                </form>

            </div>

        </div>
        );
    };


export default Register;