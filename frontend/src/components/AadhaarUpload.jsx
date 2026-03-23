import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import jsQR from "jsqr";
import { backendUrl } from "../App";
const AadhaarUpload = ({ onVerified, onUploadStart }) => {

  const [isValidating, setIsValidating] = useState(false);
  const [verified, setVerified] = useState(false);
  const [fileName, setFileName] = useState("Upload Aadhaar Card As Landscape Image");
  
  const [showWebcam, setShowWebcam] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startWebcam = async () => {
    setShowOptionModal(false);
    setShowWebcam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Please allow camera access to take a picture.");
      setShowWebcam(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setShowWebcam(false);
  };

  const capturePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], "aadhaar_capture.jpg", { type: "image/jpeg" });
        stopWebcam();
        setFileName("aadhaar_capture.jpg");
        // Simulate event for handleUpload
        handleUpload({ target: { files: [file], value: "" } });
      }, "image/jpeg", 0.9);
    }
  };

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

     // ✅ Upload to backend after verification
const formData = new FormData();
formData.append("aadhaarImage", file);
formData.append("aadhaarNumber", aadhaarNumber);
formData.append("qrData", qrData || "");

const res = await fetch(`${backendUrl}/api/aadhaar/verify`, {
  method: "POST",
  body: formData,
});

const responseText = await res.text();
console.log("RAW RESPONSE:", responseText);

const data = responseText ? JSON.parse(responseText) : {};

if (!data.success) {
  throw new Error("Upload failed");
}

setVerified(true);

// ✅ Send FILE PATH to parent
if (onVerified) {
  onVerified({
    aadhaarNumber,
    qrData,
    filePath: data.filePath // ⭐ THIS IS THE FIX
  });
}

    } catch (err) {

      alert(err.message);
      if (e.target) {
         e.target.value = "";
      }
      setFileName("Upload Aadhaar Card As Landscape Image");

    }

    setIsValidating(false);

  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowOptionModal(true)}
        className="w-full border-2 border-dashed border-fuchsia-600 text-fuchsia-600 bg-white hover:bg-fuchsia-50 rounded-lg px-4 py-4 font-medium transition-colors text-center shadow-sm"
      >
        {fileName !== "Upload Aadhaar Card As Landscape Image" 
          ? fileName 
          : "📸 Click Here to Upload Aadhaar"}
      </button>

      {isValidating && (
        <p className="text-blue-600 text-center mt-2 text-sm font-semibold">
          Verifying Aadhaar...
        </p>
      )}

      {/* Upload Options Modal */}
      {showOptionModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full flex flex-col items-center">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Upload Aadhaar</h3>
            
            <button
              type="button"
              onClick={startWebcam}
              className="w-full mb-3 flex items-center justify-center bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg px-4 py-3 font-semibold transition-colors shadow-sm"
            >
              Take Picture (Webcam/Camera)
            </button>
            
            <label className="w-full flex items-center justify-center border-2 border-fuchsia-600 text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg px-4 py-3 cursor-pointer font-semibold transition-colors shadow-sm text-center">
              Browse Folder
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setShowOptionModal(false);
                  setFileName(e.target.files[0]?.name || "Upload Aadhaar Card");
                  handleUpload(e);
                }}
              />
            </label>

            <button
              type="button"
              onClick={() => setShowOptionModal(false)}
              className="mt-6 text-gray-400 hover:text-gray-600 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Webcam Modal */}
      {showWebcam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="bg-white rounded-xl p-5 max-w-lg w-full flex flex-col items-center shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Capture Aadhaar</h3>
            <div className="relative w-full overflow-hidden bg-black rounded-lg aspect-video flex-shrink-0 shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-3 mt-6 w-full">
              <button
                type="button"
                onClick={stopWebcam}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-bold transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={capturePicture}
                className="flex-1 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 font-bold transition-colors shadow-sm"
              >
                Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AadhaarUpload;