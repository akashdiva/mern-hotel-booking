import nodemailer from "nodemailer";


const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendBookingEmail = async (booking) => {

  try {

    

    const mailOptions = {
      from: `"Raghu Residency" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: "Raghu Residency - Room Booking Confirmed 🏨",

      html: `
      <div style="font-family:Arial;padding:20px">

        <h2 style="color:#f97316">🏨 Raghu Residency</h2>

        <p>Your room booking has been <b>confirmed successfully</b>.</p>

        <hr/>

        <p><b>Name:</b> ${booking.name}</p>
        <p><b>Email:</b> ${booking.email}</p>
        <p><b>Phone:</b> ${booking.phone}</p>
        <p><b>Room:</b> ${booking.roomName}</p>
      <p><b>Check In:</b> ${formatDate(booking.checkin)}</p>
<p><b>Check Out:</b> ${formatDate(booking.checkout)}</p>
        <p><b>Total Amount:</b> ₹${booking.totalAmount}</p>

        <hr/>

        <p>Thank you for choosing <b>Raghu Residency</b>.</p>

        <p>We look forward to welcoming you.</p>

      </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);

  

  } catch (error) {

    console.log("Email Error:", error);

  }
};