const Order = require('../models/orderModel');

const sendEmail = require('../utils/sendEmails');

// @desc Crear nueva orden
// @route POST /api/orders
// @access Private

const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No hay productos en la orden'});
        return;
    }else{
        //Creamos la instancia de la orden con el modelo que acabamos de hacer
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x.product, // Mapeamos el ID del producto
                _id: undefined,
            })),
            user: req.user._id, // El ID viene en el token JWT
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

        // Enviar email de confirmación
        try {
            await sendEmail({
                email: req.user.email,
                subject: `Confirmación de pedido #${createdOrder._id}`,
                html:
                `
                    <h1>¡Gracias por tu compra, ${req.user.name}!</h1>
                    <p>Hemos recibido tu pedido con éxito.</p>
                    <p>ID de Orden: <strong>${createdOrder._id}</strong></p>
                    <p>Total pagado: <strong>$${createdOrder.totalPrice}</strong></p>
                    <br>
                    <p>En breve te enviaremos tu factura formal.</p>
                `,
            });
        } catch (error) {
            console.error('Error al enviar email de confirmación:', error);
        }
    }
};

// @desc Obtener orden por ID (Para la factura/detalles)
// @route GET /api/orders/:id
// @access Private

const getOrderById = async (req, res) => {
    // .populate('user', 'name email') trae el nombre y correo del usuario desde su ID
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if(order){
        res.json(order);
    }else{
        res.status(404).json({ message: 'Orden no encontrada' });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
};