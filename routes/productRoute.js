
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
  uploadImages,
  deleteImages
} = require("../controller/productCtrl");

const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);

// Fixed route with final handler
router.put(
  "/upload",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages,
  
);

router.get("/:id", getaProduct);
router.get("/", getAllproduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);
router.put("/wishlist", authMiddleware, addWishlist);
router.put("/rating/:id", authMiddleware, rating);

module.exports = router;