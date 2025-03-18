const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const { 
    createEnquiry, 
    deleteEnquiry, 
    getaEnquiry, 
    getallEnquiry, 
    updateEnquiry,
} = require ("../controller/enqCtrl.js");

const router = express.Router();

router.post("/create", authMiddleware, isAdmin,  createEnquiry);
router.get("/", authMiddleware, isAdmin, getallEnquiry);
router.put("/:id", authMiddleware, isAdmin,  updateEnquiry);
router.get("/:id", authMiddleware, isAdmin, getaEnquiry);
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);


module.exports = router;