import React, { useState } from "react";
import Tesseract from "tesseract.js";
import jsQR from "jsqr";

const AadhaarUpload = ({ onVerified, onUploadStart }) => {

  const [isValidating, setIsValidating] = useState(false);
  const [verified, setVerified] = useState(false);

  const isValidAadhaar = (aadhaar) => {
    return /^\d{12}$/.test(aadhaar);
  };

  const handleUpload = async (e) => {

    if (onUploadStart) {
      onUploadStart(); // reset parent verification
    }

    const file = e.target.files[0];
    if (!file) return;

    setVerified(false);

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }

    setIsValidating(true);

    try {

      // OCR
      const { data: { text } } = await Tesseract.recognize(file, "eng");

      const lowerText = text.toLowerCase();

      const hasAadhaarKeyword =
        lowerText.includes("aadhaar") ||
        lowerText.includes("government of india") ||
        lowerText.includes("govt of india") ||
        lowerText.includes("unique identification authority") ||
        lowerText.includes("uidai");

      const aadhaarMatch =
        text.match(/\b\d{4}\s\d{4}\s\d{4}\b|\b\d{12}\b/);

      if (!hasAadhaarKeyword || !aadhaarMatch) {
        throw new Error("Not a valid Aadhaar card");
      }

      const aadhaarNumber = aadhaarMatch[0].replace(/\s/g, "");

      if (!isValidAadhaar(aadhaarNumber)) {
        throw new Error("Invalid Aadhaar number format");
      }

      // QR Scan
      const bitmap = await createImageBitmap(file);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = bitmap.width * 2;
      canvas.height = bitmap.height * 2;

      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const qrCode = jsQR(
        imageData.data,
        canvas.width,
        canvas.height
      );

      let qrData = null;

      if (!qrCode || !qrCode.data) {
        console.warn("QR code not detected — continuing with OCR validation");
      } else {
        qrData = qrCode.data;
      }

      setVerified(true);

      if (onVerified) {
        onVerified({
          aadhaarNumber,
          qrData,
          file
        });
      }

    } catch (err) {

      alert(err.message);
      e.target.value = "";

    }

    setIsValidating(false);

  };

  return (
    <div>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="w-full border border-gray-300 rounded-lg px-4 py-3"
      />

      {isValidating && (
        <p className="text-blue-600 mt-2 text-sm">
          Verifying Aadhaar...
        </p>
      )}

    </div>
  );
};

export default AadhaarUpload;