const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const Color = require("../models/colorModel.js");

const createColor = asyncHandler( async (req,res) => {

    try {
        const newColor = await Color.create(req.body);
        res.json(newColor);
    } catch (error) {
        throw new Error(error);
    }
});

const updateColor = asyncHandler( async (req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);

    try {
        const updateC = await Color.findByIdAndUpdate(
            id,
            req.body,
            {new:true});
        res.json(updateC)
    } catch (error) {
        throw new Error(error)
    }
});

const getaColor = asyncHandler( async (req,res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
       const color = await Color.findById(id);
       res.json(color);
    } catch (error) {
        throw new Error(error);
    }

});

 const getallColor = asyncHandler(async (req,res) => {
    try {
        const color = await  Color.find();
        res.json(color);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteColor = asyncHandler( async (req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);

    try {
        const deleteB = await Color.findByIdAndDelete(id);
        res.json(deleteB);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports ={createColor,updateColor, getaColor, getallColor, deleteColor}


