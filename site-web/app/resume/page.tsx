"use client";

import { useState } from "react";

export default function Resume() {
    const categories = ["Santé", "Ménage", "Alimentation", "Maison", "Hygiène", "Autre"];

    const [activeCategory, setActiveCategory] = useState("Santé");
    const [searchQuery, setSearchQuery] = useState("");

    const aideNom = "userTemp";
    const archiveCount = 0;
    const channels = [];

    return (
        <div className="w-full p-6 md:p-10 font-montserrat min-h-screen bg-[#f1f2f2]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6 w-full pt-12 md:pt-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#0551ab]">Resume</h1>
                    <nav className="text-sm text-gray-500 mt-1">
                        Home / Resume / Catégories / <span className="text-[#26b3a9] font-medium">{activeCategory}</span>
                    </nav>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">

                    <div className="w-full sm:w-60 [&_button]:w-full [&_button]:h-14 [&_button]:text-lg [&_button]:font-bold shadow-md rounded-xl overflow-hidden">
                        <select
                            className="block w-full font-bold px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="1">Trier par : Plus récent</option>
                            <option value="2">Trier par : Plus ancien</option>
                        </select>
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

                <div className="space-y-6">
                    {channels.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-300">
                            <p className="text-xl font-medium italic">Aucun résumé disponible pour la catégorie {activeCategory}.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
