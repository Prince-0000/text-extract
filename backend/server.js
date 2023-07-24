// const express = require('express');
// const XLSX = require('xlsx');
// const cors = require('cors');
// const fs = require('fs');

// const app = express();
// const PORT = 5000;
// app.use(cors());
// app.use(express.json());

// function extractCouponAndPIN(text) {
//   // Regular expressions to find the coupon and PIN
//   const couponPattern = /Coupon: (\w+)/;
//   const pinPattern = /PIN: (\d+)/;

//   // Extract coupon and pin using regular expressions
//   const couponMatch = text.match(couponPattern);
//   const pinMatch = text.match(pinPattern);

//   const coupon = couponMatch ? couponMatch[1] : null;
//   const pin = pinMatch ? pinMatch[1] : null;

//   return { coupon, pin };
// }

// function saveToExcel(coupon, pin) {
//   const fileName = 'coupons_and_pin.xlsx';

//   if (fs.existsSync(fileName)) {
//     // File already exists, read the existing workbook
//     const workbook = XLSX.readFile(fileName);
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];

//     // Find the next available row
//     const range = XLSX.utils.decode_range(worksheet['!ref']);
//     const nextRow = range.e.r + 2; // Increment by 2 to move to the next empty row

//     // Add the coupon and pin to the next row
//     worksheet[`A${nextRow}`] = { t: 's', v: coupon };
//     worksheet[`B${nextRow}`] = { t: 's', v: pin };

//     // Update the worksheet range to include the new data
//     worksheet['!ref'] = XLSX.utils.encode_range(range.s, { c: range.e.c, r: nextRow });

//     // Save the updated workbook
//     XLSX.writeFile(workbook, fileName);
//     console.log(`Coupon and PIN values appended to "${fileName}"`);
//   } else {
//     // File does not exist, create a new workbook
//     const worksheet = XLSX.utils.aoa_to_sheet([['Coupon', 'PIN'], [coupon, pin]]);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Coupon and PIN');

//     // Write the new workbook to a file
//     XLSX.writeFile(workbook, fileName);
//     console.log(`Coupon and PIN values saved to "${fileName}"`);
//   }
// }

// app.post('/api/processMessage', (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ message: 'Message is required.' });
//   }

//   const { coupon, pin } = extractCouponAndPIN(message);

//   if (coupon && pin) {
//     saveToExcel(coupon, pin);
//     return res.json({ message: 'Coupon and PIN values extracted and saved to Excel.' });
//   } else {
//     return res.json({ message: 'Coupon and/or PIN value not found in the message.' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = 5000;
app.use(cors());
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


