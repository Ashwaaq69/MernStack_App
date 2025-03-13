

const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const { promises} = require("fs");
const fs = require ("fs")

// Multer Storage
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

// Multer File Filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

// Multer Upload Config
const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2000000 }, // 2MB file limit
});


const productImgResize = async (req, res, next) => {
  if (!req.files) return next(); // Skip if no files

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const outputPath = `public/images/products/${file.filename}`;

        // Resize and save the image
        await sharp(file.path)
          .resize(300, 300)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(outputPath);

        // Delete the original file after processing
        fs.unlinkSync(file.path); // ✅ Ensure old file is deleted inside the loop
      })
    );

    next(); // Pass control to the next middleware
  } catch (error) {
    console.error('Error processing images:', error);
    res.status(500).send('Error processing images');
  }
};

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/blogs/${file.filename}`);
    })
  );
  next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };
