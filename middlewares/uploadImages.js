const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;


const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "e-uploads",
    format: async () => "jpeg",
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};

const uploadPhoto = multer({
  storage,
  fileFilter: multerFilter,
  limits: { fileSize: 2000000, files: 5 }, // limit to 5 files, 2MB each
});

// Image Resizing Middleware (if needed after upload)
const resizeAndUploadImage = async (req, res, next) => {
  if (!req.files) return next();

  try {
    const urls = await Promise.all(
      req.files.map(async (file) => {
        if (!file.buffer) {
          throw new Error("File buffer is undefined");
        }

        // Resize the image using sharp
        const buffer = await sharp(file.buffer)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();

        // Upload the resized image to Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: "e-uploads",
              format: "jpeg",
              public_id: file.originalname.split(".")[0],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });

        return {
          url: uploadResponse.secure_url,
          public_id: uploadResponse.public_id,
        };
      })
    );

    req.body.images = urls.map(url => url.url); // Add the URLs to the request body
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadPhoto,
  resizeAndUploadImage,
};