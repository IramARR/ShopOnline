const express = require('express');
const router = express.Router();
const { saveCart, getCart } = require('../controller/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, saveCart).get(protect, getCart);

module.exports = router;