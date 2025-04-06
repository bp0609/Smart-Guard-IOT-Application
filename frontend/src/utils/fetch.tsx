import axios from "axios";

const IP = import.meta.env.VITE_IP || "localhost";
const PORT = import.meta.env.VITE_PORT || "5000";
const BASE_URL = `http://${IP}:${PORT}`;


export const fetchSensorTypes = async (setSensorTypes: React.Dispatch<React.SetStateAction<string[]>>) => {
    try {
        const sensor_types = (await axios.get(`${BASE_URL}/sensor_types/`)).data;
        setSensorTypes(sensor_types.map((sensor: { sensor_type_name: string }) => sensor.sensor_type_name));
    } catch (error) {
        console.error('Error fetching sensor types:', error);
    }
}

export const fetchThresholds = async (setThresholds: React.Dispatch<React.SetStateAction<{ [key: string]: { min: number; max: number } }>>) => {
    try {
        const data = (await axios.get(`${BASE_URL}/sensor_types/`)).data;
        const thresholds = data.reduce((acc: { [key: string]: { min: number; max: number } }, sensor: { sensor_type_name: string; low_threshold: number; high_threshold: number }) => {
            acc[sensor.sensor_type_name] = {
                min: sensor.low_threshold,
                max: sensor.high_threshold
            };
            return acc;
        }, {});
        setThresholds(thresholds);
    } catch (error) {
        console.error('Error fetching thresholds:', error);
    }
}

export const fetchLocations = async (setLocations: React.Dispatch<React.SetStateAction<{ [key: string]: number[] }>>) => {
    try {
        const data = (await axios.get(`${BASE_URL}/locations`)).data;
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

export const fetchSensorData = async (block: string, room: string, setSensorData: React.Dispatch<React.SetStateAction<{ sensor_data: { timestamps: any[]; readings: any[] }; sensor_type: string; unit: string }[]>>) => {
    try {
        const sensor_data = (await axios.get(`${BASE_URL}/sensors/${block}/${room}/readings`)).data;
        const sensor_types = (await axios.get(`${BASE_URL}/sensor_types/`)).data;
        const sensor_data_with_types = sensor_data.map((data: { timestamps: any[]; readings: any[] }, index: number) => ({
            ...data,
            sensor_type: sensor_types[index].sensor_type_name,
            unit: sensor_types[index].unit
        }));
        const sortedSensorData = sensor_data_with_types.sort((a: any, b: any) => a.sensor_type.localeCompare(b.sensor_type));
        setSensorData(sortedSensorData);
    } catch (error) {
        console.error('Error fetching sensor data:', error);
    }
};

export const fetchAlerts = async (setAlertData: React.Dispatch<React.SetStateAction<{ alert_time: string; building: string; reading_value: string; room_number: number; sensor_id: number; alert_type: string; sensor_type_name: string }[]>>) => {
    try {
        const data = (await axios.get(`${BASE_URL}/alerts`)).data;
        setAlertData(data);
    } catch (error) {
        console.error('Error fetching alerts:', error);
    }
};

export const fetchIsAlert = async (setIsAlert: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
        const data = (await axios.get(`${BASE_URL}/alerts`)).data;
        setIsAlert(data.length > 0);
    } catch (error) {
        console.error('Error fetching alerts:', error);
    }
};