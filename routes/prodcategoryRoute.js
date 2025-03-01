const express = require("express");
const {createCategory,
    updateCategory,
    getacategory,
    getallcategory,
    deleteCategory
} = require("../controller/prodcategoryCtrl");
const {authMiddleware, isAdmin} = require ("../middlewares/authMiddleware")

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin,  updateCategory);
router.get("/:id", authMiddleware, isAdmin, getacategory);
router.get("/", authMiddleware, isAdmin, getallcategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);


module.exports = router;