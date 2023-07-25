import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const saveMessageToAirtable = async (message) => {
    try {
      setLoading(true); // Show loading state
      const response = await axios.post('https://text-extract-inky.vercel.app/api/processMessage', { message });
      setResponseMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setResponseMessage('An error occurred while processing the message.');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    // Disable the submit button to prevent multiple clicks
    e.target.disabled = true;

    // Call the API to save the message to Airtable
    await saveMessageToAirtable(message);

    // Enable the submit button after the API call is complete
    e.target.disabled = false;
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
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button> {/* Disable the button while loading */}
      </form>
      <div>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </div>
  );
}

export default App;
