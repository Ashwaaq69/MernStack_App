const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel"); 
const validateMongoDbId = require("../utils/validateMongodbId");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
    if(req.body.title){
        req.body.slug = slugify(req.body.title);

    }
    try {
        // Add product logic here
        const newProduct = await Product.create(req.body); 
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// update product
const updateProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; // ✅ Extracting id correctly

        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id }, // ✅ Correct MongoDB query
            req.body,
            { new: true } // ✅ Return the updated product
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
    const { id } = req.params; // ✅ Extracting id correctly

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
    const {id} = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct);

    } catch (error){
        throw new Error(error)
    }
})
// get all product
const getAllproduct = asyncHandler(async (req, res) => {
    try {

        // filtering
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]); // Remove excluded fields from the query object
        console.log(queryObj);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);


        let  query = Product.find(JSON.parse(queryStr));

        // sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query.sort(sortBy);
        } else {
            query.sort('-createdAt');
        }

        // limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query.select(fields);
        } else {
            query.select('-__v');
        }

        // pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error('This page does not exist');
        }

        // console.log(page, limit, skip)

         
        const product = await query;
        res.json(product);

    } catch (error){
        throw new Error(error)
    }
}); 


module.exports = { createProduct , getaProduct, getAllproduct, updateProduct, deleteProduct};