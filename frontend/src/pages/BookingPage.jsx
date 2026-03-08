import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { RoomContext } from "../context/RoomContext";
import axios from "axios";
import Tesseract from "tesseract.js";
import termsImage from "../assets/terms-conditions.jpeg";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import AadhaarUpload from "../components/AadhaarUpload";

const BookingPage = () => {
  const { id } = useParams(); // get room id from URL
const { rooms, fetchHotelRoom } = useContext(RoomContext);
const [showTerms, setShowTerms] = useState(false);
const [isValidating, setIsValidating] = useState(false);

const [pendingReservation, setPendingReservation] = useState(null);
const [showGuestDropdown, setShowGuestDropdown] = useState(false);

const [formData, setFormData] = useState({
  fullName: "",
  phone: "",
  email: "",
  roomType: "",
  checkIn: null,
  checkOut: null,
  adults: 1,
  children: 0,
});

const [bookedDates, setBookedDates] = useState([]);

const totalGuests = formData.adults + formData.children;
  const [aadhaar, setAadhaar] = useState(null);
 
  const today = new Date().toISOString().split("T")[0];


  useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest(".relative")) {
      setShowGuestDropdown(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);





useEffect(() => {
  if (!id || !rooms.length) return;

  const selectedRoom = rooms.find((room) => room._id === id);

  if (selectedRoom) {
    setFormData((prev) => ({
      ...prev,
      roomType: selectedRoom._id, // store room ID instead of type
    }));
  }
}, [id, rooms]);

useEffect(() => {

  if (formData.checkIn && formData.checkOut) {
    fetchHotelRoom(formData.checkIn, formData.checkOut);
  }

}, [formData.checkIn, formData.checkOut]);

  const handleChange = (e) => {
  const { name, value } = e.target;

  let updatedForm = {
    ...formData,
    [name]: value,
  };

  // If check-in changes
  if (name === "checkIn") {
    const checkInDate = new Date(value);
    const checkOutDate = new Date(formData.checkOut);

    // If checkout is before or same day → auto fix
    if (!formData.checkOut || checkOutDate <= checkInDate) {
      const nextDay = new Date(checkInDate);
      nextDay.setDate(checkInDate.getDate() + 1);

      updatedForm.checkOut = nextDay.toISOString().split("T")[0];
    }
  }

  setFormData(updatedForm);
};

const generateBookedDates = (reservations = [], totalRooms = 1) => {
  const dateCounts = {};

  reservations.forEach((booking) => {
    let start = new Date(booking.checkin);
    let end = new Date(booking.checkout);

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const key = d.toDateString();
      dateCounts[key] = (dateCounts[key] || 0) + 1;
    }
  });

  const blocked = [];

  Object.keys(dateCounts).forEach((date) => {
    if (dateCounts[date] >= totalRooms) {
      blocked.push(new Date(date));
    }
  });

  return blocked;
};

useEffect(() => {
  if (!formData.roomType) return;

  const fetchBookings = async () => {
    const res = await axios.get(
      `http://localhost:4000/api/reservations/room/${formData.roomType}`
    );

const room = rooms.find(r => r._id === formData.roomType);

const blockedDates = generateBookedDates(
  Array.isArray(res.data?.reservations)
    ? res.data.reservations
    : res.data || [],
  room?.totalRooms || 1
);
    setBookedDates(blockedDates);
  };

  fetchBookings();
}, [formData.roomType]);

const handleGuestChange = (type, action) => {
  setFormData((prev) => {
    const newValue =
      action === "inc"
        ? prev[type] + 1
        : prev[type] > (type === "adults" ? 1 : 0)
        ? prev[type] - 1
        : prev[type];

    const newAdults = type === "adults" ? newValue : prev.adults;
    const newChildren = type === "children" ? newValue : prev.children;

    if (!validateGuestCapacity(newAdults, newChildren, prev.roomType)) {
      return prev;
    }

    return {
      ...prev,
      [type]: newValue,
    };
  });
};

const validateGuestCapacity = (adults, children, roomId) => {
  const room = rooms.find((r) => r._id === roomId);
  if (!room) return true;

  if (adults > room.maxAdults || children > room.maxChildren) {
    alert(
      `Max capacity for ${room.type} is ${room.maxAdults} adults and ${room.maxChildren} children`
    );
    return false;
  }

  return true;
};


