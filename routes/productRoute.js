const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
    createProduct,
    getaProduct,
    getAllproduct,
    updateProduct,
    deleteProduct,
    addWishlist,
    rating,
} = require("../controller/productCtrl");
const { uploadPhoto, resizeAndUploadImage } = require("../middlewares/uploadImages");

const router = express.Router();
router.post("/", authMiddleware, isAdmin, createProduct )
router.put("/uploadPhoto/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 5), resizeAndUploadImage, createProduct);
router.get("/:id", getaProduct);
router.get("/", getAllproduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.put("/wishlist/:id", authMiddleware, addWishlist); // Ensure this route is correctly defined
router.put("/rating/:id", authMiddleware, rating); // Ensure this route is correctly defined

module.exports = router;