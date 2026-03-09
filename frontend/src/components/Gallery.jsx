import React, { useState } from "react";

import img1 from "../assets/img1.jpeg";
import img2 from "../assets/img2.jpeg";
import img3 from "../assets/img3.jpeg";
import img4 from "../assets/img4.jpeg";
import img5 from "../assets/img5.jpeg";
import img6 from "../assets/img6.jpeg";
import img7 from "../assets/img7.jpeg";
import img8 from "../assets/img8.jpeg";

const images = [img1, img8, img7, img6, img3, img5, img2, img4];

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <div className="px-4 md:px-6 py-20">

      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-20 text-center">
        Gallery
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedImg(img)}
            className="cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transition duration-300"
          >
            <img
              src={img}
              alt={`gallery-${index}`}
              className="w-full h-48 object-cover transform hover:scale-110 transition duration-500"
            />
          </div>
        ))}
      </div>

      {selectedImg && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImg(null)}
        >
          <img
            src={selectedImg}
            alt="full"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-xl"
          />

          <button
            onClick={() => setSelectedImg(null)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
};

export default Gallery;