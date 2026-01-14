"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ButtonMain";
import FilArianne from "@/components/FilArianne";
import {
    getCurrentUser,
    getRecords,
    getCloseChannels,
    mapCategoryToEnum,
    createChannel,
    FilResponse,
    DossierResponse
} from "@/functions/fil-API";
import {API_BASE_URL} from "@/config";

export default function Archive() {
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
    const [channelToDelete, setChannelToDelete] = useState<FilResponse | null>(null);

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
        const data = await getCloseChannels(currentUserName, activeRecordId, activeCategory);
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
                const data = await getCloseChannels(currentUserName, activeRecordId, activeCategory);

                if (!ignore) {
                    const sortedData = data.sort((a, b) =>
                        new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
                    );

                    setChannels(sortedData);
                    console.log("Channels chargés :", data);
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


    const filteredChannels = channels.filter(c => {
        const query = searchQuery.toLowerCase();
        return (c.title?.toLowerCase().includes(query) || c.lastMessage?.toLowerCase().includes(query));
    });

    const handleDelete = async (channelId: number) => {
        if (channelId == null || activeRecordId == null || currentUserName === "") {
            console.error("Delete bloqué", {
                channelId,
                activeRecordId,
                currentUserName
            });
            return;
        }

        try {
            const res = await fetch(
                `${API_BASE_URL}/api/${currentUserName}/records/${activeRecordId}/deletechannels/${channelId}/archive`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Erreur HTTP ${res.status}`);
            }

            // Mise à jour de l'état pour retirer le channel archivé
            setChannels((prev) => prev.filter((c) => c.id !== channelId));
            console.log("Channel supprimé ✅");
        } catch (err: any) {
            console.error(err.message);
            alert(err.message);
        }
    };


    return (
        <div className="w-full p-6 md:p-10 font-sans min-h-screen bg-[#f1f2f2]">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-6 w-full pt-2">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#0551ab]">Archives</h1>
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
                        <Button variant="validate">Retour</Button>
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

            {/* Zone de contenu principale */}
            <div className="bg-white rounded-[2.5rem] shadow-sm p-8 md:p-12 min-h-[70vh] border border-gray-50">
                <h2 className="text-[#26b3a9] font-bold text-3xl mb-8 uppercase tracking-tight">{activeCategory}</h2>
                <div className="relative mb-10 text-black">
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

                {channelToDelete && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-2xl w-[400px]">
                            <div className="flex justify-center items-center flex-col gap-y-4">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 44a19.939 19.939 0 0 0 14.142-5.858A19.939 19.939 0 0 0 44 24a19.939 19.939 0 0 0-5.858-14.142A19.94 19.94 0 0 0 24 4 19.94 19.94 0 0 0 9.858 9.858 19.94 19.94 0 0 0 4 24a19.94 19.94 0 0 0 5.858 14.142A19.94 19.94 0 0 0 24 44z" stroke="#F67A7A" strokeWidth="4" strokeLinejoin="round"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M24 37a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="#F67A7A"/>
                                    <path d="M24 12v16" stroke="#F67A7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>

                                <p className="font-bold text-blue-800 text-xl">Voulez-vous supprimer ?</p>
                                <p>
                                    Ceci sera supprimé définitivement.
                                </p>

                                <div className="flex gap-4 justify-between mb-4">
                                    <Button variant="secondary" type="button" onClick={() => {
                                        const id = channelToDelete?.id;
                                        if (id == null) return;

                                        handleDelete(id);
                                        setChannelToDelete(null);
                                    }}>
                                        Oui
                                    </Button>
                                    <Button onClick={() => setChannelToDelete(null)}>Non</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                                <button className="text-[#f27474] hover:scale-110 transition-transform" onClick={() => {
                                    console.log("ID du channel :", channel.id, typeof channel.id);
                                    setChannelToDelete(channel);
                                }}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}