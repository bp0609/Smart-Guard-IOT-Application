import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PageNotFound from './components/PageNotFound';
import AlertsPage from './components/Alertspage';
import AlertLogsPage from './components/AlertLogsPage';
import AddSensorForm from './components/AddSensorForm';
import { fetchIsAlert, fetchSensorTypes } from './utils/fetch';

function App() {
  const [isAlert, setIsAlert] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = '#132021';
      document.body.style.color = 'white';
    } else {
      setMode('light');
      document.body.style.backgroundColor = '#fff';
      document.body.style.color = '#000';
    }
  };

  const [sensor_types, setSensorTypes] = useState<string[]>([]);
  useEffect(() => {
    fetchSensorTypes(setSensorTypes);
    fetchIsAlert(setIsAlert);
    const interval = setInterval(() => {
      fetchIsAlert(setIsAlert);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Router>
        <Navbar title="SG-IOT" mode={mode} toggleMode={toggleMode} setSensorType={setSensorTypes} isAlert={isAlert} />
        <div className="container my-3 text-center">
          <h1>Smart Guard IOT Application</h1>
          <AddSensorForm id="addSensor" label="addSensorLabel" sensor_types={sensor_types} mode={mode} />
        </div>
        <Routes>
          <Route path="/" element={<Dashboard mode={mode} />} />
          <Route path="/alerts" element={<AlertsPage mode={mode} />} />
          <Route path="/alertlogs" element={<AlertLogsPage mode={mode} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
