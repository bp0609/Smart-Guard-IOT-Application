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
            const loc_data = await axios.get('http://localhost:5000/locations');
            // console.log(loc_data);
            const loc_id = loc_data.data.find((loc: { building: string; room_number: number }) => loc.building === block && loc.room_number === parseInt(room)).location_id;
            // console.log(loc_id);
            const sensor_data = await axios.get(`http://localhost:5000/sensors`);
            // console.log(sensor_data);
            const sensors_at_loc = sensor_data.data.filter((sensor: { location_id: number }) => sensor.location_id === loc_id);
            console.log(sensors_at_loc);
            sensors_at_loc.forEach(async (sensor: { sensor_id: number }) => {
                const sensor_readings = await axios.get(`http://localhost:5000/sensors/${sensor.sensor_id}/readings`);
                console.log(sensor_readings);
                const readings = sensor_readings.data;
                setSensorData(readings);
            }
            );
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
                </div>
            )}
        </div>
    );
}
