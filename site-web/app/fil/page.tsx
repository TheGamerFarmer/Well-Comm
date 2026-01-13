"use client";

import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { Button } from "@/components/ButtonMain";
import FilArianne from "@/components/FilArianne";
import {
    getCurrentUser,
    getRecords,
    getChannels,
    mapCategoryToEnum,
    createChannel,
    FilResponse,
    DossierResponse
} from "@/functions/fil-API";

export default function FilDeTransmission() {
    const categories = ["Santé", "Ménage", "Alimentation", "Maison", "Hygiène", "Autre"];

    // --- ÉTATS ---
    const [activeCategory, setActiveCategory] = useState("Santé");
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [currentUserName, setCurrentUserName] = useState<string>("");
    const [records, setRecords] = useState<DossierResponse[]>([]);
    const [activeRecordId, setActiveRecordId] = useState<number | null>(null);
    const [channels, setChannels] = useState<FilResponse[]>([]);

    // État du formulaire
    const [formData, setFormData] = useState({
        category: mapCategoryToEnum("Santé"),
        title: "",
        message: ""
    });

    // --- INITIALISATION ---
    useEffect(() => {
        const init = async () => {
            const user = await getCurrentUser();
            if (user) {
                setCurrentUserName(user);
                const userRecords = await getRecords(user);
                setRecords(userRecords);
                if (userRecords.length > 0) {
                    setActiveRecordId(userRecords[0].id);
                }
            }
        };
        init().then();
    }, []);

    // --- CHARGEMENT DES FILS ---
    const loadChannels = async () => {
        if (!currentUserName || !activeRecordId) return;
        setIsLoading(true);
        const data = await getChannels(currentUserName, activeRecordId, activeCategory);
        setChannels(data);
        setIsLoading(false);
    };

    useEffect(() => {
        let ignore = false;

        async function startFetching() {
            if (!currentUserName || !activeRecordId) {
                return;
            }

            try {
                const data = await getChannels(currentUserName, activeRecordId, activeCategory);

                if (!ignore) {
                    const sortedData = data.sort((a, b) =>
                        new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
                    );

                    setChannels(sortedData);
                }
            } catch (err) {
                if (!ignore) {
                    console.error("Erreur chargement:", err);
                }
            }
        }

        startFetching().then();

        return () => {
            ignore = true;
        };
    }, [currentUserName, activeRecordId, activeCategory]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUserName || !activeRecordId) return;

        const success = await createChannel(
            currentUserName,
            activeRecordId,
            formData.title,
            formData.category,
            formData.message
        );

        if (success) {
            setIsOpen(false);
            setFormData({ category: mapCategoryToEnum(activeCategory), title: "", message: "" });
            loadChannels().then();
        } else {
            console.error("Échec de la création");
        }
    };

    const filteredChannels = channels.filter(c => {
        const query = searchQuery.toLowerCase();
        return (c.title?.toLowerCase().includes(query) || c.lastMessage?.toLowerCase().includes(query));
    });

    return (
        <div className="w-full p-6 md:p-10 font-sans min-h-screen bg-[#f1f2f2]">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-6 w-full pt-2">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#0551ab]">Fil de transmission</h1>
                    <nav className="text-sm text-gray-500 mt-1 flex items-center whitespace-nowrap">
                        <span className="opacity-70"> <FilArianne/></span>
                        <span className="text-[#26b3a9] font-medium ml-1"> / {activeCategory}</span>
                    </nav>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                    <div className="bg-[#f27474] text-white px-6 py-3 rounded-xl flex items-center gap-4 shadow-md h-14 w-full sm:w-[450px]">
                        <span className="font-bold text-lg whitespace-nowrap tracking-tight">L&#39;aidé</span>
                        <select
                            value={activeRecordId || ""}
                            onChange={(e) => setActiveRecordId(Number(e.target.value))}
                            className="bg-white text-black rounded-lg px-4 py-2 flex-1 text-base font-medium cursor-pointer border-none outline-none"
                        >
                            {records.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    <div className="w-full sm:w-60">
                        <Button onClick={() => setIsOpen(true)}>Créer un fil</Button>
                    </div>
                </div>
            </div>

            {/* Navigation Catégories */}
            <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 flex flex-wrap justify-between gap-4 w-full border border-gray-100">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-1 min-w-[130px] py-3 px-5 rounded-xl border-2 font-bold text-lg transition-all ${
                            activeCategory === cat ? "bg-[#26b3a9] text-white border-[#26b3a9]" : "text-[#26b3a9] border-[#26b3a9]"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Modal de création */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <form className="mx-auto max-w-2xl" onSubmit={handleSubmit}>
                    <h2 className="text-xl font-bold text-[#0551ab] mb-6 uppercase">Créer une transmission</h2>

                    <label className="text-sm font-bold text-[#727272] mb-2 block">Catégorie</label>
                    <select
                        className="w-full px-4 py-2 mb-4 border rounded-md outline-none focus:ring-2 focus:ring-[#0551ab]"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                        {categories.map(c => <option key={c} value={mapCategoryToEnum(c)}>{c}</option>)}
                    </select>

                    <label className="text-sm font-bold text-[#727272] mb-2 block">Sujet du fil</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full h-11 rounded-lg border-2 mb-4 p-3 outline-none focus:border-[#0551ab]"
                    />

                    <label className="text-sm font-bold text-[#727272] mb-2 block">Message</label>
                    <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full h-32 rounded-lg border-2 mb-6 p-3 outline-none focus:border-[#0551ab] resize-none"
                    ></textarea>

                    <div className="flex gap-4">
                        <Button variant="primary" type="button" onClick={() => setIsOpen(false)}>Annuler</Button>
                        <Button type="submit">Créer</Button>
                    </div>
                </form>
            </Modal>

            {/* Zone de contenu principale */}
            <div className="bg-white rounded-[2.5rem] shadow-sm p-8 md:p-12 min-h-[70vh] border border-gray-50">
                <h2 className="text-[#26b3a9] font-bold text-3xl mb-8 uppercase tracking-tight">{activeCategory}</h2>
                <div className="relative mb-10">
                    <input
                        type="text"
                        placeholder="Recherche"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#26b3a9]/10 text-lg shadow-sm"
                    />
                    <svg className="absolute left-5 top-4 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="space-y-6">
                    {isLoading ? (
                        <div className="flex justify-center py-20 text-[#26b3a9] font-medium animate-pulse">Chargement...</div>
                    ) : filteredChannels.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 font-medium">Aucun fil trouvé dans cette catégorie.</div>
                    ) : filteredChannels.map(channel => (
                        <div key={channel.id} className="bg-gray-100 p-6 rounded-2xl flex justify-between items-center group hover:shadow-md transition-all">
                            <div className="flex items-center gap-6">
                                <div className="bg-[#26b3a9] p-4 rounded-full text-white shadow-md">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-black text-xl mb-1">{channel.title}</h3>
                                    <p className="text-black opacity-80 font-medium line-clamp-1">
                                        {channel.lastMessageAuthor ? (
                                            <><span className="font-bold">{channel.lastMessageAuthor} : </span>{channel.lastMessage}</>
                                        ) : "Nouveau fil"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <span className="text-sm font-bold text-gray-400">{new Date(channel.creationDate).toLocaleDateString()}</span>
                                <button className="text-[#f27474] hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}