const mongoose = require('mongoose');
const Blog = require("../models/blogModel"); 
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create blog
const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update blog
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get blog
const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const blog = await Blog.findByIdAndUpdate(id, { $inc: { numViews: 1 } }, { new: true });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all blogs
const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete blog
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(deletedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Like blog
const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId); // Validate the blogId
    
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    
    // Check if blog exists
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }

    // Find the logged-in user
    const loginUserId = req?.user?._id;
    
    // Check if the blog has been liked
    const isLiked = blog?.isLiked;
    
    // Check if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(userId => userId.toString() === loginUserId.toString());

    if (alreadyDisliked) {
        // Remove dislike if user has already disliked the blog
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, {
            new: true
        });
        return res.json(updatedBlog);  // Return the updated blog
    }

    if (isLiked) {
        // If the blog is already liked, remove the like
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, {
            new: true
        });
        return res.json(updatedBlog);  // Return the updated blog
    } else {
        // If not liked yet, add a like
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true
        }, {
            new: true
        });
        return res.json(updatedBlog);  // Return the updated blog
    }
});

module.exports = { createBlog, updateBlog, deleteBlog, getBlog, getAllBlogs, likeBlog };