const calculateTotalAmount = () => {
  if (!formData.checkIn || !formData.checkOut || !formData.roomType)
    return 0;

  const diffDays = Math.ceil(
    (formData.checkOut - formData.checkIn) /
    (1000 * 60 * 60 * 24)
  );

  const selectedRoom = rooms.find(
    (room) => room._id === formData.roomType
  );

  if (!selectedRoom || diffDays <= 0) return 0;

  return diffDays * selectedRoom.price;
};


const isDateAvailable = (date) => {
  return !bookedDates.some(
    (booked) =>
      new Date(booked).toDateString() === date.toDateString()
  );
};
  // // ✅ Aadhaar OCR Validation
  // const handleAadhaarUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   if (!file.type.startsWith("image/")) {
  //     alert("Only image files are allowed.");
  //     e.target.value = "";
  //     return;
  //   }

  //   setIsValidating(true);

  //   try {
  //     const { data: { text } } = await Tesseract.recognize(
  //       file,
  //       "eng"
  //     );

  //     const lowerText = text.toLowerCase();

  //     const hasAadhaarText =
  //       lowerText.includes("aadhaar") ||
  //       lowerText.includes("government of india") ||
  //       lowerText.includes("unique identification authority");

  //    const has12DigitNumber = /\b\d{12}\b|\b\d{4}\s\d{4}\s\d{4}\b/.test(text);

  //     if (!hasAadhaarText || !has12DigitNumber) {
  //       alert("Invalid Aadhaar image ❌ Please upload a valid Aadhaar card.");
  //       e.target.value = "";
  //       setIsValidating(false);
  //       return;
  //     }

  //     alert("Aadhaar Verified Successfully ✅");
  //     setAadhaar(file);

  //   } catch (error) {
  //     alert("Failed to validate Aadhaar. Try again.");
  //     e.target.value = "";
  //   }

  //   setIsValidating(false);
  // };

 const handleSubmit = async (e) => {
  e.preventDefault();

if (!aadhaar) {
  alert("Please upload and verify Aadhaar");
  return;
}

  const totalAmount = calculateTotalAmount();

  if (!totalAmount) {
    alert("Invalid booking details");
    return;
  }

  const selectedRoom = rooms.find(
    (room) => room._id === formData.roomType
  );

  if (!selectedRoom) {
    alert("Invalid room selected");
    return;
  }

  const bookingDetails = {
    name: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    checkin: formData.checkIn,
    checkout: formData.checkOut,
    adults: formData.adults,
    children: formData.children,
    guests: totalGuests,
    roomName: selectedRoom.name,
    roomId: selectedRoom._id,
    totalAmount,
  aadhaar: aadhaar.name
  };

  setPendingReservation(bookingDetails);
  setShowTerms(true);
};

