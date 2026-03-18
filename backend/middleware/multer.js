import multer from "multer";
import path from "path";

// ✅ Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder
  },
  filename: function (req, file, cb) {
    // ✅ Get extension safely
    const ext = file.mimetype.split("/")[1]; // jpeg, png, webp

    // ✅ Create filename with extension
    cb(null, Date.now() + "." + ext);
  },
});

// ✅ File filter (optional but recommended)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// ✅ Final upload object
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;