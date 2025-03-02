const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const { 
    createBrand,
    deleteBrand,
    getaBrand,
    getallBrand,
    updateBrand 
} = require("../controller/brandCtrl.js");

const Router = express.Router();

Router.post("/", authMiddleware, isAdmin, createBrand);
Router.put("/:id", authMiddleware, isAdmin, updateBrand);
Router.get("/:id", authMiddleware, isAdmin, getaBrand);
Router.get("/", authMiddleware, isAdmin, getallBrand);
Router.delete("/:id", authMiddleware, isAdmin, deleteBrand);

module.exports = Router;