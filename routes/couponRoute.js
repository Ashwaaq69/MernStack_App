const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const { 
    createCoupon,
    updateCoupon,
    getallcoupon,
    getacoupon,
    deletecoupon
} = require("../controller/couponCtrl.js");

const Router = express.Router();

Router.post("/", authMiddleware, isAdmin, createCoupon);

Router.put("/:id", authMiddleware, isAdmin, updateCoupon);
Router.get("/:id", authMiddleware, getacoupon);
Router.get("/", authMiddleware, isAdmin, getallcoupon);

Router.delete("/:id", authMiddleware, isAdmin, deletecoupon);

module.exports = Router;