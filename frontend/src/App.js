import React, { useState } from 'react';
import axios from 'axios';

// Debounce function to prevent multiple rapid API calls
const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

function App() {
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleMessageSubmit = debounce(async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state

    try {
      const response = await axios.post('https://text-extract-inky.vercel.app/api/processMessage', { message });
      setResponseMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setResponseMessage('An error occurred while processing the message.');
    } finally {
      setLoading(false); // Hide loading state
    }
  }, 1000); // Adjust the debounce delay as per your requirements

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
        <button type="submit" disabled={loading}>Submit</button> {/* Disable the button while loading */}
      </form>
      {loading && <p>Loading...</p>} {/* Show loading state message */}
      <div>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </div>
  );
}

export default App;
