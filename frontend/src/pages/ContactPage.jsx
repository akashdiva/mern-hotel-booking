import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaPaperPlane } from "react-icons/fa";
import hotelImage from "../assets/contact-page.png";
import { FaWhatsapp } from "react-icons/fa";

const ContactPage = () => {

  // ✅ NEW: State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // ✅ NEW: Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ NEW: Handle Submit → WhatsApp
  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, phone, subject, message } = formData;

    const text = `New Contact Message:

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}
Message: ${message}`;

    const whatsappURL = `https://wa.me/918667837244?text=${encodeURIComponent(text)}`;

    window.open(whatsappURL, "_blank");

    // Optional: Clear form after submit
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="bg-gray-100 pt-5">

      {/* HERO SECTION */}
      <div
        className="relative h-[350px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${hotelImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative text-center text-white">
          <h1 className="text-5xl font-bold">Contact Us</h1>
          <p className="mt-4 text-lg">
            We're here to help you with your stay
          </p>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">

        {/* LEFT SIDE — UNCHANGED */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Get In Touch
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Have questions about your booking or our services? Feel free
            to reach out to us. Our team is available 24/7 to assist you.
          </p>

          {/* Address */}
          <div className="flex gap-4 mb-6">
            <div className="bg-orange-100 w-16 h-14 flex items-center justify-center rounded-2xl">
              <FaMapMarkerAlt className="text-[#D35400] text-2xl" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">Address</h4>
              <p className="text-gray-600">
                33, 2nd Floor,Thiruvallur Municipality Office, <br />
                Opposite to Rose Mahal, <br />
                VM Nagar, Tiruvallur – 602001, <br />
                Tamil Nadu, India
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex gap-4 mb-6">
            <div className="bg-orange-100 p-4 rounded-xl">
              <FaPhoneAlt className="text-[#D35400] text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">Phone</h4>
             <a
  href="tel:+918667837244"
  className="text-[#D35400] font-medium hover:underline"
>
  +91 86678 37244
</a>
            </div>
          </div>

          {/* Reception */}
          <div className="flex gap-4 mb-10">
            <div className="bg-orange-100 p-4 rounded-xl">
              <FaClock className="text-[#D35400] text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">
                Reception Hours
              </h4>
              <p className="text-gray-600">24/7 Available</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-2">
   Google Map Location
</h3>

  <iframe
  title="Raghu Residency Location"
  className="w-full h-64 rounded-xl shadow-md"
  src="https://www.google.com/maps?q=Raghu+Residency,+V.M+Nagar,+Kakkalur&output=embed"
  loading="lazy"
  allowFullScreen
/>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Send Us a Message
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>

            <div>
              <label className="block mb-2 font-medium">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D35400] outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D35400] outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D35400] outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D35400] outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Message *
              </label>
              <textarea
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D35400] outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D35400] hover:bg-[#b84300] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <FaPaperPlane />
              Send Message
            </button>

          </form>
        </div>
      </div>

           

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/918667837244"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-600 text-white p-5 rounded-full shadow-2xl text-4xl z-50 animate-bounce"
      >
        <FaWhatsapp />
      </a>

  

    </div>
  );
};

export default ContactPage;