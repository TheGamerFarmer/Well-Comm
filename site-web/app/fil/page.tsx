"use client";

import React, {useRef, useEffect, useState} from "react";
import Modal from "./Modal";
import { Button } from "@/components/ButtonMain";
import FilArianne from "@/components/FilArianne";
import { useFilLogic } from "@/hooks/useFilLogic";
import {mapCategoryToEnum, capitalizeWords, MessageResponse, getPermissions} from "@/functions/fil-API";
import Image from "next/image";
import { API_BASE_URL } from "@/config";

export enum Permission {
    SEND_MESSAGE = "SEND_MESSAGE",
    DELETE_MESSAGE = "DELETE_MESSAGE",
    OPEN_CHANNEL = "OPEN_CHANNEL",
    CLOSE_CHANNEL = "CLOSE_CHANNEL",
    IS_ADMIN = "IS_ADMIN",
    MODIFY_MESSAGE = "MODIFY_MESSAGE",
    IS_MEDECIN = "IS_MEDECIN",
    MODIFIER_AGENDA = "MODIFIER_AGENDA",
    ASSIGNER_PERMISSIONS = "ASSIGNER_PERMISSIONS",
    INVITER = "INVITER",
}

export type RecordAccount = {
    record: { id: number };
    title: string;
    permissions: Permission[];
};

