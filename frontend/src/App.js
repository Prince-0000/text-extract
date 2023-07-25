import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://extractor-prince-0000.vercel.app/api/processMessage', { message });

      setResponseMessage(response.data.message);
      setTimeout(() => {
        setResponseMessage('');
      }, 2000);
    } catch (error) {
      console.error(error);
      setResponseMessage('An error occurred while processing the message.');
      setTimeout(() => {
        setResponseMessage('');
      }, 2000);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='my-5 text-xl font-medium'>Extract Coupon and PIN</h1>
      <form onSubmit={handleMessageSubmit}>
        <textarea
          rows="10"
          cols="50"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here..."
          className='sm:w-[30rem] w-[22rem] border border-black p-2 outline-none'
        />
        <br />
        <button className='bg-black text-white sm:px-5 px-4 py-1 my-2 font-medium' type="submit">Submit</button>
      </form>
      <div className='font-medium sm:text-xl text-base my-1'>
        {responseMessage && <p className='md:mx-2 mx-1 px-2 truncate'>{responseMessage}</p>}
      </div>
    </div>
  );
}

export default App;
