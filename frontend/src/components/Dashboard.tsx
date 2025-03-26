import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Plot from "./Plot";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
    const [locations, setLocations] = useState<{ [key: string]: number[] }>({});
    const [selectedAcadBlock, setSelectedAcadBlock] = useState("");
    const [acadBlockTitle, setAcadBlockTitle] = useState("Academic Block");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [sensorData, setSensorData] = useState<{ time: string, value: number }[]>([]);

    const fetchLocations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/locations');
            const data = response.data;
            const grouped = data.reduce((acc: { [key: string]: number[] }, item: { building: string; room_number: number }) => {
                const building = item.building;
                if (!acc[building]) {
                    acc[building] = [];
                }
                acc[building].push(item.room_number);
                return acc;
            }, {});

            const sortedGrouped = Object.keys(grouped).sort().reduce((acc: { [key: string]: number[] }, key: string) => {
                acc[key] = grouped[key].sort((a: number, b: number) => a - b);
                return acc;
            }, {});

            setLocations(sortedGrouped);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const fetchSensorData = async (block: string, room: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/sensor-data?block=${block}&room=${room}`);
            setSensorData(response.data);
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    };


    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        if (selectedAcadBlock && selectedRoom) {
            setSensorData([
                { time: '2023-01-01T00:00:00Z', value: 20 },
                { time: '2023-01-01T01:00:00Z', value: 21 },
                { time: '2023-01-01T02:00:00Z', value: 19 },
                { time: '2023-01-01T03:00:00Z', value: 22 },
                { time: '2023-01-01T04:00:00Z', value: 20 },
            ]);
        }
        // fetchSensorData(selectedAcadBlock, selectedRoom);
    }, [selectedAcadBlock, selectedRoom]);

    const handleAcadBlockSelect = (item: string) => {
        setSelectedAcadBlock(item);
        setAcadBlockTitle(item);
        setSelectedRoom("");
        setSensorData([]);
    };

    const handleRoomSelect = (item: string) => {
        setSelectedRoom(item);
        console.log("Selected room:", item);
    };

    const chartData = {
        labels: sensorData.map(data => new Date(data.time).toLocaleString([], { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })),
        datasets: [
            {
                label: 'Sensor Data',
                data: sensorData.map(data => data.value),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
            },
        ],
    };

    return (
        <div className="container my-3 text-center d-flex flex-column align-items-center">
            <div className="d-flex justify-content-around w-100 mb-3">
                <Dropdown
                    title={acadBlockTitle}
                    items={Object.keys(locations).sort()}
                    onSelect={handleAcadBlockSelect}
                />
                <Dropdown
                    title={selectedRoom || "Room Number"}
                    items={selectedAcadBlock ? locations[selectedAcadBlock].map(String).sort() : []}
                    onSelect={handleRoomSelect}
                    disabled={!selectedAcadBlock}
                    disable_msg="Select an academic block first"
                />
            </div>
            {selectedAcadBlock && selectedRoom && sensorData.length > 0 && (
                <div className="d-flex flex-wrap justify-content-around w-100">
                    <Plot chartData={chartData} />
                    <Plot chartData={chartData} />
                    <Plot chartData={chartData} />
                    <Plot chartData={chartData} />
                </div>
            )}
        </div>
    );
}
