const Brand = require("../models/brandModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId.js");

// create category
const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    } catch (error) {
        throw new Error(error);
    }
});

// update Brand
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const updateC = await Brand.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.json(updateC);
    } catch (error) {
        throw new Error(error);
    }
});

// get Brand
// const getaBrand = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     validateMongoDbId(id);

//     try {
//         const Brand = await Brand.findById(id);
//         res.json(Brand);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

const getaBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const brand = await Brand.findById(id); // Renamed variable to 'brand'
        res.json(brand);
    } catch (error) {
        throw new Error(error);
    }
});
// get all categories
const getallBrand = asyncHandler(async (req, res) => {
    try {
        const categories = await Brand.find();
        res.json(categories);
    } catch (error) {
        throw new Error(error);
    }
});

// delete Brand
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deleteC = await Brand.findByIdAndDelete(id);
        res.json(deleteC);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createBrand, updateBrand, getaBrand, getallBrand, deleteBrand };