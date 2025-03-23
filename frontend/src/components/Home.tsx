import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
    const [locations, setLocations] = useState<{ [key: string]: number[] }>({});
    const [selectedAcadBlock, setSelectedAcadBlock] = useState("");
    const [acadBlockTitle, setAcadBlockTitle] = useState("Academic Block");
    const [selectedRoom, setSelectedRoom] = useState("");

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

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleAcadBlockSelect = (item: string) => {
        setSelectedAcadBlock(item);
        setAcadBlockTitle(item);
        setSelectedRoom("");
    };

    const handleRoomSelect = (item: string) => {
        setSelectedRoom(item);
        console.log("Selected room:", item);
    };

    return (
        <div className="container my-3 text-center d-flex justify-content-around">
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
    );
}
