import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ✅ CUSTOM STORAGE (FIX)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1]; // jpeg, png
    cb(null, Date.now() + "." + ext);
  },
});

const upload = multer({ storage }); // ✅ USE THIS

router.post("/verify", upload.single("aadhaarImage"), async (req, res) => {
  console.log("FILE:", req.file);
  console.log("BODY:", req.body);

  try {
    const { aadhaarNumber } = req.body;

    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      return res.json({
        success: false,
        message: "Invalid Aadhaar number"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File upload failed"
      });
    }

    res.json({
      success: true,
      message: "Aadhaar verified",
      filePath: req.file.path
    });

  } catch (err) {
    console.log("AADHAAR ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  if (!filename) {
    return res.status(400).send("Filename is required");
  }

  const safeFilename = path.basename(filename);
  const filepath = path.resolve("uploads", safeFilename);

  if (!fs.existsSync(filepath)) {
    return res.status(404).send("File not found");
  }

  res.download(filepath, safeFilename, (err) => {
    if (err) {
      console.error("Download Error:", err);
      if (!res.headersSent) {
        res.status(500).send("Error downloading file");
      }
    }
  });
});

export default router;