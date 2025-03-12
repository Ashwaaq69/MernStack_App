// const multer = require("multer");
// // const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const sharp = require("sharp");
// const path = require("path");
// const { promises } = require("fs");
// // const cloudinary = require("cloudinary").v2;

// const multerStorage = multer.diskStorage({
//   destination: function(req, file, cb){
//     cb(null, path.join(__dirname, "../public//images"));
//   },
//   filename: function(req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg")''

//   }

// });

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(
//       {
//       message:"Unsupported file format", 
//   },
//   false
// );
// }
// };

// const uploadPhoto = multer({
//   storage : multerStorage,
//   fileFilter: multerFilter,
//   limits: { fileSize: 2000000}, // limit to 5 files, 2MB each
// });


// const productImgResize = async (req, res, next) => {
//   if (!req.file) return next();
//   await promise.all(
//     req.files.map(async (file) => {
//       await sharp(file.path).resize(300, 300).toFormat("jpeg").jpeg({ quality: 90 }).toFile(`public/images/products/${file.filename}`);

//     })
//   );
//   next();
// };
  
// const blogImgResize = async (req, res, next) => {
//   if (!req.file) return next();
//   await promise.all(
//     req.files.map(async (file) => {
//       await sharp(file.path).resize(300, 300).toFormat("jpeg").jpeg({ quality: 90 }).toFile(`public/images/blogs/${file.filename}`);

//     })
//   );
//   next();
// };



// module.exports = {
//   uploadPhoto,
//   productImgResize,
//   blogImgResize,
  
// };


const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const { promises } = require("fs");

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

// Image Resizing Middleware
const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
    })
  );
  next();
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