const startPayment = async () => {

  try {

    const { data: order } = await axios.post(
      "http://localhost:4000/api/payment/create-order",
      pendingReservation
    );

    console.log("Order created:", order);

    const options = {
      key: "rzp_live_SNa0309z3lmsmB",
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,

      handler: async function (response) {

        console.log("Razorpay success response:", response);

        try {

          const res = await axios.post(
            "http://localhost:4000/api/payment/verify-payment",
            {
              ...response,
              bookingData: pendingReservation
            }
          );

          console.log("Verify response:", res.data);

          alert("Payment Successful 🎉");
          setShowTerms(false);

        } catch (err) {

          console.error("Verify payment error:", err);
          alert("Payment done but booking failed ❌");

        }

      },

      theme: { color: "#f97316" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {

    console.error("Create order error:", error);
    alert("Payment failed ❌");

  }

};


  const totalAmount = calculateTotalAmount();

const selectedRoom = rooms.find(
  (room) => room._id === formData.roomType
);

const nights =
  formData.checkIn && formData.checkOut
    ? Math.ceil(
        (formData.checkOut.getTime() - formData.checkIn.getTime()) /
        (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="bg-gray-100 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-12">

          <h1 className="text-4xl font-bold text-center text-gray-800">
            Book Your Stay
          </h1>
          <p className="text-center text-gray-500 mt-2 mb-10">
            Fill in your details to reserve a room
          </p>

          <form onSubmit={handleSubmit} className="space-y-10">

            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <label className="block mb-2 font-medium">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName || ""}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Phone Number *</label>
                <input
  type="tel"
  name="phone"
  pattern="[6-9]{1}[0-9]{9}"
  maxLength="10"
  title="Enter valid 10-digit Indian phone number"
  value={formData.phone || ""}
  onChange={handleChange}
  required
  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
/>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

      <div>
  <label className="block mb-2 font-medium">
    Upload Only Aadhaar *
  </label>

<AadhaarUpload
  onUploadStart={() => setAadhaar(null)}
  onVerified={(data) => setAadhaar(data.file)}
/>

  {aadhaar && (
    <p className="text-green-600 text-sm mt-2">
      Aadhaar verified ✔
    </p>
  )}
</div>

              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Booking Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

        <div className="relative w-full">
  <select
    name="roomType"
    value={formData.roomType || ""}
    onChange={handleChange}
    required
    className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
  >
    <option value="">Select a room type</option>

    {rooms.map((room) => (
      <option key={room._id} value={room._id}>
        {room.name} - ₹{Number(room.price).toLocaleString("en-IN")}/night
      </option>
    ))}
  </select>

  {/* Custom Arrow */}
  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
    ▼
  </div>
</div>
   <div className="relative ">

  {/* Top Selector Bar */}
  <div
    onClick={() => setShowGuestDropdown(!showGuestDropdown)}
    className="w-full border border-gray-300 rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer hover:border-gray-400 transition"
  >
    <div className="flex items-center gap-3 text-gray-700">
      <span className="text-xl">👤</span>
      <span>
        {formData.adults} adult{formData.adults > 1 ? "s" : ""} ·{" "}
        {formData.children} children 
      </span>
    </div>

    <span className={`transition ${showGuestDropdown ? "rotate-180" : ""}`}>
      ▼
    </span>
  </div>

  {/* Dropdown Panel */}
  {showGuestDropdown && (
    <div className="absolute z-50 mt-2 w-full bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-lg">

      {/* Adults */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-800 font-medium">Adults</span>

        <div className="flex items-center bg-white border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => handleGuestChange("adults", "dec")}
            className="px-4 py-2 text-gray-500 hover:bg-gray-200"
          >
            −
          </button>

          <span className="px-6 py-2 font-semibold">
            {formData.adults}
          </span>

          <button
            type="button"
            onClick={() => handleGuestChange("adults", "inc")}
            className="px-4 py-2 text-blue-600 hover:bg-gray-200"
          >
            +
          </button>
        </div>
      </div>

      {/* Children */}
      <div className="flex justify-between items-center">
        <span className="text-gray-800 font-medium">Children</span>

        <div className="flex items-center bg-white border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => handleGuestChange("children", "dec")}
            className="px-4 py-2 text-gray-500 hover:bg-gray-200"
          >
            −
          </button>

          <span className="px-6 py-2 font-semibold">
            {formData.children}
          </span>

          <button
            type="button"
            onClick={() => handleGuestChange("children", "inc")}
            className="px-4 py-2 text-blue-600 hover:bg-gray-200"
          >
            +
          </button>
        </div>
      </div>

    </div>
  )}
</div>



<div className="relative">
  <DatePicker
    selected={formData.checkIn}
    onChange={(date) =>
      setFormData({
        ...formData,
        checkIn: date,
        checkOut: null
      })
    }
    excludeDates={bookedDates}
    minDate={new Date()}
    dateFormat="dd/MM/yyyy"
    placeholderText="Select Check-in"
    popperPlacement="bottom-start"
    popperClassName="z-50"
    portalId="root"
    className="w-full border border-gray-300 rounded-lg px-24 py-4"
  />
</div>

<div className="relative">
  <DatePicker   
    selected={formData.checkOut}
    onChange={(date) =>
      setFormData({ ...formData, checkOut: date })
    }
    excludeDates={bookedDates}
    minDate={formData.checkIn || new Date()}
    dateFormat="dd/MM/yyyy"
    placeholderText="Select Check-out"
    popperPlacement="bottom-start"
    popperClassName="z-50"
    portalId="root"
    className="w-full border border-gray-300 rounded-lg px-24 py-4"
  />
</div>

              </div>
            </div>

            {totalAmount > 0 && (
  <div className="bg-[#f5f1e6] rounded-xl p-6 mt-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">
      Booking Summary
    </h2>

    <div className="space-y-3 text-gray-700">

      <div className="flex justify-between">
        <span>Room Type:</span>
        <span className="font-medium">
          {selectedRoom?.name}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Number of Nights:</span>
        <span>{nights}</span>
      </div>

      <div className="flex justify-between">
        <span>Price per Night:</span>
        <span>
          ₹{Number(selectedRoom?.price || 0).toLocaleString("en-IN")}
        </span>
      </div>

    </div>

    <hr className="my-4 border-gray-300" />

    <div className="flex justify-between text-xl font-semibold">
      <span>Total Amount:</span>
      <span className="text-[#D35400]">
        ₹{Number(totalAmount).toLocaleString("en-IN")}
      </span>
    </div>
  </div>
)}
{showTerms && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">

    <div className="bg-white w-full max-w-3xl h-[85vh] rounded-xl shadow-2xl flex flex-col">

      {/* HEADER */}
      <div className="p-5 border-b">
        <h2 className="text-2xl font-bold text-gray-800">
          Terms & Conditions
        </h2>
        <p className="text-gray-500 text-sm">
          Please review and accept our house rules before proceeding to payment.
        </p>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-700">

        <div>
          <h3 className="font-semibold text-lg">🕒 Check-in & Occupancy</h3>
          <p>Check-in: After 02:00 PM | Check-out: Before 11:00 AM.</p>
          <p>Occupancy: Maximum of 2 adult and 1 children per room.</p>
          <p>Cancellation Policy: <br></br>
By confirming a booking on our website, you agree to the following cancellation terms:<br></br>
  1. Free Cancellation (48 Hours):
Guests may cancel their reservation up to 48 hours before the scheduled check-in time and receive a full refund of the booking amount.<br></br>
2. Late Cancellation:
If a cancellation is made within 48 hours of the check-in time, the booking amount will not be refunded.<br></br>
3. No-Show Policy:
If the guest does not check in on the scheduled date without prior cancellation, the booking will be considered a No-Show, and no refund will be issued.<br></br>
4. Refund Processing:
Eligible refunds will be processed within 5–7 business days to the original payment method used during booking.<br></br>
5. Modification of Booking:
Changes to booking dates or details are subject to availability and may require additional charges.<br></br>
6. Force Majeure:
In case of unforeseen events beyond our control (natural disasters, government restrictions, etc.), cancellation policies may be adjusted at our discretion.</p>
          <p>Keys must be returned to reception upon vacating. A penalty of ₹800 applies for lost keys.</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">🆔 Identification & Entry Policy</h3>
          <p>All adult occupants must submit a Government-issued ID.</p>
          <p>Unmarried and unrelated couples are strictly not allowed.</p>
          <p>Management reserves the right to deny admission to local residents or intoxicated persons.</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">💳 Payments & Responsibility</h3>
          <p>Keys are issued only after the full tariff is paid.</p>
          <p>Caution deposit required for bulk bookings.</p>
          <p>The person booking is responsible for damages caused by occupants.</p>
          <p>Management is not responsible for valuables left in rooms.</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">🚫 Strict House Rules</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>Smoking, drinking, or gambling is strictly prohibited.</li>
            <li>Loud music or noise inside rooms is not allowed.</li>
            <li>Roaming in corridors is prohibited.</li>
            <li>Damaging beddings or fabrics will result in penalties.</li>
          </ul>
        </div>

      </div>

      {/* FIXED BUTTONS */}
      <div className="border-t p-4 flex justify-end gap-4 bg-gray-50">

        <button
          onClick={() => setShowTerms(false)}
          className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={startPayment}
          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
        >
          Accept & Pay
        </button>

      </div>

    </div>

  </div>
)}

     <button
  type="submit"
  className="w-full bg-[#D35400] hover:bg-[#b84300] text-white py-4 rounded-lg font-semibold transition"
>
  Proceed to Pay
</button>

          </form>


         

        </div>
      </div>


    <div className="mt-20 grid  md:grid-cols-3 gap-8 items-start">

  <div className="bg-white h-[120px] flex flex-col justify-center items-center rounded-xl shadow text-center">
    <h3 className="text-xl font-bold">Check-in Time</h3>
    <p className="text-gray-600">02:00 PM onwards</p>
  </div>

  <div className="bg-white h-[120px] flex flex-col justify-center items-center rounded-xl shadow text-center">
    <h3 className="text-xl font-bold">Check-out Time</h3>
    <p className="text-gray-600">11:00 AM</p>
  </div>

  <div className="bg-white h-[120px] flex flex-col justify-center items-center rounded-xl shadow text-center ">
    <h3 className="text-xl font-bold">Cancellation Policy</h3>
    <p className="text-gray-600">
      Free cancellation up to 24 hours before check-in
    </p>
  </div>

</div>
    </div>



  );
};

export default BookingPage;