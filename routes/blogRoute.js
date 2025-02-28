const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {createBlog, updateBlog, deleteBlog, getBlog, getAllBlogs, likeBlog} = require("../controller/blogCtrl");
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/:id', authMiddleware, isAdmin, updateBlog);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);
router.get('/:id', getBlog);
router.get('/', getAllBlogs);
router.put('/likes/:id', authMiddleware, likeBlog);



module.exports= router;