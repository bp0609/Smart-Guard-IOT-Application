import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
    // State to store grouped locations, e.g., { "AB1": [101, 102], "AB2": [201, 202] }
    const [locations, setLocations] = useState<{ [key: string]: number[] }>({});
    // State to store the currently selected academic block
    const [selectedAcadBlock, setSelectedAcadBlock] = useState("");
    // State to store the title of the selected academic block
    const [acadBlockTitle, setAcadBlockTitle] = useState("Academic Block");
    // State to store the currently selected room number
    const [selectedRoom, setSelectedRoom] = useState("");

    // Fetch and group locations
    const fetchLocations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/locations');
            const data = response.data; // data is an array of location objects
            const grouped = data.reduce((acc: { [key: string]: number[] }, item: { building: string; room_number: number }) => {
                const building = item.building;
                // Initialize array if not already created
                if (!acc[building]) {
                    acc[building] = [];
                }
                // Add the room number to the building key array
                acc[building].push(item.room_number);
                return acc;
            }, {});
            setLocations(grouped);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    // Handle academic block selection
    const handleAcadBlockSelect = (item: string) => {
        setSelectedAcadBlock(item);
        setAcadBlockTitle(item);
        setSelectedRoom(""); // Reset selected room when academic block changes
    };

    // Handle room number selection
    const handleRoomSelect = (item: string) => {
        setSelectedRoom(item);
        console.log("Selected room:", item);
    };

    return (
        <div className="container my-3 text-center d-flex justify-content-around">
            <Dropdown
                title={acadBlockTitle}
                items={Object.keys(locations)}
                onSelect={handleAcadBlockSelect}
            />
            <Dropdown
                title={selectedRoom || "Room Number"}
                items={selectedAcadBlock ? locations[selectedAcadBlock].map(String) : []}
                onSelect={handleRoomSelect}
                disabled={!selectedAcadBlock}
            />
        </div>
    );
}
