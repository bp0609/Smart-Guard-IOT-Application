import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    axios.get<string>('http://localhost:5000/api')
      .then(response => setMessage(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>IoT Monitoring System</h1>
      <p>{message}</p>
    </div>
  );
};

export default App;