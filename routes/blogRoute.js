const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {createBlog, updateBlog, deleteBlog, getBlog, getAllBlogs, likeBlog, dislikeBlog,
  uploadImages
   } = require("../controller/blogCtrl");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.put(
    "/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 2),
    productImgResize,
    uploadImages,
    
  );
router.put('/:id', authMiddleware, isAdmin, updateBlog);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);
router.get('/:id', getBlog);
router.get('/', getAllBlogs);
router.put('/likes/:id', authMiddleware, likeBlog);
router.put('/dislikes/:id', authMiddleware, dislikeBlog);



module.exports= router;
