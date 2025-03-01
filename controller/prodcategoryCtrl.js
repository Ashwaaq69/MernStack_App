const Category = require("../models/prodcategoryModel.js"); // Corrected import statement
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId.js");

// create category
const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
});

// update category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const updateC = await Category.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.json(updateC);
    } catch (error) {
        throw new Error(error);
    }
});

// get category
const getacategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const category = await Category.findById(id);
        res.json(category);
    } catch (error) {
        throw new Error(error);
    }
});

// get all category
const getallcategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.find();
        res.json(category);
    } catch (error) {
        throw new Error(error);
    }
});

// delete category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deleteC = await Category.findByIdAndDelete(id);
        res.json(deleteC);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createCategory, updateCategory, getacategory, getallcategory, deleteCategory };