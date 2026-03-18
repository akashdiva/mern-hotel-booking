import axios from "axios";

export const sendWhatsappMessage = async (bookingData) => {

  // Clean phone number
  let phone = bookingData.phone.replace("+", "").replace(/\s/g, "");

  // Add India country code if missing
  if (phone.length === 10) {
    phone = "91" + phone;
  }


  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  const message = `
🏨 Raghu Residency

Booking Confirmed ✅

Guest: ${bookingData.name}
Room: ${bookingData.roomName}
Check-in: ${bookingData.checkin}
Check-out: ${bookingData.checkout}
Guests: ${bookingData.guests}
💳 Payment ID: ${bookingData.paymentId}

Thank you for choosing Raghu Residency!
`;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    

  } catch (error) {
    console.log("WhatsApp error:", error.response?.data || error.message);
  }
};