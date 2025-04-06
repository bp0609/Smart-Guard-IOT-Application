import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAlerts, fetchAllAlerts } from "../utils/fetch";
import AlertTable from "./AlertTable";

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
                    <AlertTable alertData={alertData} mode={mode} />
                </>
            ) : (
                <div className="container my-3 text-center" style={{ fontSize: '50px', color: 'green', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    All Good! There are no alerts at the moment.
                </div>
            )}
            <Link to="/alertlogs" className="btn btn-primary" onClick={() => fetchAllAlerts(setAlertData)} style={{
                position: 'fixed', right: '20px', top: '80px', zIndex: 1000
            }}>
                All Logs
            </Link>
        </div >
    );
}