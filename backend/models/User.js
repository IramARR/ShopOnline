const mongoose = require('mongoose');  // Actua como puente entre JS y la base de datos MongoDB
const bcrypt = require('bcryptjs'); //Se encarga del hashing de contrasenas

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    isAdmin: { type: Boolean, default: false},
    // Campos adicionales para direccion de envio
    shippingAddress: {
        address: { type: String },
        city: { type: String },
        postalCode: { type: String },
        country: { type: String },
        location: {
            lat: { type: Number },
            lng: { type: Number }
        }
    }
}, { timestamps: true }); // <-- Indica cuando se creo y modifico

// Metodo para encriptar antes de guardar
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

module.exports = mongoose.model('User', userSchema);