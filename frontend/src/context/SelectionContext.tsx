import React, { createContext, useContext, useState } from "react";

type SelectionContextType = {
    selectedAcadBlock: string;
    setSelectedAcadBlock: (block: string) => void;
    selectedRoom: string;
    setSelectedRoom: (room: string) => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedAcadBlock, setSelectedAcadBlock] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");

    return (
        <SelectionContext.Provider value={{ selectedAcadBlock, setSelectedAcadBlock, selectedRoom, setSelectedRoom }}>
            {children}
        </SelectionContext.Provider>
    );
};

export const useSelection = () => {
    const context = useContext(SelectionContext);
    if (!context) throw new Error("useSelection must be used within SelectionProvider");
    return context;
};