export default function FilDeTransmission() {
    const {
        categories, records, channels, currentUserName, messages,
        activeRecordId, setActiveRecordId, selectedCategories, toggleCategory,
        searchQuery, setSearchQuery, isLoading, selectedChannel, setSelectedChannel,
        isOpen, setIsOpen, formData, setFormData, handleCreateSubmit,
        newMessage, setNewMessage, handleSendChatMessage,
        setChannelToArchive, showArchiveModal, setShowArchiveModal, confirmArchive
    } = useFilLogic();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [recordAccount, setRecordAccount] = useState<{ permissions: Permission[] } | null>(null);

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

    return (
        /* FIX : h-screen et overflow-hidden sur le parent pour bloquer le scroll global */
        <div className="w-full p-6 md:p-10 font-sans h-screen bg-[#f1f2f2] flex flex-col overflow-hidden">

            {/* --- HEADER (flex-none) --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-6 w-full pt-2 flex-none">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#0551ab]">Fil de transmission</h1>
                    <nav aria-label="Breadcrumb" className="text-sm text-[#6b7280] flex items-center whitespace-nowrap">
                        <span> <FilArianne/> </span>
                        {!selectedChannel && (
                            <span className="ml-1">
                                 {
                                     selectedCategories.length === 0 || selectedCategories.length === categories.length
                                         ? ""
                                         : " / Catégories / " + selectedCategories.join(", ")
                                 }
                            </span>
                        )}
                        {selectedChannel && <span className="ml-1"> / {selectedChannel.title}</span>}
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
                        {!selectedChannel && permissions.includes(Permission.OPEN_CHANNEL) && (
                            <Button variant="primary" onClick={() => setIsOpen(true)} link={""}>
                                Créer un fil
                            </Button>
                        )}
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
                </div>
            </div>

            {/* --- ZONE DE CONTENU VARIABLE --- */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {selectedChannel ? (
                    /* VUE DISCUSSION */
                    /* FIX : flex-1 et min-h-0 pour que le conteneur du chat respecte la taille restante */
                    <div className="bg-white rounded-[2.5rem] shadow-sm flex-1 border border-gray-100 flex flex-col overflow-hidden min-h-0">

                        {/* Header interne (flex-none) */}
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
                                <Button
                                    variant="archiver" link={""} onClick={() => {
                                    setChannelToArchive(selectedChannel);
                                    setShowArchiveModal(true);
                                }}>
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.5 5.25A2.25 2.25 0 0 1 3.75 3h16.5a2.25 2.25 0 0 1 2.25 2.25v1.5A2.25 2.25 0 0 1 21 8.873V9.9a8.252 8.252 0 0 0-1.5-.59V9h-15v8.25a2.25 2.25 0 0 0 2.25 2.25h2.56A8.19 8.19 0 0 0 9.9 21H6.75A3.75 3.75 0 0 1 3 17.25V8.873A2.25 2.25 0 0 1 1.5 6.75v-1.5zm2.25-.75a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 .75.75h16.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75H3.75zM17.25 24a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5zm-1.344-9.594L14.56 15.75h2.315A4.125 4.125 0 0 1 21 19.875v.375a.75.75 0 1 1-1.5 0v-.375a2.625 2.625 0 0 0-2.625-2.625H14.56l1.346 1.344a.75.75 0 0 1-1.062 1.062l-2.628-2.631a.75.75 0 0 1 .003-1.057l2.625-2.626a.75.75 0 0 1 1.062 1.063" fill="currentColor"/>
                                    </svg>
                                    Archiver
                                </Button>
                            </div>
                        </div>

                        {/* FIX : overflow-y-auto ici pour que seul le chat défile */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-[#f9fafb]">
                            {sortedMessages.map((msg: MessageResponse, index: number) => {
                                const isMe = msg.authorUserName === currentUserName;
                                const msgDate = new Date(msg.date);
                                const prevMsg = index > 0 ? sortedMessages[index - 1] : null;
                                const prevDate = prevMsg ? new Date(prevMsg.date) : null;
                                const showSeparator = !prevDate ||
                                    msgDate.getFullYear() !== prevDate.getFullYear() ||
                                    msgDate.getMonth() !== prevDate.getMonth() ||
                                    msgDate.getDate() !== prevDate.getDate();

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
                                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] md:max-w-[70%] rounded-3xl p-5 shadow-sm relative ${
                                                isMe ? 'bg-[#0551ab] text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                            }`}>
                                                {!isMe && (
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="font-black text-xs text-[#26b3a9]">{msg.authorUserName}</span>
                                                        <span className="bg-gray-100 text-gray-500 text-[9px] px-2 py-0.5 rounded-full uppercase font-bold">
                                                            {msg.authorTitle}
                                                        </span>
                                                    </div>
                                                )}
                                                <p className="text-sm md:text-base font-semibold leading-relaxed">{msg.content}</p>
                                                <div className={`text-[10px] mt-3 flex items-center gap-1 font-bold ${isMe ? 'text-blue-200 justify-end' : 'text-gray-400'}`}>
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
                        </div>
                    </div>
                ) : (
                    /* VUE LISTE */
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        {/* Navigation Catégories (flex-none) */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 flex flex-wrap justify-between gap-4 w-full border border-gray-100 flex-none">
                            {categories.map((cat) => (
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
                        <div className="bg-white rounded-[2.5rem] shadow-sm p-8 md:p-12 flex-1 min-h-0 border border-gray-50 flex flex-col overflow-hidden">
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

            {/* Modal de création */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <form className="mx-auto max-w-2xl" onSubmit={handleCreateSubmit}>
                    <h2 className="text-xl font-bold text-[#0551ab] mb-6 uppercase">Créer une transmission</h2>
                    <label className="text-sm font-bold text-[#727272] mb-2 block ">Catégorie</label>
                    <select
                        className="w-full px-4 py-2 mb-4 border rounded-md outline-none focus:ring-2 focus:ring-[#0551ab] text-black border-gray-300"
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
                        className="w-full h-11 rounded-lg border-2 mb-4 p-3 outline-none focus:border-[#0551ab] text-black border-gray-300"
                    />
                    <label className="text-sm font-bold text-[#727272] mb-2 block">Message</label>
                    <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full h-32 rounded-lg border-2 mb-6 p-3 outline-none focus:border-[#0551ab] resize-none text-black border-gray-300"
                    ></textarea>
                    <div className="flex gap-4">
                        <Button variant="cancel" type="button" onClick={() => setIsOpen(false)} link={""}>Annuler</Button>
                        <Button variant="validate" type="submit" link={""}>Créer le fil</Button>
                    </div>
                </form>
            </Modal>

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
                                confirmArchive();
                                setSelectedChannel(null);
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