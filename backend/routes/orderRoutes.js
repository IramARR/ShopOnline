const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById } = require('../controller/orderController');
const { protect } = require('../middleware/authMiddleware');

//Solo usuarios logueados pueden crear ordenes
router.route('/').post(protect, addOrderItems);

//Solo usuarios logueados pueden ver detalles de ordenes
router.route('/:id').get(protect, getOrderById);

module.exports = router;