const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cartItems: [
        {
        name: { type: String, required: true },
        qty: { type: Number, required: true, default: 1},
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);