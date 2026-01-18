import {HexColorPicker} from "react-colorful";
import React from "react";
import {useCalendarLogic} from "@/hooks/useCalendarLogic";

export default function ColorPopup() {
    const {
        editData, setEditData,
        colorPopup, PRESET_COLORS,
    } = useCalendarLogic();

    return (
        <div className="absolute z-[100] mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 w-64" ref={colorPopup}>
            <HexColorPicker
                color={editData.color}
                onChange={(c) => setEditData({...editData, color: c})}
            />

            <div className="mt-4 grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((c) => (
                    <button
                        key={c}
                        className="w-6 h-6 border border-gray-200 transition-transform hover:scale-125"
                        style={{ backgroundColor: c }}
                        onClick={() => setEditData({...editData, color: c})}
                    />
                ))}
            </div>

            <input
                className="mt-4 w-full text-center font-mono text-xs p-1 bg-gray-50 rounded border uppercase"
                value={editData.color}
                onChange={(e) => setEditData({...editData, color: e.target.value})}
            />
        </div>
    );
}