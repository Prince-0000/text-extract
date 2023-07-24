import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
console.log(message)
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/processMessage', { message });

      setResponseMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setResponseMessage('An error occurred while processing the message.');
    }
  };

  return (
    <div>
      <h1>Extract Coupon and PIN</h1>
      <form onSubmit={handleMessageSubmit}>
        <textarea
          rows="10"
          cols="50"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here..."
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      <div>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </div>
  );
}

export default App;