import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import axios from 'axios';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [message, setMessage] = useState<string>('');

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = '#343a40';
      document.body.style.color = 'white';
    } else {
      setMode('light');
      document.body.style.backgroundColor = '#fff';
      document.body.style.color = '#000';
    }
  };

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get<string>('http://localhost:5000');
        setMessage(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMessage();
  }, []);

  useEffect(() => {
    document.body.className = mode;
  }, [mode]);

  return (
    <>
      <Router>
        <Navbar title="SG-IOT" mode={mode} toggleMode={toggleMode} />
        <div className="container my-3 text-center">
          <h1>Smart Guard IOT Application</h1>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <div>
          <p>{message}</p>
        </div>
      </Router>
    </>
  );
}

export default App;
