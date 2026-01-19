'use client';

import Agenda from "@/components/Agenda";
import React, {useState} from "react";

export default function Calendar() {
    const [activeCategory] = useState("Calendrier");

    return (
        <div className="w-full p-6 md:p-10 font-montserrat min-h-screen bg-[#f1f2f2]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6 w-full pt-12 md:pt-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#0551ab]">Calendrier</h1>
                    <nav className="text-sm text-gray-500 mt-1">
                        Home / <span className="text-[#26b3a9] font-medium">{activeCategory}</span>
                    </nav>
                </div>
            </div>

            <Agenda/>
        </div>
    );
}