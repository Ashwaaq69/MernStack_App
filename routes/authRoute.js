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
saveUserAddress
} = require("../controller/userCtrl"); 

const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware"); 
const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);

router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl); 
router.post("/login-admin", loginAdmin);
router.get("/all-users", getallUser)
router.get("/refresh", handleRefreshToken)
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist )
router.get("/:id", authMiddleware, isAdmin, getaUser)
router.delete("/:id", deleteaUser)
router.put("/edit-user", authMiddleware, updateaUser)
router.put("/save-adress", authMiddleware, saveUserAddress )
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)

module.exports = router;
