const express = require('express');
const { createProduct, getaProduct, getAllproduct, updateProduct, deleteProduct} = require('../controller/productCtrl');
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware,isAdmin,  createProduct);
router.get('/:id', getaProduct);  // Get a products

router.put('/:id', authMiddleware, isAdmin, updateProduct);  // Update a product
router.delete('/:id', authMiddleware, isAdmin,  deleteProduct);  // Delete a product
router.get('/', getAllproduct);  // Get all products


module.exports = router;