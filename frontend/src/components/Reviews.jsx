import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

import img1 from "../assets/img1.jpeg";
import img2 from "../assets/img2.jpeg";
import img3 from "../assets/img3.jpeg";
import img4 from "../assets/img4.jpeg";
import img5 from "../assets/img5.jpeg";
import img6 from "../assets/img6.jpeg";
import img7 from "../assets/img7.jpeg";
import img8 from "../assets/img8.jpeg";

const defaultReviews = [
  {
    id: 1,
    name: "Subramaniam Jawahar",
    time: "1 years ago",
    rating: 5,
    text: `It was a pleasant stay at Raghu Residency, Thiruvallur. I was with my family to visit Temple. 
Rooms were very clean and neatly laid. Felt absolutely safe for family. Good place to stay. 
Mr. Swamy, Manager had given instant and prompt reply for each and every query raised. 
Well done Mr. Swamy.`,
    rooms: 5.0,
    service: 4.0,
    location: 5.0,
  },
  {
    id: 2,
    name: "Manoj Damodar",
    time: "2 years ago",
    rating: 4,
    text: `Booked one non-ac room here when came to visit Arulmigu Vaithya Veeraraghavar Perumal koil. 
This was the most homely and cleanliest residency in this locality.! Room costed rs.700 per night (as of April, 2021), 
with one double cot bed, attached bathroom and tv. Thanks to the manager for his courteous response while booking room.! 
Rooms are at 2nd floor but easily accessible, no strain. Would surely recommend for family stay.!`,
    rooms: 5.0,
    service: 4.0,
    location: 4.0,
  },
  {
    id: 3,
    name: "Anusha Mari",
    time: "1 years ago",
    rating: 4,
    text: `I booked room for my brother and mom, the room was very neat and all the amenities are too good. 
The management was very helpful..The only thing we felt is there could be a generator, because while we entered 
we faced power cut..so had to wait till power is back.. Otherwise everything is perfect..rooms is same as they 
posted in the pictures..worth for money...`,
    rooms: 5.0,
    service: 4.0,
    location: 4.0,
  },
  {
    id: 4,
    name: "Sengu Vel",
    time: "6 months ago",
    rating: 5,
    text: `Excellent approach & hospitality by Mr Swamy sreederan & staffs. Pre booking information through what's up 
gives pleasant experience, Guest room at prime location within 700 meters from hotel to temple. 
Rooms are neatly maintained & tariffs are reasonable. Good place for a family stay. 
All the best team.`,
    rooms: 5.0,
    service: 5.0,
    location: 5.0,
  },
];

const Reviews = () => {

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-500">
        {[...Array(5)].map((_, index) =>
          index < rating ? (
            <FaStar key={index} />
          ) : (
            <FaRegStar key={index} />
          )
        )}
      </div>
    );
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 mt-20">
            Guest Reviews
          </h2>

          <p className="text-gray-600 text-lg">
            Experience shared by our valued guests on Google
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-8 md:grid-cols-2">

          {defaultReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition"
            >

              {/* Top Section */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {review.name}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {review.time} on Google
                  </p>

                  {/* ⭐ Stars */}
                  <div className="mt-1">
                    {renderStars(review.rating)}
                  </div>

                </div>

                <div className="text-lg font-bold text-gray-800">
                  {review.rating}.0
                </div>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-line">
                {review.text}
              </p>

              {/* Category Ratings */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600 font-medium">

                <div>
                  <span className="block text-gray-500">Rooms</span>
                  {renderStars(review.rooms)}
                </div>

                <div>
                  <span className="block text-gray-500">Service</span>
                  {renderStars(review.service)}
                </div>

                <div>
                  <span className="block text-gray-500">Location</span>
                  {renderStars(review.location)}
                </div>

              </div>

            </div>
          ))}

        </div>

        {/* Google Buttons */}
        <div className="text-center mt-16 flex flex-col sm:flex-row justify-center gap-4">

          {/* See All Reviews */}
          <a
            href="https://www.google.com/maps/place/?q=place_id:ChIJ2eSzSyKQUjoR2etgZ6dtHRs"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#E17100] hover:bg-[#c96300] text-white px-6 py-3 rounded-lg font-medium transition shadow-md"
          >
            See All Google Reviews
          </a>

          {/* Write Review */}
          <a
            href="https://search.google.com/local/writereview?placeid=ChIJ2eSzSyKQUjoR2etgZ6dtHRs"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#E17100] text-[#E17100] hover:bg-[#E17100] hover:text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Write a Google Review
          </a>

        </div>

      </div>
    </section>
  );
};

export default Reviews;