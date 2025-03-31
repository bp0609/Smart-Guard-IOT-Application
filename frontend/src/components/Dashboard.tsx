import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Plot from "./Plot";
import AddSensorForm from "./AddSensorForm";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard({ mode }: { mode: 'light' | 'dark' }) {
    const [locations, setLocations] = useState<{ [key: string]: number[] }>({});
    const [selectedAcadBlock, setSelectedAcadBlock] = useState("");
    const [acadBlockTitle, setAcadBlockTitle] = useState("Academic Block");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [sensor_types, setSensorTypes] = useState<string[]>([]);
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

    const fetchSensorTypes = async () => {
        try {
            const sensor_types = (await axios.get(`http://localhost:5000/sensor_types/`)).data;
            console.log("Sensor types:", sensor_types);
            setSensorTypes(sensor_types.map((sensor: { sensor_type_name: string }) => sensor.sensor_type_name));
        } catch (error) {
            console.error('Error fetching sensor types:', error);
        }
    }


    useEffect(() => {
        fetchLocations();
        fetchSensorTypes();
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

    const getBorderColor = (index: number) => {
        const lightModeColors = ['#3B82F6', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6', '#FCD34D'];
        const darkModeColors = ['#1E3A8A', '#B45309', '#047857', '#0891B2', '#5B21B6', '#CA8A04'];
        const colors = mode === 'light' ? lightModeColors : darkModeColors;
        return colors[index % colors.length];
    };


    const chartData = sortedSensorData.map((data, index) => ({
        labels: data.sensor_data.timestamps,
        datasets: [
            {
                label: data.sensor_type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
                data: data.sensor_data.readings,
                fill: false,
                borderColor: getBorderColor(index),
            },
        ],
        threshold: Math.floor(Math.random() * 11) + 40, // Random threshold between 40 and 50
    }));


    return (
        <>
            <div className="container my-3 text-center d-flex flex-column align-items-center">
                <div className="d-flex justify-content-around w-100 mb-3">
                    <Dropdown
                        title={acadBlockTitle}
                        items={Object.keys(locations).sort()}
                        onSelect={handleAcadBlockSelect}
                        mode={mode}
                    />
                    <Dropdown
                        title={selectedRoom || "Room Number"}
                        items={selectedAcadBlock ? locations[selectedAcadBlock].map(String).sort() : []}
                        onSelect={handleRoomSelect}
                        disabled={!selectedAcadBlock}
                        disable_msg="Select an academic block first"
                        mode={mode}
                    />
                </div>
                {selectedAcadBlock && selectedRoom && sensorData.length > 0 && (
                    <Plot chartData={chartData} mode={mode} />
                )}
            </div>
            <AddSensorForm id="exampleModal" label="exampleModalLabel" sensor_types={sensor_types} mode={mode} />
        </>
    );
}
