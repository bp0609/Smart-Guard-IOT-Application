import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Plot from "./Plot";
import { fetchLocations, fetchSensorData, fetchThresholds } from "../utils/fetch";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard({ mode }: { mode: 'light' | 'dark' }) {
    const [locations, setLocations] = useState<{ [key: string]: number[] }>({});
    const [selectedAcadBlock, setSelectedAcadBlock] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [sensorData, setSensorData] = useState<{ sensor_data: { timestamps: any[]; readings: any[] }; sensor_type: string; unit: string; latest_value: string }[]>([]);
    const [thresholds, setThresholds] = useState<{ [key: string]: { min: number; max: number } }>({});
    const [chartData, setChartData] = useState<any[]>([]);
    const [startDate, setStartDate] = useState("_");
    const [endDate, setEndDate] = useState("_");

    useEffect(() => {
        fetchLocations(setLocations);
        fetchThresholds(setThresholds);
    }, []);

    const calChartdata = ({ selectedAcadBlock, selectedRoom, startDate, endDate }: { selectedAcadBlock: string, selectedRoom: string, startDate: string, endDate: string }) => {
        fetchSensorData(selectedAcadBlock, selectedRoom, startDate, endDate, setSensorData);
        const chartData = sensorData.slice().sort((a, b) => a.sensor_type.localeCompare(b.sensor_type)).map((data, index) => ({
            labels: data.sensor_data.timestamps.slice().reverse(),
            datasets: [
                {
                    label: data.sensor_type,
                    unit: data.unit,
                    latestValue: data.latest_value,
                    data: data.sensor_data.readings.slice().reverse(),
                    fill: false,
                    borderColor: getBorderColor(index),
                    pointRadius: 0,
                    pointHoverRadius: 6,
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
        // calChartdata({ selectedAcadBlock, selectedRoom });
        const interval = setInterval(() => {
            if (selectedAcadBlock && selectedRoom) {
                calChartdata({ selectedAcadBlock, selectedRoom, startDate, endDate });
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [sensorData]);

    useEffect(() => {
        if (selectedAcadBlock && selectedRoom) {
            calChartdata({ selectedAcadBlock, selectedRoom, startDate, endDate });
        }
    }, [selectedAcadBlock, selectedRoom]);


    const handleAcadBlockSelect = (item: string) => {
        setSelectedAcadBlock(item);
        setSelectedRoom("");
        setSensorData([]);
    };

    const handleRoomSelect = (item: string) => {
        setSelectedRoom(item);
    };


    const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value && (!endDate || value <= endDate)) {
            setStartDate(value);
        } else {
            e.target.value = "";
            setStartDate("_");
        }
    };
    const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value && (!startDate || value >= startDate)) {
            setEndDate(value);
        } else {
            e.target.value = "";
            setEndDate("_");
        }
    }

    const getLocalDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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
                            title={selectedAcadBlock || "Academic Block"}
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
                {selectedAcadBlock && selectedRoom && (
                    <>
                        <Plot chartData={chartData} mode={mode} />
                        <div className="row justify-content-center my-4">
                            <div className="col-12 col-md-auto mb-3 mb-md-0">
                                <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Start Date"
                                    onChange={handleStartDate}
                                    max={getLocalDateString()}

                                />
                            </div>
                            <div className="col-12 col-md-auto">
                                <input
                                    type="date"
                                    className="form-control"
                                    placeholder="End Date"
                                    onChange={handleEndDate}
                                    max={getLocalDateString()}
                                    disabled={startDate === "_"}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>

    );
}
