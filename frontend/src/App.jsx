import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import ProductDetail from './components/ProductDetail'

import Home from './pages/Home'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'

function App() {


  return (
    
    <Router>

      <Navbar />
      <main className='min-h-screen'>
      <Routes>
        {/* Si no hay userInfo, lo mandamos a /login.
            Si si hay, mostramos la home
        */}
        <Route 
        path='/' 
        element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />}/>
        <Route path='/admin' element={
          <ProtectedRoute isAdminRequired={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail/>} />

        {/* Si alguien escribe una ruta que no existe, lo mandamos a inicio */}
        <Route path='*' element={<Navigate to= "/" />} />
      </Routes>
      </main>
    </Router>
  );
}

export default App
