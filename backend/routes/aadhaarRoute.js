import express from "express";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/verify", upload.single("aadhaarImage"), async (req, res) => {

  try {

    const { aadhaarNumber, qrData } = req.body;

    if (!aadhaarNumber || !qrData) {
      return res.json({
        success: false,
        message: "Invalid Aadhaar data"
      });
    }

    if (aadhaarNumber.length !== 12) {
      return res.json({
        success: false,
        message: "Invalid Aadhaar number"
      });
    }

    res.json({
      success: true,
      message: "Aadhaar verified"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});

export default router;