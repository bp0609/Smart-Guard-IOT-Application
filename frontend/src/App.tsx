import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

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
      </Router>
    </>
  );
}

export default App;
