import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Plot from "./Plot";
import { fetchLocations, fetchSensorData, fetchThresholds } from "../utils/fetch";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard({ mode }: { mode: 'light' | 'dark' }) {
    const [locations, setLocations] = useState<{ [key: string]: number[] }>({});
    const [selectedAcadBlock, setSelectedAcadBlock] = useState("");
    const [acadBlockTitle, setAcadBlockTitle] = useState("Academic Block");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [sensorData, setSensorData] = useState<{ sensor_data: { timestamps: any[]; readings: any[] }; sensor_type: string }[]>([]);
    const [thresholds, setThresholds] = useState<{ [key: string]: { min: number; max: number } }>({});
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        fetchLocations(setLocations);
        fetchThresholds(setThresholds);
    }, []);

    const calChartdata = ({ selectedAcadBlock, selectedRoom }: { selectedAcadBlock: string, selectedRoom: string }) => {
        fetchSensorData(selectedAcadBlock, selectedRoom, setSensorData);
        const chartData = sensorData.slice().sort((a, b) => a.sensor_type.localeCompare(b.sensor_type)).map((data, index) => ({
            labels: data.sensor_data.timestamps.slice().reverse(),
            datasets: [
                {
                    label: data.sensor_type,
                    data: data.sensor_data.readings.slice().reverse(),
                    fill: false,
                    borderColor: getBorderColor(index),
                },
            ],
            thresholds: {
                min: Number(thresholds[data.sensor_type]?.min),
                max: Number(thresholds[data.sensor_type]?.max),
            },
        }));
        setChartData(chartData);
    }

    useEffect(() => {
        if (selectedAcadBlock && selectedRoom) {
            calChartdata({ selectedAcadBlock, selectedRoom });
        }
    }, [selectedAcadBlock, selectedRoom]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (selectedAcadBlock && selectedRoom) {
                calChartdata({ selectedAcadBlock, selectedRoom });
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [sensorData]);

    const handleAcadBlockSelect = (item: string) => {
        setSelectedAcadBlock(item);
        setAcadBlockTitle(item);
        setSelectedRoom("");
        setSensorData([]);
    };

    const handleRoomSelect = (item: string) => {
        setSelectedRoom(item);
    };

    const getBorderColor = (index: number) => {
        const lightModeColors = ['#3B82F6', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6', '#FCD34D'];
        const darkModeColors = ['#1E3A8A', '#B45309', '#047857', '#0891B2', '#5B21B6', '#CA8A04'];
        const colors = mode === 'light' ? lightModeColors : darkModeColors;
        return colors[index % colors.length];
    };

    return (
        <>
            <div className="container my-3 text-center">
                <div className="row justify-content-center my-4">
                    <div className="col-12 col-md-auto mb-3 mb-md-0">
                        <Dropdown
                            title={acadBlockTitle}
                            items={Object.keys(locations).sort()}
                            onSelect={handleAcadBlockSelect}
                            mode={mode}
                        />
                    </div>
                    <div className="col-12 col-md-auto">
                        <Dropdown
                            title={selectedRoom || "Room Number"}
                            items={selectedAcadBlock ? locations[selectedAcadBlock].map(String).sort() : []}
                            onSelect={handleRoomSelect}
                            disabled={!selectedAcadBlock}
                            disable_msg="Select an academic block first"
                            mode={mode}
                        />
                    </div>
                </div>
                {selectedAcadBlock && selectedRoom && sensorData.length > 0 && (
                    <Plot chartData={chartData} mode={mode} />
                )}
            </div>
        </>

    );
}
