"use client";

import { useState } from "react";
import { Button } from "@/components/ButtonMain";

export default function FilDeTransmission() {
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

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                    <div className="w-full sm:w-60 [&_button]:w-full [&_button]:h-14 [&_button]:text-lg [&_button]:font-bold shadow-md rounded-xl overflow-hidden">
                        <Button variant="primary">
                            Modifier l&#39;agenda
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-[0_4px_25px_rgba(0,0,0,0.04)] p-8 md:p-12 w-full min-h-[70vh]">

            </div>
        </div>
    );
}