import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [name, setName ] = useState('');
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        try{
            const { data } = await axios.post('http://localhost:5000/api/users/register', { name, email, password });
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
                    <button className='w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100'>
                        Registrarse
                    </button>
                </form>

            </div>

        </div>
    );

};

export default Register;