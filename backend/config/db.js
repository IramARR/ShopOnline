const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Conectamos a MongoDB usando la URI de conexión definida en las variables de entorno
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error al conectar a MongoDB: ${error.message}`);
        process.exit(1); // Salimos del proceso con un código de error
    }
};

module.exports = connectDB;