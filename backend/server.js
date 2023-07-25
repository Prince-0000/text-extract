const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = 5000;
app.use(cors({
    origin: "https://text-extract-w.vercel.app"
  }));
app.use(express.json());

const airtableApiKey = 'keyxC5y4yJk0lDjJg'; // Replace with your Airtable API key
const airtableBaseId = 'appnMyZMv8EuwHwN8'; // Replace with your Airtable Base ID
const airtableTable = 'Table%201'; // Replace with the name of your Airtable table

function extractCouponAndPIN(text) {
  // Regular expressions to find the coupon and PIN
  const couponPattern = /Coupon: (\w+)/;
  const pinPattern = /PIN: (\d+)/;

  // Extract coupon and pin using regular expressions
  const couponMatch = text.match(couponPattern);
  const pinMatch = text.match(pinPattern);

  const coupon = couponMatch ? couponMatch[1] : null;
  const pin = pinMatch ? pinMatch[1] : null;

  return { coupon, pin };
}

async function saveToAirtable(coupon, pin) {
    console.log('Coupon:', coupon);
  console.log('PIN:', pin);
  const url = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTable}`;

  try {
    const response = await axios.post(
      url,
      {
        fields: {
          Coupon: coupon,
          PIN: pin,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${airtableApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Coupon and PIN values saved to Airtable.');
    console.log('Airtable Response:', response.data);
  } catch (error) {
    console.error('Error saving to Airtable:', error);
  }
}
axios.interceptors.request.use(request => {
    console.log('Request:', request);
    return request;
  });
  
  axios.interceptors.response.use(response => {
    console.log('Response:', response);
    return response;
  });
  
app.post('/api/processMessage', (req, res) => {
  const { message } = req.body;
  console.log("Message",message)

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  const { coupon, pin } = extractCouponAndPIN(message);

  if (coupon && pin) {
    saveToAirtable(coupon, pin);
    return res.json({ message: 'Coupon and PIN values extracted and saved to Airtable.' });
  } else {
    return res.json({ message: 'Coupon and/or PIN value not found in the message.' });
  }
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
module.exports=app;