// Importamos el framework Express para crear el servidor y manejar las rutas
const express = require('express'); 
// Importamos CORS para permitir la conexion con REACT
const cors = require('cors');
// Cargamos las variables de entorno desde el archivo .env
require('dotenv').config();
// Importamos la función para conectar a la base de datos
const connectDB = require('./config/db');
// Importamos las rutas de productos
const productRoutes = require('./routes/productRoutes'); 

const userRoutes = require('./routes/userRoutes');

const cartRoutes = require('./routes/cartRoutes');

// Inicializamos la aplicación Express
const app = express();

// Conectamos a la base de datos MongoDB
connectDB();

// MIDDLEWARES
// Habilitamos CORS
//app.use(cors());

app.use(cors({
    origin: '*', // Reemplaza con la URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    credentials: true // Permite enviar cookies y credenciales en las solicitudes
}));


// Habilitamos el análisis de JSON en las solicitudes entrantes
app.use(express.json());
// Usamos las rutas de productos
app.use('/api/products', productRoutes);

app.use('/api/users', userRoutes);

app.use('/api/cart', cartRoutes);

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('El servidor de ShopOnline está funcionando correctamente.');
});

// Configuracion de puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor de ShopOnline escuchando en el puerto ${PORT}`);
});