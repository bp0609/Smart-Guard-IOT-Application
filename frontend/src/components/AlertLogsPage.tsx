import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAlerts, fetchAllAlerts } from "../utils/fetch";
import AlertTable from "./AlertTable";

export default function AlertLogsPage({ mode }: { mode: 'light' | 'dark' }) {
    const [alertData, setAlertData] = useState<{
        alert_time: string;
        building: string;
        reading_value: string;
        room_number: number;
        sensor_id: number;
        alert_type: string;
        sensor_type_name: string;
    }[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [alertsPerPage, setAlertsPerPage] = useState(15);

    useEffect(() => {
        fetchAllAlerts(setAlertData);
        const interval = setInterval(() => {
            fetchAllAlerts(setAlertData);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Determine the alerts for the current page.
    const indexOfLastAlert = currentPage * alertsPerPage;
    const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
    const currentAlerts = alertData.slice(indexOfFirstAlert, indexOfLastAlert);

    const totalPages = Math.ceil(alertData.length / alertsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="container my-3 text-center">
            {alertData.length > 0 ? (
                <>
                    <h1>Alert Logs</h1>
                    <AlertTable alertData={currentAlerts} mode={mode} />
                    <div className="d-flex justify-content-center mt-3">
                        <button
                            onClick={handlePrevPage}
                            className="btn btn-secondary me-2"
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <div className="d-flex align-items-center">
                            <span>Page </span>
                            <input
                                type="number"
                                className="form-control mx-2"
                                style={{ width: '100px', textAlign: 'center' }}
                                value={currentPage}
                                min={1}
                                max={totalPages}

                                onChange={(e) => {
                                    const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
                                    setCurrentPage(page);
                                }}
                            />
                            <span> of {totalPages}</span>
                        </div>
                        <button
                            onClick={handleNextPage}
                            className="btn btn-secondary ms-2"
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <div
                    className="container my-3 text-center"
                    style={{
                        fontSize: '50px',
                        color: 'green',
                        height: '80vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    All Good! There are no alerts at the moment.
                </div>
            )}
            <Link
                to="/alerts"
                className="btn btn-primary"
                onClick={() => { fetchAlerts(setAlertData) }}
                style={{
                    position: 'fixed',
                    right: '20px',
                    top: '80px',
                    zIndex: 1000
                }}
            >
                Current Logs
            </Link>
            <input type="number" className="form-control" onChange={(e) => setAlertsPerPage(Number(e.target.value))} style={{
                position: 'fixed',
                right: '20px',
                top: '150px',
                zIndex: 1000,
                width: '150px'
            }} min={1} max={100} placeholder="Alerts per page" value={alertsPerPage} onKeyDown={(e) => {
                if (e.key === 'Enter') { setAlertsPerPage(Number((e.target as HTMLInputElement).value)); }
            }} />
        </div>
    );
}
