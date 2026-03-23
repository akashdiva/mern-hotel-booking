import React from "react";
import { Link } from "react-router-dom";
const BookingCTA = () => {
  return (
<section
  className="py-20 px-6 text-center text-white"
  style={{ backgroundColor: "#E17100" }}
>
      <div className="max-w-4xl mx-auto">
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Book Your Stay?
        </h2>

        <p className="text-lg mb-10">
          Experience the comfortable accommodation in Thiruvallur at affordable tariff
        </p>
<Link
  to="/booking/:id"
  className="font-semibold px-8 py-4 rounded-lg transition"
  style={{
    backgroundColor: "white",
    color: "#E17100",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#DADADA")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
>
  Book Now
</Link>

      </div>
    </section>
  );
};

export default BookingCTA;