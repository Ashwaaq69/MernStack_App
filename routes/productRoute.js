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

const {  uploadPhoto, productImgResize } = require("../middlewares/uploadImages");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);

router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize
);


router.get("/:id", getaProduct);
router.get("/", getAllproduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.put("/wishlist/:id", authMiddleware, addWishlist);
router.put("/rating/:id", authMiddleware, rating);

module.exports = router;
