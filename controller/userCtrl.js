const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel')
const asyncHandler = require("express-async-handler");
const { generateToken } = require('../config/jwtToken');
const ValidateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl")
const crypto = require('crypto');


// create user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email });

    if (!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("User already exists");
    }
});

// login user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = generateRefreshToken(findUser._id);
        await User.findByIdAndUpdate(findUser._id, { refreshToken }, { new: true });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });

        res.json({
            _id: findUser._id,
            firstname: findUser.firstname,
            lastname: findUser.lastname,
            email: findUser.email,
            mobile: findUser.mobile,
            token: generateToken(findUser._id),
        });
    } else {
        throw new Error('Invalid credentials');
    }
});

//login admin 
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const findAdmin = await User.findOne({ email });
        if (!findAdmin) return res.status(400).json({ message: "Invalid Email please provide a valid email" });
        if (findAdmin.role !== 'admin') return res.status(401).json({ message: "Unauthorized" });

        const isCorrectPassword = await findAdmin.isPasswordMatched(password);
        if (!isCorrectPassword) return res.status(400).json({ message: "Incorrect password" });

        const refreshToken = await generateRefreshToken(findAdmin._id);
        const updateUser = await User.findByIdAndUpdate(findAdmin.id, {
            refreshToken: refreshToken,
        }, {
            new: true
        });
        updateUser.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        res.json({
            _id: findAdmin._id,
            firstname: findAdmin.firstname,
            lastname: findAdmin.lastname,
            email: findAdmin.email,
            mobile: findAdmin.mobile,
            token: generateToken(findAdmin._id),
            refreshToken: refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) throw new Error('No Refresh Token in cookies');
    
    const refreshToken = cookies.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) throw new Error('No refresh token present in DB or not matched');

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user._id.toString() !== decoded.id) {
            throw new Error('There is something wrong with the refresh token');
        }
        const accessToken = generateToken(user._id);
        res.json({ accessToken });
    });
});

// logout functionality
const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) throw new Error("No Refresh Token in cookies");

    const refreshToken = cookies.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) {
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });
        return res.sendStatus(204);
    }

    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.sendStatus(204);
});

// update a user
const updateaUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    ValidateMongoDbId(_id);

    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            mobile: req.body.mobile,
        }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});

// save address user
const saveUserAddress = asyncHandler(async (req,res, next) => {
    const {id} = req.user;
    ValidateMongoDbId(id);
    try {
        const updateuser = await User.findByIdAndUpdate(id, {
            address: req?.body.address,
        },{
            new:true,
        })
    
        res.json(updateuser)
    } catch (error) {
        throw new Error(error)
    }
})

// Get all users
const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

// get a single user
const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    ValidateMongoDbId(id);

    try {
        const user = await User.findById(id);
        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});

// delete a user
const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    ValidateMongoDbId(id);

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.json(deletedUser);
    } catch (error) {
        throw new Error(error);
    }
});

// block user
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    ValidateMongoDbId(id);

    try {
        const blockedUser = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        res.json(blockedUser);
    } catch (error) {
        throw new Error(error);
    }
});

// unblock user
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    ValidateMongoDbId(id);

    try {
        const unblockedUser = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        res.json(unblockedUser);
    } catch (error) {
        throw new Error(error);
    }
});

// update password
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    ValidateMongoDbId(_id);
    
    const user = await User.findById(_id);
    if (req.body.password) {
        user.password = req.body.password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
});

// generate token
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found with this email");
    }

    try {
        const token = user.createPasswordResetToken(); // Call the method
        await user.save();

        const resetURL = `Hi, please follow this link to reset your password. This link is valid for 10 minutes: 
        <a href='http://localhost:5000/api/user/reset-password/${token}'>Click here</a>`;

        const data = {
            to: email,
            subject: "Forgot Password Link",
            html: resetURL,  // Fix `htm` to `html`
            text: resetURL,
        };

        sendEmail(data);
        res.json({ message: "Password reset email sent!", token });
    } catch (error) {
        throw new Error(error);
    }
});

// reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token expired, please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

// get wishlist

const getWishlist = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    // console.log("User ID from req.user:", _id);
    // ValidateMongoDbId(_id);

    try {
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser);
    } catch (error) {
        throw new Error(error)
    }
});

// user cart

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const {_id} = req.user;
  ValidateMongoDbId(_id);

  try {
    let products = [];
    const user = await User.findById(_id);

    // Check if user already has a cart and delete it
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      await alreadyExistCart.deleteOne();
    }

    const productIds = new Set();

    for (let i = 0; i < cart.length; i++) {
      let product = await Product.findById(cart[i]._id);
      if (!product) continue; // Skip if the product doesn't exist

      // Check if the product count is 0
      if (cart[i].count === 0) {
        return res.status(400).json({ message: 'Product count cannot be zero'});
      }

      // Check if the product quantity is less than the requested count
      if (product.quantity < cart[i].count) {
        return res.status(400).json({ message: 'out of stock'});
      }

      // Check if the product is already in the cart
      if (productIds.has(cart[i]._id)) continue;
      productIds.add(cart[i]._id);

      let object = {
        product,
        count: cart[i].count,
        color: cart[i].color,
        price: product.price,
      };

      products.push(object);
    }

    if (products.length === 0) {
      return res.status(400).json({ message: 'No valid products to add to the cart' });
    }

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }

    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user._id,
    }).save();

    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

// get user cart
const getUserCart = asyncHandler( async (req,res) => {
    const { _id } = req.user;
     ValidateMongoDbId(_id);

    try {
        const cart = await Cart.findOne({orderby: _id}).populate("products.product");
        if(!cart){
          return res.status(400).json({ message: 'Your cart is empty' });
        }
        res.json(cart);
        
    } catch (error) {
        throw new Error(error)
    }
});

const emptyCart = asyncHandler(async (req,res) => {
    const {_id} = req.user;

    try {
        const user = await User.findById(_id);
        const cart = await Cart.findOneAndDelete({orderby: user._id});
        res.json(cart);
    } catch (error) {
        throw new Error(error)
    }
});

const applyCoupon = asyncHandler( async (req,res) => {
    const { coupon } = req.body;
    const {_id} = req.user;
    ValidateMongoDbId(_id)
    const validCoupon = await Coupon.findOne({name: coupon});
    if(validCoupon == null){
        throw new Error("invalid coupon")
    }
    
   // Check if the coupon has expired
   const currentDate = new Date();
   if (validCoupon.expiry < currentDate) {
       throw new Error("Coupon has expired");
   }

   // Check if the coupon usage limit has been reached
   if (validCoupon.used >= validCoupon.limit) {
       throw new Error("Coupon usage limit has been reached");
   }

   // Check if the user has already used this coupon
   if (validCoupon.usedBy.includes(_id)) {
    throw new Error("You have already used this coupon");
}

    const user = await User.findOne({_id});
    let {cartTotal} = await Cart.findOne({orderby: user._id})
    .populate("products.product");
    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
    // Update the coupon usage count
    await Coupon.findOneAndUpdate({ name: coupon }, { $inc: { used: 1 }, $push: { usedBy: _id } });

    await Cart.findOneAndUpdate({orderby: user._id},{totalAfterDiscount},{new:true});

    res.json(totalAfterDiscount);
});



module.exports = {
    createUser,
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
};
