const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "aladdin",
  },
});

const uploadMiddleware = multer({
  storage,
  //   limits: {
  //     fileSize: 100,
  //   },
  //   fileFilter: (_, file, next) => {
  //     console.log("next:", next);
  //     console.log("req:", file);
  //     next();
  //   },
});

module.exports = uploadMiddleware;
