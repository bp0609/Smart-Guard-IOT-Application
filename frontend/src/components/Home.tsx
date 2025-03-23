// import { ImgCont, ScrollCont, } from "./Conts"
import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";

// const acad_blocks = ["AB 1", "AB 2", "AB 3"];
// const room_nos = ["101", "102", "103"];

// getting acad_blocks and room_nos from backend
import axios from "axios";

const [acad_blocks, setAcadBlocks] = useState<string[]>([]);
const [room_nos, setRoomNos] = useState<string[]>([]);

useEffect(() => {
    axios.get<string[]>('http://localhost:5000/acad_blocks')
        .then((response) => {
            setAcadBlocks(response.data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });

    axios.get<string[]>('http://localhost:5000/room_nos')
        .then((response) => {
            setRoomNos(response.data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}, []);

export default function Home() {
    return (
        <div className="container my-3 text-center d-flex justify-content-around">
            <Dropdown title="Academic Block" items={acad_blocks} onSelect={(item) => console.log(item)} />
            <Dropdown title="Room No." items={room_nos} onSelect={(item) => console.log(item)} />
        </div>
    );
}