const mongoose = require('mongoose');
const Blog = require("../models/blogModal");
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
// const likeBlog = asyncHandler(async (req, res) => {
//     const { blogId } = req.body;
//     validateMongoDbId(blogId);
    
//     // find the blog which you want to be liked
//     const blog = await Blog.findById(blogId);
    
//     // find the login user
//     const loginUserId = req?.user?._id;
    
//     // find if the user has liked the blog
//     const isLiked = blog?.isLiked;
    
//     // find if the user has disliked the blog
//     const alreadyDisliked = blog?.dislikes?.find(userId => userId.toString() === loginUserId.toString());

//     if (alreadyDisliked) {
//         const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
//             $pull: { dislikes: loginUserId },
//             isDisliked: false
//         }, { new: true });
//         return res.json(updatedBlog);
//     }

//     if (isLiked) {
//         const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
//             $pull: { likes: loginUserId },
//             isLiked: false
//         }, { new: true });
//         return res.json(updatedBlog);
//     } 

//     const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
//         $push: { likes: loginUserId },
//         isLiked: true
//     }, { new: true });

//     res.json(updatedBlog);
// }); 

const likeBlog = asyncHandler(async (req, res) => {
    const { postId } = req.body;  // Ensure you are using the correct key
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
    }
    
    validateMongoDbId(postId);  // This should not throw an error if ID is valid

    const blog = await Blog.findById(postId);
    if (!blog) {
        return res.status(404).json({ message: "Blog post not found" });
    }

    const loginUserId = req?.user?._id;
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes?.find(userId => userId.toString() === loginUserId.toString());

    if (alreadyDisliked) {
        await Blog.findByIdAndUpdate(postId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, { new: true });
    }

    if (isLiked) {
        await Blog.findByIdAndUpdate(postId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, { new: true });
    } else {
        await Blog.findByIdAndUpdate(postId, {
            $push: { likes: loginUserId },
            isLiked: true
        }, { new: true });
    }

    res.json({ message: "Blog like status updated successfully" });
});


module.exports = { createBlog, updateBlog, deleteBlog, getBlog, getAllBlogs, likeBlog };