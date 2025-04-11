import axios from "axios";
import { useState, useEffect } from "react";

const IP = import.meta.env.VITE_IP || "localhost";
const PORT = import.meta.env.VITE_PORT || "5000";
const BASE_URL = `http://${IP}:${PORT}`;


export default function ({ id, label, sensor_types, mode }: { id: string, label: string, sensor_types: string[], mode: 'light' | 'dark' }) {

    const checkValidity = (e: any) => {
        if (e.target.id === "acadblock") {
            const acadblockPattern = /^AB\d+$/;
            if (!acadblockPattern.test(e.target.value)) {
                e.target.classList.add("is-invalid");
            } else {
                e.target.classList.remove("is-invalid");
                e.target.classList.add("is-valid");
            }
        } else if (e.target.id === "roomNumber") {
            if (e.target.value.length === 0 || e.target.value > 1000 || e.target.value < 1) {
                e.target.classList.add("is-invalid");
            } else {
                e.target.classList.remove("is-invalid");
                e.target.classList.add("is-valid");
            }
        }
    }

    const [response, setResponse] = useState<{ sensor_id?: string, error?: string }>({});

    const addSensor = async () => {
        const sensorType = (document.getElementById("sensorType") as HTMLSelectElement).value;
        const acadBlock = (document.getElementById("acadblock") as HTMLInputElement).value.trim();
        const roomNumber = (document.getElementById("roomNumber") as HTMLInputElement).value.trim();

        if (!sensorType || !acadBlock || !roomNumber) {
            setResponse({ error: "All fields are required." });
            return;
        }

        if (!/^AB\d+$/.test(acadBlock)) {
            setResponse({ error: "Invalid Academic Block format. Use AB followed by numbers (e.g., AB1)." });
            return;
        }

        if (isNaN(Number(roomNumber)) || Number(roomNumber) <= 0 || Number(roomNumber) > 1000) {
            setResponse({ error: "Room number must be a valid number between 1 and 1000." });
            return;
        }

        try {
            const payload = {
                sensor_type: sensorType,
                building: acadBlock,
                room_number: roomNumber,
                status: 'active'
            };

            const { data } = await axios.post(`${BASE_URL}/sensors`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            setResponse(data.error ? { error: data.error } : data);
        } catch (error: unknown) {
            setResponse({ error: axios.isAxiosError(error) && error.response?.data?.error ? error.response.data.error : "An unexpected error occurred" });
        }
    }

    const clearForm = () => {
        (document.getElementById("sensorType") as HTMLSelectElement).value = sensor_types[0];
        (document.getElementById("acadblock") as HTMLInputElement).value = "";
        (document.getElementById("roomNumber") as HTMLInputElement).value = "";
        setResponse({});
    }

    useEffect(() => {
        const modalElement = document.getElementById(id);
        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', clearForm);
        }
        return () => {
            if (modalElement) {
                modalElement.removeEventListener('hidden.bs.modal', clearForm);
            }
        }
    }, [id, sensor_types]);

    return (
        <>
            <div className="modal fade" id={id} tabIndex={-1} aria-labelledby={label} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className={`modal-content bg-${mode === 'light' ? 'light' : 'dark'} text-${mode === 'light' ? 'dark' : 'light'}`}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={label}>Add New Sensors</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="sensorType" className="col-form-label">Sensor Type</label>
                                    <select className={`form-select bg-${mode === 'light' ? 'light' : 'dark'} text-${mode === 'light' ? 'dark' : 'light'}`}
                                        id="sensorType">
                                        {sensor_types.map((type: string, index: number) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="acadblock" className="col-form-label">Acad. Block (Eg. AB1, AB2, etc.)</label>
                                    <input className={`form-control bg-${mode === 'light' ? 'light' : 'dark'} text-${mode === 'light' ? 'dark' : 'light'}`} id="acadblock" type="string" onChange={checkValidity} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="roomNumber" className="col-form-label">Room Number (Eg. 101, 103, etc.)</label>
                                    <input className={`form-control bg-${mode === 'light' ? 'light' : 'dark'} text-${mode === 'light' ? 'dark' : 'light'}`} id="roomNumber" type="number" max={1000} onChange={checkValidity} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            {response.sensor_id && (
                                <div className="alert alert-success" role="alert">
                                    Sensor added successfully! Sensor ID: {response.sensor_id}
                                </div>
                            )}
                            {response.error && (
                                <div className="alert alert-danger" role="alert">
                                    {response.error}
                                </div>
                            )}

                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={addSensor}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};