const multer = require("multer");
const path = require("path");

// Set up where to store the files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    // Create a unique filename to prevent overwrites
    // e.g., "1678886400000-mypayment.png"
    const uniqueSuffix = Date.now() + "-" + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// Filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
});

module.exports = upload;
