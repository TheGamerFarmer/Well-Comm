"use client";

import { useState } from "react";
import { Button } from "@/components/ButtonMain";

export default function FilDeTransmission() {
    const categories = ["Santé", "Ménage", "Alimentation", "Maison", "Hygiène", "Autre"];
    
    const [activeCategory, setActiveCategory] = useState("Santé");
    const [searchQuery, setSearchQuery] = useState("");
    
    const aideNom = ""; 
    const archiveCount = 0; 
    const channels = []; 

    return (
        <div className="w-full p-6 md:p-10 font-montserrat min-h-screen bg-[#f1f2f2]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6 w-full pt-12 md:pt-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#0551ab]">Fil de transmission</h1>
                    <nav className="text-sm text-gray-500 mt-1">
                        Home / Fil de transmission / Catégories / <span className="text-[#26b3a9] font-medium">{activeCategory}</span>
                    </nav>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                    <div className="bg-[#f27474] text-white px-6 py-3 rounded-xl flex items-center gap-4 shadow-md h-[56px] w-full sm:w-[450px]">
                        <span className="font-bold text-lg whitespace-nowrap">L'aidé</span>
                        <select className="bg-white text-black rounded-lg px-4 py-2 outline-none flex-1 text-base font-medium cursor-pointer">
                            <option value="">{aideNom}</option>
                        </select>
                    </div>

					<div className="w-full sm:w-[240px] [&_button]:w-full [&_button]:h-[56px] [&_button]:text-lg [&_button]:font-bold shadow-md rounded-xl overflow-hidden">
						<Button variant="primary">
							Créer un fil
						</Button>
					</div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.05)] mb-8 flex flex-wrap justify-between gap-4 w-full">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-1 min-w-[130px] py-3 px-5 rounded-xl border-2 font-bold text-lg transition-all ${
                            activeCategory === cat 
                            ? "bg-[#26b3a9] text-white border-[#26b3a9] shadow-md" 
                            : "text-[#26b3a9] border-[#26b3a9] hover:bg-[#26b3a9]/5"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-[0_4px_25px_rgba(0,0,0,0.04)] p-8 md:p-12 w-full min-h-[70vh]">
                <h2 className="text-[#26b3a9] font-bold text-3xl mb-8">{activeCategory}</h2>
                
                <div className="relative mb-10">
                    <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Recherche"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#26b3a9]/10 transition-all text-lg shadow-sm"
                    />
                </div>

                {/* Archives */}
                <div className="flex items-center gap-4 mb-10 text-gray-700">
                    <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M20 7H4M20 7L19 19H5L4 7M20 7L18 3H6L4 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-lg font-semibold">Dans Les Archives :</span>
                    <span className="bg-[#f27474] text-white text-sm font-black px-3 py-1.5 rounded-full shadow-md">
                        {archiveCount}
                    </span>
                </div>

                <div className="space-y-6">
                    {channels.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-300">
                            <p className="text-xl font-medium italic">Aucune transmission enregistrée pour la catégorie {activeCategory}.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}