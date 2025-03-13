const mongoose = require('mongoose');
const Blog = require("../models/blogModel"); 
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { cloudinaryUploadImage } = require("../utils/cloudinary");

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
        const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
        const updateViews = await Blog.findByIdAndUpdate(id, { $inc: { numViews: 1 } },
            { new: true });
        
        res.json(getBlog);
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
    // if (!blog) {
    //     return res.status(404).json({ message: "Blog not found" });
    // }

    // Find the logged-in user
    const loginUserId = req?.user?._id;
    
    // Check if the blog has been liked
    const isLiked = blog?.isLiked;
    
    // Check if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );

    if(alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
            $pull: { disLikes: loginUserId},
            isDisLiked:false,
        },{ new: true});
        res.json(blog);
    };
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
          blogId,
          {
            $pull: { likes: loginUserId },
            isLiked: false,
          },
          { new: true }
        );
        res.json(blog);
      } else {
        const blog = await Blog.findByIdAndUpdate(
          blogId,
          {
            $push: { likes: loginUserId },
            isLiked: true,
          },
          { new: true }
        );
        res.json(blog);
      }

})


// dislike blog 

const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId); // Validate the blogId
    
    // Find the blog which you want to be disliked
    const blog = await Blog.findById(blogId);
    
    // Check if blog exists
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }

    // Find the logged-in user
    const loginUserId = req?.user?._id;
    
    // Check if the blog has been disliked
    const isDisliked = blog?.isDisliked;
    
    // Check if the user has liked the blog
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );

    if (alreadyLiked) {
        // Remove like if user has already liked the blog
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.json(updatedBlog);
    }

    if (isDisliked) {
        // If the blog is already disliked, remove the dislike
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.json(updatedBlog);
    } else {
        // If not disliked yet, add a dislike
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { dislikes: loginUserId },
                isDisliked: true,
            },
            { new: true }
        );
        res.json(updatedBlog);
    }
});


const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const uploader = (path) => cloudinaryUploadImage(path, "images");
        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file; // Extract path correctly
            const newPath = await uploader(path);
            urls.push(newPath);
            console.log(file);
            // fs.unlinkSync(path)
        }

        const findBlog = await Blog.findByIdAndUpdate(
            id,
            { images: urls },
            { new: true }
        );

        res.json(findBlog);
    } catch (error) {
        res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
    }
});




module.exports = { createBlog, updateBlog, deleteBlog, getBlog, getAllBlogs, likeBlog, dislikeBlog,uploadImages };


