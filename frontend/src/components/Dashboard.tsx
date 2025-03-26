import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Plot from "./Plot";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard({ mode }: { mode: 'light' | 'dark' }) {
    const [locations, setLocations] = useState<{ [key: string]: number[] }>({});
    const [selectedAcadBlock, setSelectedAcadBlock] = useState("");
    const [acadBlockTitle, setAcadBlockTitle] = useState("Academic Block");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [sensorData, setSensorData] = useState<{ sensor_data: { timestamps: any[]; readings: any[] }; sensor_type: string }[]>([]);

    const fetchLocations = async () => {
        try {
            const data = (await axios.get('http://localhost:5000/locations')).data
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
            const sensor_data = (await axios.get(`http://localhost:5000/sensors/${block}/${room}/readings`)).data;
            console.log("Sensor data:", sensor_data);
            setSensorData(sensor_data);
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    };


    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        if (selectedAcadBlock && selectedRoom) {
            fetchSensorData(selectedAcadBlock, selectedRoom);
        }
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

    const sortedSensorData = sensorData.slice().sort((a, b) =>
        a.sensor_type.localeCompare(b.sensor_type)
    );

    const chartData = sortedSensorData.map((data, index) => ({
        labels: data.sensor_data.timestamps,
        datasets: [
            {
                label: data.sensor_type,
                data: data.sensor_data.readings,
                fill: false,
                borderColor: `hsl(${index * 50}, 100%, 50%)`,
            },
        ],
    }));


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
                <Plot chartData={chartData} mode={mode} />
            )}
        </div>
    );
}
