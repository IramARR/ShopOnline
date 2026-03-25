import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    // Estados para guardar lo que el usuario escribe
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault(); // Evita que la pagina se recargue sola
        try {
            const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            alert(`Bienvenido de nuevo, ${data.name}`);
            window.location.href = '/'; // Redirige al inicio
        } catch (error) {
            console.log("Status del error: ", error.response?.status);
            console.log("Mensaje del servidor:", error.response?.data?.message);
            
            alert(error.response?.data?.message || 'Error de conexion');
        }
    };

    return(
        <div className='min-h-screen flex items-center justify-center bg-slate-50 px-4'>
            {/* Tarjeta principal con sombra suave */}
            <div className='max-w-md w-full bg-white p-10 rounded-3xl shadow-lg border border-slate-100'>
                <h2 className='text-3xl font-black text-slate-900 mb-2 text-center'>Hola de nuevo!</h2>
                <p className='text-slate-500 text-center mb-6'>Ingresa a tu cuenta de TechShop</p>

                <form onSubmit={submitHandler} className='space-y-6'>
                    {/* Campo del Email */}
                    <div>
                        <label className='block text-sm font-bold text-slate-700 mb-2'>Correo Electronico</label>
                        <input 
                            type='email'
                            className='w-full px-5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-200 outline-none transition-all'
                            placeholder='ejemplo@correo.com'
                            onChange={(e) => setEmail(e.target.value)} // Guardamos el Email que escribe el usuario
                        />
                    </div>

                    {/* Campo del Contrasena */}
                    <div>
                        <label className='block text-sm font-bold text-slate-700 mb-2'>Contraseña</label>
                        <input 
                            type='password'
                            className='w-full px-5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-200 outline-none transition-all'
                            placeholder='*********'
                            onChange={(e) => setPassword(e.target.value)} // Guardamos la contrasena que escribe el usuario
                        />
                    </div>

                    {/* Campo del Contrasena */}
                    <button className='w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md'>
                        Iniciar Sesion
                    </button>

                    <div className='mt-6 text-center'>
                        <p className='text-slate-500'>
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="text-blue-600 font-bold hover:underline transition-all">
                                Crea una aqui
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;