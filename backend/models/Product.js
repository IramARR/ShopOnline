const mongoose = require('mongoose');

// Definimos la estructura de un producto en la base de datos
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nombre del producto
    price: { type: Number, required: true }, // Precio del producto
    description: { type: String }, // Descripción del producto
    image: { type: String }, // URL de la imagen del producto
    category: { type: String }, // Categoría del producto
    countInStock: { type: Number, default: 0 } // Cantidad disponible en stock
}, {
    timestamps: true // Agrega campos de fecha de creación y actualización automáticamente
});

// Exportamos el modelo para usarlo en otras partes de la aplicación
module.exports = mongoose.model('Product', ProductSchema);