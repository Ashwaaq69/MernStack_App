const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
    createProduct,
    getaProduct,
    getAllproduct,
    updateProduct,
    deleteProduct,
    addWishlist
} = require("../controller/productCtrl");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", getaProduct);
router.get("/", getAllproduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.put("/wishlist", authMiddleware, addWishlist); // Ensure this route is correctly defined

module.exports = router;