const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require("../models/userModel"); // Import User model

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];

        try {
            if (token) {
                // Verify Token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Fetch user from DB
                const user = await User.findById(decoded?.id); 
                
                if (!user) {
                    res.status(401);
                    throw new Error("User not found");
                }

                req.user = user;
                next();
            }
        } catch (error) {

            res.status(401);
            throw new Error("Not Authorized, token expired, please login again");
        }
    } else {
        res.status(401);
        throw new Error("There is no token attached to the header");
    }
});

// check if is Admin
const isAdmin =  asyncHandler(async (req, res, next)=>{
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if(adminUser.role !== "admin"){
        res.status(401);
        throw new Error("you are not an admin")
        
    }else{
        next();
    }
    
    // next();

 });
module.exports = { authMiddleware, isAdmin};
