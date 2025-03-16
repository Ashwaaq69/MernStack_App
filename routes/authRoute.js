const express = require("express");
const{ createUser,
    loginUserCtrl,
    getallUser,
   getaUser,
deleteaUser,
updateaUser, 
blockUser,
unblockUser, 
handleRefreshToken,
logout,
updatePassword,
forgotPasswordToken,
resetPassword,
loginAdmin,
getWishlist,
saveUserAddress,
 userCart,
 getUserCart,
 emptyCart,
 applyCoupon,
 createOrder, 
getAllOrder, 
getSingleOrder, 
getRecentOrders, 
updateOrder, 
getOrderStatusEnum,
deleteOrder
} = require("../controller/userCtrl"); 

const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware"); 
const router = express.Router();

router.post("/register", createUser);
router.post("/create-order", authMiddleware, createOrder);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/login", loginUserCtrl); 
router.post("/login-admin", loginAdmin);
router.post("/cart", authMiddleware, userCart);
router.post("/cart/applyCoupon",authMiddleware,applyCoupon);

router.get("/all-users", getallUser)
router.get("/getcart", authMiddleware, getUserCart)
router.get("/refresh", handleRefreshToken)
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist )
router.get("/:id", authMiddleware, isAdmin, getaUser)
router.get("/order-status-enum", getOrderStatusEnum)
router.get("/all-orders", authMiddleware, isAdmin, getAllOrder)
router.get("/recent-orders", authMiddleware, getRecentOrders)
router.get("/order/:id", authMiddleware, getSingleOrder)

router.delete("/:id", deleteaUser)
// router.delete("/empty-cart/:id", authMiddleware, emptyCart);
router.delete("/empty-cart", authMiddleware , emptyCart);
router.delete("/order/:id", authMiddleware, deleteOrder)

router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);
router.put("/edit-user", authMiddleware, updateaUser)
router.put("/save-adress", authMiddleware, saveUserAddress )
router.put("/order/:id", authMiddleware, updateOrder)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)

module.exports = router;
