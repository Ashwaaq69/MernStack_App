const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const Enquiry = require("../models/enqModel.js");

const createEnquiry = asyncHandler( async (req,res) => {

    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.json(newEnquiry);
    } catch (error) {
        throw new Error(error);
    }
});

const updateEnquiry = asyncHandler( async (req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);

    try {
        const updateC = await Enquiry.findByIdAndUpdate(
            id,
            req.body,
            {new:true});
        res.json(updateC)
    } catch (error) {
        throw new Error(error)
    }
});

const getaEnquiry = asyncHandler( async (req,res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
       const Enquiry = await Enquiry.findById(id);
       res.json(Enquiry);
    } catch (error) {
        throw new Error(error);
    }

});

 const getallEnquiry = asyncHandler(async (req,res) => {
    try {
        const Enquiry = await  Enquiry.find();
        res.json(Enquiry);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteEnquiry = asyncHandler( async (req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);

    try {
        const deleteB = await Enquiry.findByIdAndDelete(id);
        res.json(deleteB);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports ={createEnquiry,updateEnquiry, getaEnquiry, getallEnquiry, deleteEnquiry}


