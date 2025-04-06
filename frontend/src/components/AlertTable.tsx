export default function AlertTable({ alertData, mode }: { alertData: { alert_time: string; building: string; reading_value: string; room_number: number; sensor_id: number; alert_type: string; sensor_type_name: string }[], mode: 'light' | 'dark' }) {
    return (
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
    )
};