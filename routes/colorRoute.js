const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const { 
    createColor, 
    deleteColor, 
    getaColor, 
    getallColor, 
    updateColor,
} = require ("../controller/colorCtrl.js");

const router = express.Router();

router.post("/create", authMiddleware, isAdmin,  createColor);
router.get("/", authMiddleware, isAdmin, getallColor);
router.put("/:id", authMiddleware, isAdmin,  updateColor);
router.get("/:id", authMiddleware, isAdmin, getaColor);
router.delete("/:id", authMiddleware, isAdmin, deleteColor);


module.exports = router;