'use client';

import Agenda from "@/components/Agenda";
import FilArianne from "@/components/FilArianne";

export default function Calendar() {
    return (
        <div className="w-full p-6 md:p-10 font-montserrat min-h-screen bg-[#f1f2f2]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6 w-full pt-12 md:pt-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#0551ab]">Calendrier</h1>
                    <span className="inline-flex items-center align-middle">
                            <FilArianne />
                        </span>
                </div>
            </div>

            <Agenda/>
        </div>
    );
}