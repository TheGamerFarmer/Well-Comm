import React from 'react';
import {HexColorPicker} from "react-colorful";

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    presetColors: string[];
    colorPopupRef: React.RefObject<HTMLDivElement | null>;
}

export function ColorPicker({ color, onChange, presetColors, colorPopupRef }: ColorPickerProps) {
    return (
        <div className="fixed sm:absolute z-100 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 w-64 left-1/2 transform -translate-x-1/2 sm:left-auto sm:transform-none" ref={colorPopupRef}>
            <HexColorPicker color={color} onChange={onChange} />

            <div className="mt-4 grid grid-cols-6 gap-2">
                {presetColors.map((c) => (
                    <button
                        key={c}
                        className="w-6 h-6 border border-gray-200 transition-transform hover:scale-125 rounded"
                        style={{ backgroundColor: c }}
                        onClick={() => onChange(c)}
                    />
                ))}
            </div>

            <input
                className="mt-4 w-full text-center font-mono text-xs p-1 bg-gray-50 rounded border uppercase text-black"
                value={color}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}