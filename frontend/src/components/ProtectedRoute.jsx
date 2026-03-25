import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdminRequired }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    //1. Si no esta logueado, mandarlo al login
    if(!userInfo) {
        return <Navigate to="/login" />
    }

    //2. Si la ruta es de admin pero el usuario no es admin, al inicio
    if(!isAdminRequired && !userInfo.isAdmin) {
        return <Navigate to="/" />
    }

    return children;
};

export default ProtectedRoute;