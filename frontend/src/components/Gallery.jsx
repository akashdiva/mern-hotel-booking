import React, { useState, useEffect } from "react";

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
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(slider);
  }, []);

  return (
    <div className="py-20 px-4">

      <h2 className="text-4xl font-bold text-center mb-12">
        Gallery
      </h2>

      {/* Image Slider */}
      <div className="overflow-hidden max-w-5xl mx-auto">

        <div
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${index * 33.33}%)` }}
        >
          {images.concat(images.slice(0,3)).map((img, i) => (
            <div key={i} className="w-1/3 px-3 flex-shrink-0">
              <img
                src={img}
                alt="gallery"
                className="w-full h-56 object-cover rounded-xl shadow-md"
              />
            </div>
          ))}
        </div>

      </div>

      {/* YouTube Video */}
      <div className="max-w-3xl mx-auto mt-16">
        <div className="relative w-full" style={{paddingBottom: "56.25%"}}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
            src="https://www.youtube.com/embed/4OAQ-eNlqLo"
            title="Hotel Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

    </div>
  );
};

export default Gallery;