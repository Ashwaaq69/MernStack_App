const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const { 
    createCategory,
    deleteCategory,
    getacategory,
    getallcategory,
    updateCategory,
    
} = require("../controller/blogCatCtrl.js");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");

const Router = express.Router();


Router.put("/:id", authMiddleware, isAdmin, updateCategory);
Router.get("/:id", authMiddleware, isAdmin, getacategory);
Router.get("/", authMiddleware, isAdmin, getallcategory);
Router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = Router;