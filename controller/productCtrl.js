const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const slugify = require("slugify");
const {cloudinaryUploadImage} = require ("../utils/cloudinary");

const createProduct = asyncHandler(async (req, res) => {
    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    try {
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// update product
const updateProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);

        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            req.body,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get product
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// get all products
const getAllproduct = asyncHandler(async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query.sort(sortBy);
        } else {
            query.sort('-createdAt');
        }

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query.select(fields);
        } else {
            query.select('-__v');
        }

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error('This page does not exist');
        }

        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

// add to wishlist
const addWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    validateMongoDbId(prodId); // Validate the product ID

    try {
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyAdded) {
            const updatedUser = await User.findByIdAndUpdate(
                _id,
                { $pull: { wishlist: prodId } },
                { new: true }
            );
            res.json(updatedUser);
        } else {
            const updatedUser = await User.findByIdAndUpdate(
                _id,
                { $push: { wishlist: prodId } },
                { new: true }
            );
            res.json(updatedUser);
        }
    } catch (error) {
        throw new Error(error);
    }
});

// product rating
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated },
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment },
                },
                {
                    new: true,
                }
            );
          
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id,
                        },
                    },
                },
                {
                    new: true,
                }
            );
            
        }
        const getallratings = await Product.findById(prodId);
      let totalRating = getallratings.ratings.length;
      let ratingsum = getallratings.ratings
        .map((item) => item.star)
        .reduce((prev, curr) => prev + curr, 0);
      let actualRating = Math.round(ratingsum / totalRating);
      let finalproduct = await Product.findByIdAndUpdate(
        prodId,
        {
          totalrating: actualRating,
        }, 
        {new: true}
    );
    res.json(finalproduct);

    } catch (error) {
        throw new Error(error);
    }
});

// const uploadImages = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     validateMongoDbId(id);

//     try {
//         const uploader = (path) => cloudinaryUploadImage(path, "images");
//         const urls = [];
//         const files = req.files;

//         for (const file of files) {
//             const { path } = file; // Extract path correctly
//             const newPath = await uploader(path);
//             urls.push(newPath);
//             console.log(file);
//             // fs.unlinkSync(path)
//         }

//         const findProduct = await Product.findByIdAndUpdate(
//             id,
//             { images: urls },
//             { new: true }
//         );

//         res.json(findProduct); // Correct variable name
//     } catch (error) {
//         res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
//     }
// });


const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const uploader = (path) => cloudinaryUploadImage(path, "images");
        const urls = [];

        for (const file of req.files) {
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
        }

        const findProduct = await Product.findByIdAndUpdate(
            id,
            { images: urls },
            { new: true }
        );

        res.json(findProduct);
    } catch (error) {
        res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
    }
});


module.exports = {
    createProduct,
    getaProduct,
    getAllproduct,
    updateProduct,
    deleteProduct,
    addWishlist,
    rating,
    uploadImages
};



