"use client";

import React, {useState, useEffect, useRef} from "react";
import { Button } from "@/components/ButtonMain";
import FilArianne from "@/components/FilArianne";
import {
    getCurrentUser,
    getRecords,
    getCloseChannels,
    mapCategoryToEnum,
    createChannel,
    FilResponse,
    DossierResponse, getPermissions, Permission, getLastWeekChannels, capitalizeWords, MessageResponse
} from "@/functions/fil-API";
import {API_BASE_URL} from "@/config";
import {useFilLogic} from "@/hooks/useFilLogic";
import Image from "next/image";
import Modal from "@/app/fil/Modal";

export type RecordAccount = {
    record: { id: number };
    title: string;
    permissions: Permission[];
};

export default function Resume() {
    const {messages, selectedChannel, setSelectedChannel,
        isOpen, setIsOpen, handleCreateSubmit,
        newMessage, setNewMessage, handleSendChatMessage,handleDeleteChatMessage,messageToDelete,setMessageToDelete,
        setChannelToArchive, showArchiveModal, setShowArchiveModal, confirmArchive,setShowDeleteMessageModal,showDeleteMessageModal
    } = useFilLogic();
    const {categories, selectedCategories, toggleCategory}= useFilLogic();

    // --- ÉTATS ---
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [currentUserName, setCurrentUserName] = useState<string>("");
    const [records, setRecords] = useState<DossierResponse[]>([]);
    const [activeRecordId, setActiveRecordId] = useState<number | null>(null);
    const [channels, setChannels] = useState<FilResponse[]>([]);
    const [recordAccount, setRecordAccount] = useState<{ permissions: Permission[] } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);


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

    useEffect(() => {
        if (!currentUserName || !activeRecordId) return;

        const fetchChannels = async () => {
            setIsLoading(true);

            let allChannels: FilResponse[] = [];

            // 🔹 même logique que la page des fils
            const catsToFetch =
                selectedCategories.length === 0 || selectedCategories.length === categories.length
                    ? categories
                    : selectedCategories;

            for (const cat of catsToFetch) {
                const data = await getLastWeekChannels(currentUserName, activeRecordId, cat);
                allChannels = [...allChannels, ...data];
            }

            const sortedData = allChannels.sort(
                (a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
            );

            setChannels(sortedData);
            setIsLoading(false);
        };

        fetchChannels();
    }, [currentUserName, activeRecordId, selectedCategories, categories]);

    useEffect(() => {
        if (!currentUserName || !activeRecordId) {
            setRecordAccount(null);
            return;
        }

        getPermissions(currentUserName, activeRecordId)
            .then((permissions) => {
                setRecordAccount({ permissions });
            })
            .catch(() => {
                setRecordAccount({ permissions: [] });
            });
    }, [currentUserName, activeRecordId]);

    const permissions = recordAccount?.permissions ?? [];

    const filteredChannels = channels.filter(c => {
        const query = searchQuery.toLowerCase();
        return (c.title?.toLowerCase().includes(query) || c.lastMessage?.toLowerCase().includes(query));
    });

    useEffect(() => {
        if (selectedChannel) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, selectedChannel]);

    const formatSeparatorDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isSameDay = (d1: Date, d2: Date) =>
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();

        if (isSameDay(date, today)) return "Aujourd'hui";
        if (isSameDay(date, yesterday)) return "Hier";

        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const sortedMessages = [...messages].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const filteredCategories = permissions.includes(Permission.IS_MEDECIN)
        ? categories.filter(c => c === "Santé") // ne montre que celle-ci
        : categories; // sinon toutes les catégories

    return (
        <div className="w-full p-6 md:p-10 font-sans min-h-screen bg-[#f1f2f2]">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-6 w-full pt-2">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#0551ab]">Résumé</h1>
                    <nav className="text-sm text-gray-500 mt-1 flex items-center whitespace-nowrap">
                        <span className="opacity-70"> <FilArianne/></span>
                        <span className="ml-1">
                                 {
                                     selectedCategories.length === 0 || selectedCategories.length === categories.length
                                         ? ""
                                         : " / Catégories / " + selectedCategories.join(", ")
                                 }
                            </span>
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
                </div>

                {selectedChannel && (
                    <Button
                        variant="retourFil"
                        onClick={() => setSelectedChannel(null)}
                        link={""}
                    >
                        Retour
                    </Button>
                )}
            </div>

            {/* --- ZONE DE CONTENU VARIABLE --- */}
            <div className={`flex flex-col ${selectedChannel ? "flex-1 min-h-0 overflow-hidden" : ""}`}>
                {selectedChannel ? (
                    /* VUE DISCUSSION */
                    <div className="bg-white rounded-[2.5rem] shadow-sm flex-1 border border-gray-100 flex flex-col overflow-hidden min-h-0">

                        {/* Header interne */}
                        <div className="px-8 py-4 flex items-center justify-between bg-[#26b3a9] text-white w-full flex-none">
                            <div className="flex items-center gap-6">
                                <div className="bg-white p-4 rounded-full text-[#26b3a9] flex items-center justify-center shadow-md">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 30 30">
                                        <path d="M4.80002 21.6002H7.20002V26.4974L13.3212 21.6002H19.2C20.5236 21.6002 21.6 20.5238 21.6 19.2002V9.6002C21.6 8.2766 20.5236 7.2002 19.2 7.2002H4.80002C3.47642 7.2002 2.40002 8.2766 2.40002 9.6002V19.2002C2.40002 20.5238 3.47642 21.6002 4.80002 21.6002Z" />
                                        <path d="M24 2.40039H9.59995C8.27635 2.40039 7.19995 3.47679 7.19995 4.80039H21.6C22.9236 4.80039 24 5.87679 24 7.20039V16.8004C25.3236 16.8004 26.4 15.724 26.4 14.4004V4.80039C26.4 3.47679 25.3236 2.40039 24 2.40039Z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-bold leading-tight">{capitalizeWords(selectedChannel.title)}</h2>
                                    <span className="text-sm opacity-90">{selectedChannel.category}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-between self-stretch py-1">
                                <span className="px-2 py-2 font-bold">{new Date(selectedChannel.creationDate).toLocaleDateString()}</span>
                                {permissions.includes(Permission.CLOSE_CHANNEL) &&(
                                    <Button
                                        variant="archiver" link={""} onClick={() => {
                                        setChannelToArchive(selectedChannel);
                                        setShowArchiveModal(true);
                                    }}>
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.5 5.25A2.25 2.25 0 0 1 3.75 3h16.5a2.25 2.25 0 0 1 2.25 2.25v1.5A2.25 2.25 0 0 1 21 8.873V9.9a8.252 8.252 0 0 0-1.5-.59V9h-15v8.25a2.25 2.25 0 0 0 2.25 2.25h2.56A8.19 8.19 0 0 0 9.9 21H6.75A3.75 3.75 0 0 1 3 17.25V8.873A2.25 2.25 0 0 1 1.5 6.75v-1.5zm2.25-.75a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 .75.75h16.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75H3.75zM17.25 24a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5zm-1.344-9.594L14.56 15.75h2.315A4.125 4.125 0 0 1 21 19.875v.375a.75.75 0 1 1-1.5 0v-.375a2.625 2.625 0 0 0-2.625-2.625H14.56l1.346 1.344a.75.75 0 0 1-1.062 1.062l-2.628-2.631a.75.75 0 0 1 .003-1.057l2.625-2.626a.75.75 0 0 1 1.062 1.063" fill="currentColor"/>
                                        </svg>
                                        Archiver
                                    </Button>)}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-[#f9fafb]">
                            {sortedMessages.map((msg: MessageResponse, index: number) => {
                                const isMe = msg.authorUserName === currentUserName;
                                const isDeleted = msg.isDeleted || msg.content === "Ce message a été supprimé\u200B";
                                const msgDate = new Date(msg.date);
                                const prevMsg = index > 0 ? sortedMessages[index - 1] : null;
                                const prevDate = prevMsg ? new Date(prevMsg.date) : null;
                                const showSeparator = !prevDate ||
                                    msgDate.getFullYear() !== prevDate.getFullYear() ||
                                    msgDate.getMonth() !== prevDate.getMonth() ||
                                    msgDate.getDate() !== prevDate.getDate();

                                const bubbleStyles = isMe
                                    ? (isDeleted ? "bg-gray-200 text-gray-500 rounded-tr-none" : "bg-[#0551ab] text-white rounded-tr-none")
                                    : (isDeleted ? "bg-gray-100 text-gray-400 border border-gray-200 rounded-tl-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none");

                                return (
                                    <React.Fragment key={msg.id}>
                                        {showSeparator && (
                                            <div className="flex items-center gap-4 my-8">
                                                <div className="flex-1 h-px bg-gray-200"></div>
                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                                                    {formatSeparatorDate(msg.date)}
                                                </span>
                                                <div className="flex-1 h-px bg-gray-200"></div>
                                            </div>
                                        )}
                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            {isMe && !isDeleted && permissions.includes(Permission.DELETE_MESSAGE) && (<Image
                                                src="/images/icons/icons-delete.svg"
                                                alt="delete"
                                                width={24}
                                                height={24}
                                                priority
                                                className="mb-2 cursor-pointer"
                                                onClick={() => {
                                                    setMessageToDelete(msg.id);
                                                    setShowDeleteMessageModal(true);
                                                }}
                                            />)}
                                            <div className={`max-w-[85%] md:max-w-[70%] rounded-3xl p-5 shadow-sm relative ${bubbleStyles}`}>
                                                {!isMe && !isDeleted && (
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="font-black text-xs text-[#26b3a9]">{msg.authorUserName}</span>
                                                        <span className="bg-gray-100 text-gray-500 text-[9px] px-2 py-0.5 rounded-full uppercase font-bold">
                                                            {msg.authorTitle}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2">
                                                    {isDeleted && (
                                                        <svg className="w-4 h-4 opacity-40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                        </svg>
                                                    )}
                                                    <p className={`text-sm md:text-base font-semibold leading-relaxed ${isDeleted ? 'italic opacity-80' : ''}`}>
                                                        {msg.content}
                                                    </p>
                                                </div>
                                                <div className={`text-[10px] mt-3 flex items-center gap-1 font-bold ${isMe && !isDeleted ? 'text-blue-200 justify-end' : 'text-gray-400'}`}>
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Zone de saisie (flex-none) */}
                        {permissions.includes(Permission.SEND_MESSAGE) &&(
                            <div className="p-4 md:p-8 bg-white border-t w-full flex-none">
                                <form onSubmit={handleSendChatMessage} className="w-full flex items-center gap-2 md:gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Ecrivez votre message ici"
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 focus:border-[#0551ab] transition-all outline-none text-gray-800 font-bold text-sm md:text-base"
                                        />
                                    </div>
                                    <div className="w-auto ">
                                        <Button variant="validate" type="submit" link={""}>Envoyer</Button>
                                    </div>
                                </form>
                            </div>)}
                    </div>
                ) : (
                    /* VUE LISTE */
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        {/* Navigation Catégories (flex-none) */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 flex flex-wrap justify-between gap-4 w-full border border-gray-100 flex-none">
                            {filteredCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => toggleCategory(cat)}
                                    className={` flex-1 min-w-[130px] py-3 hover:cursor-pointer rounded-xl border-2 font-bold text-lg transition-all ${
                                        selectedCategories.includes(cat)
                                            ? "bg-[#26b3a9] text-white border-[#26b3a9]"
                                            : "text-[#26b3a9] border-[#26b3a9] hover:bg-gray-50 shadow-sm"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Liste des fils (flex-1 + scroll interne) */}
                        <div className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-sm p-4 md:p-10 border border-gray-50 flex flex-col">
                            <h2 className="text-[#26b3a9] font-bold text-3xl mb-8 uppercase tracking-tight flex-none">
                                {selectedCategories.length === 0 || selectedCategories.length === categories.length ? "Toutes les transmissions" : selectedCategories.join(" + ")}
                            </h2>

                            <div className="relative mb-10 text-black flex-none">
                                <input
                                    type="text"
                                    placeholder="Recherche par titre..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#26b3a9]/10 text-lg shadow-sm"
                                />
                                <svg className="absolute left-5 top-4 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                                {isLoading ? (
                                    <div className="flex justify-center py-20 text-[#26b3a9] font-medium animate-pulse">Chargement...</div>
                                ) : channels.length === 0 ? (
                                    <div className="text-center py-20 text-gray-400 font-medium">Aucun fil trouvé dans ces catégories.</div>
                                ) : channels.map(channel => (
                                    <div
                                        key={channel.id}
                                        onClick={() => setSelectedChannel(channel)}
                                        className="bg-gray-100 p-6 rounded-2xl flex justify-between items-center group hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-200"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="bg-[#26b3a9] p-4 rounded-full text-white shadow-md">
                                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 30 30">
                                                    <path d="M4.80002 21.6002H7.20002V26.4974L13.3212 21.6002H19.2C20.5236 21.6002 21.6 20.5238 21.6 19.2002V9.6002C21.6 8.2766 20.5236 7.2002 19.2 7.2002H4.80002C3.47642 7.2002 2.40002 8.2766 2.40002 9.6002V19.2002C2.40002 20.5238 3.47642 21.6002 4.80002 21.6002Z" fill="white"/>
                                                    <path d="M24 2.40039H9.59995C8.27635 2.40039 7.19995 3.47679 7.19995 4.80039H21.6C22.9236 4.80039 24 5.87679 24 7.20039V16.8004C25.3236 16.8004 26.4 15.724 26.4 14.4004V4.80039C26.4 3.47679 25.3236 2.40039 24 2.40039Z" fill="white"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-black text-xl mb-1">{channel.category} | {capitalizeWords(channel.title)}</h3>
                                                <p className="text-black opacity-80 font-medium line-clamp-1 italic text-sm">
                                                    {channel.lastMessageAuthor ? (<><span className="font-bold">{channel.lastMessageAuthor} : </span>{channel.lastMessage}</>) : "Nouveau fil"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <span className="text-sm font-bold text-gray-400">{new Date(channel.creationDate).toLocaleDateString()}</span>
                                            <button
                                                className="text-[#f27474] hover:scale-110 hover:cursor-pointer transition-transform"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setChannelToArchive(channel);
                                                    setShowArchiveModal(true);
                                                }}
                                            >
                                                {permissions.includes(Permission.CLOSE_CHANNEL) &&(
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.5 5.25A2.25 2.25 0 0 1 3.75 3h16.5a2.25 2.25 0 0 1 2.25 2.25v1.5A2.25 2.25 0 0 1 21 8.873V9.9a8.252 8.252 0 0 0-1.5-.59V9h-15v8.25a2.25 2.25 0 0 0 2.25 2.25h2.56A8.19 8.19 0 0 0 9.9 21H6.75A3.75 3.75 0 0 1 3 17.25V8.873A2.25 2.25 0 0 1 1.5 6.75v-1.5zm2.25-.75a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 .75.75h16.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75H3.75zM17.25 24a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5zm-1.344-9.594L14.56 15.75h2.315A4.125 4.125 0 0 1 21 19.875v.375a.75.75 0 1 1-1.5 0v-.375a2.625 2.625 0 0 0-2.625-2.625H14.56l1.346 1.344a.75.75 0 0 1-1.062 1.062l-2.628-2.631a.75.75 0 0 1 .003-1.057l2.625-2.626a.75.75 0 0 1 1.062 1.063" fill="#0551AB"/>
                                                    </svg>)}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showArchiveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowArchiveModal(false)}>
                    <div className="bg-white rounded-2xl w-[420px] p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center mb-4">
                            <Image
                                src="/images/icons/attention.svg"
                                alt="attention"
                                width={48}
                                height={48}
                                priority
                            />
                        </div>
                        <h2 className="text-center text-xl font-bold text-[#0551ab] mb-2">
                            Voulez-vous archiver ce fil?
                        </h2>
                        <p className="text-center text-gray-700 mb-6">
                            Ce fil sera archivé définitivement
                        </p>
                        <div className="flex justify-center gap-4">

                            <Button variant={"cancel"} link={""} onClick={() => setShowArchiveModal(false)}>
                                Non
                            </Button>

                            <Button variant={"validate"} link={""}  onClick={() => {
                                confirmArchive().then();
                                setSelectedChannel(null);
                            }}>
                                Oui
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteMessageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowDeleteMessageModal(false)}>
                    <div className="bg-white rounded-2xl w-[420px] p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center mb-4">
                            <Image
                                src="/images/icons/attention.svg"
                                alt="attention"
                                width={48}
                                height={48}
                                priority
                            />
                        </div>
                        <h2 className="text-center text-xl font-bold text-[#0551ab] mb-2">
                            Voulez-vous supprimer ce message?
                        </h2>
                        <p className="text-center text-gray-700 mb-6">
                            Ce message sera supprimé définitivement
                        </p>
                        <div className="flex justify-center gap-4">

                            <Button variant={"cancel"} link={""} onClick={() => setShowDeleteMessageModal(false)}>
                                Non
                            </Button>

                            <Button variant={"validate"} link={""}  onClick={() => {
                                handleDeleteChatMessage(messageToDelete).then()
                                setShowDeleteMessageModal(false)
                            }}>
                                Oui
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}