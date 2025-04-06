import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAlerts } from "../utils/fetch";

export default function AlertsPage({ mode }: { mode: 'light' | 'dark' }) {
    const [alertData, setAlertData] = useState<{
        alert_time: string;
        building: string;
        reading_value: string;
        room_number: number;
        sensor_id: number;
        alert_type: string;
        sensor_type_name: string;
    }[]>([]);

    useEffect(() => {
        fetchAlerts(setAlertData);
        const interval = setInterval(() => {
            fetchAlerts(setAlertData);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container my-3 text-center">
            {alertData.length > 0 ? (
                <>
                    <h1>Alerts</h1>
                    <table className="table table-bordered table-stripped table-hover my-3">
                        <thead className={`table-${mode === 'dark' ? 'dark' : 'light'}`}>
                            <tr>
                                <th>Alert Time</th>
                                <th>Building</th>
                                <th>Room Number</th>
                                <th>Sensor ID</th>
                                <th>Sensor Type</th>
                                <th>Reading Value</th>
                            </tr>
                        </thead>
                        <tbody className={`table-${mode === 'dark' ? 'dark' : 'light'}`}>
                            {alertData.map((alert, index) => (
                                <tr key={index}>
                                    <td>{new Date(alert.alert_time).toLocaleString()}</td>
                                    <td>{alert.building}</td>
                                    <td>{alert.room_number}</td>
                                    <td>{alert.sensor_id}</td>
                                    <td>{alert.sensor_type_name}</td>
                                    <td>{alert.reading_value} {alert.alert_type === 'high' ? '(High)' : '(Low)'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <div className="container my-3 text-center" style={{ fontSize: '50px', color: 'green', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    All Good! There are no alerts at the moment.
                </div>
            )}
            <Link to="#" className="btn btn-primary" onClick={(e) => { e.preventDefault(); fetchAlerts(setAlertData); }} style={{
                position: 'fixed', right: '20px', top: '80px', zIndex: 1000
            }}>
                Refresh Alerts
            </Link>
        </div >
    );
}