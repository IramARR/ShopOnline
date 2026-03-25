const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // Obtenemos todos los productos de la base de datos
        res.json(products); // Enviamos los productos como respuesta en formato JSON
    } catch (error) {
        console.error(`Error al obtener productos: ${error.message}`);
        res.status(500).json({ message: 'Error al obtener productos' }); // Enviamos un error si algo sale mal
    }
});

router.get('/:id', async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Error al buscar el producto"});
        
    }
});

// Crear un producto
// PORT/api/products
router.post('/', protect, admin, async (req, res) => {
    try {
        const { name, price, description, image, category, countInStock } = req.body; // Obtenemos los datos del producto desde el cuerpo de la solicitud
        const newProduct = new Product({ name, price, description, image, category, countInStock, numReviews:0, user: req.user._id, }); // Creamos una nueva instancia del modelo Product
        const savedProduct = await newProduct.save(); // Guardamos el producto en la base de datos
        res.status(201).json(savedProduct); // Enviamos el producto guardado como respuesta con un código de estado 201 (Creado)
    } catch (error) {
        console.error(`Error al crear producto: ${error.message}`);
        res.status(400).json({ message: 'Error al crear producto' }); // Enviamos un error si algo sale mal
    }
});

router.delete('/:id', protect ,async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            await product.deleteOne();
            res.json({ message: 'Producto eliminado correctamente' });
        }else{
            res.status(400).json({ message: 'Producto no encontrado' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { name, price, description, image, category, countInStock} = req.body;
        const product = await Product.findById(req.params.id);
        if(product){
            //Actualizamos los campos con lo que viene el frontend
            //Si algun cambio no viene, dejamos el que ya estaba
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.category = category || product.category;
            product.countInStock = countInStock || product.countInStock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }else{
            res.status(404).json({ message: 'Producto no encontrado '});
        }
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar:  ' + error.message});
    }
})
module.exports = router;