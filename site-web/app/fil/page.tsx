"use client";

import React, {useRef, useEffect, useState, useMemo} from "react";
import Modal from "./Modal";
import { Button } from "@/components/ButtonMain";
import FilArianne from "@/components/FilArianne";
import { useFilLogic } from "@/hooks/useFilLogic";
import {mapCategoryToEnum, capitalizeWords, MessageResponse} from "@/functions/fil-API";
import Image from "next/image";
import {getPermissions, Permission} from "@/functions/Permissions";

export default function FilDeTransmissionPage() {
    const {
        categories, records, channels, currentUserName,currentUserId, messages,
        activeRecordId, setActiveRecordId, selectedCategories, toggleCategory,
        searchQuery, setSearchQuery, isLoading, selectedChannel, setSelectedChannel,
        isOpen, setIsOpen, formData, setFormData, handleCreateSubmit,
        newMessage, setNewMessage, handleSendChatMessage,handleDeleteChatMessage,messageToDelete,setMessageToDelete,
        setChannelToArchive, showArchiveModal, setShowArchiveModal, confirmArchive,setShowDeleteMessageModal,showDeleteMessageModal,
        editingMessageId, setEditingMessageId, editingContent, setEditingContent, handleSaveEdit
    } = useFilLogic();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [recordAccount, setRecordAccount] = useState<{ permissions: Permission[] } | null>(null);

    useEffect(() => {
        const localRecordId = localStorage.getItem('activeRecordId');
        if (localRecordId) {
            const id = Number(localRecordId);
            if (!isNaN(id)) {
                setActiveRecordId(id);
            }
        }
    }, [setActiveRecordId]);

    useEffect(() => {
        if (!currentUserId || !activeRecordId) {
            setRecordAccount(null);
            return;
        }

        getPermissions(currentUserId, activeRecordId)
            .then((permissions: Permission[]) => {
                setRecordAccount({ permissions });
            })
            .catch(() => {
                setRecordAccount({ permissions: [] });
            });
    }, [currentUserId, activeRecordId]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    useEffect(() => {
        if (permissions.includes(Permission.IS_MEDECIN)) {
            if (!selectedCategories.includes("Santé")) {
                toggleCategory("Santé");
            }
        }
    }, [permissions, selectedCategories, toggleCategory]);

    const sortedMessages = useMemo(() =>
        [...messages].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        ), [messages]
    );

    const filteredCategories = permissions.includes(Permission.IS_MEDECIN)
        ? categories.filter(c => c === "Santé") // ne montre que celle-ci
        : categories; // sinon toutes les catégories

    return (
        <div className={`w-full p-4 md:p-10 font-sans bg-[#f1f2f2] flex flex-col ${selectedChannel ? "h-screen overflow-hidden" : "min-h-screen"}`}>

            {/* --- HEADER --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-6 w-full pt-2 flex-none">
                <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold text-[#0551ab] mb-1">Fil de transmission</h1>
                    <nav aria-label="Breadcrumb" className="text-sm text-[#6b7280] leading-relaxed">
                        {/* On utilise un affichage inline-block pour l'icône */}
                        <span className="inline-flex items-center align-middle">
                            <FilArianne />
                        </span>
                        {!selectedChannel && selectedCategories.length > 0 && selectedCategories.length !== categories.length && (
                            <span className="inline">
                                <span className="mx-2 inline-block">/</span>
                                <span className="font-medium inline-block">Catégories</span>
                                <span className="mx-2 inline-block">/</span>
                                    {selectedCategories.map((cat, index) => (
                                        <span key={cat} className="text-[#26b3a9] font-medium inline">
                                            {cat}
                                            {index < selectedCategories.length - 1 ? ", " : ""}
                                        </span>
                                    ))}
                            </span>
                        )}
                        {selectedChannel && (
                            <span className="inline">
                                <span className="mx-2 inline-block">/</span>
                                <span className="font-medium inline">{selectedChannel.title}</span>
                            </span>
                        )}
                    </nav>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                    <div className="bg-[#26b3a9] text-white px-6 py-3 rounded-xl flex items-center gap-4 shadow-md h-14 w-full sm:w-[450px]">
                        <span className="font-bold text-lg whitespace-nowrap tracking-tight">L&#39;aidé</span>
                        <select
                            value={activeRecordId || ""}
                            onChange={(e) => {
                                const newId = Number(e.target.value);
                                setActiveRecordId(newId);
                                setSelectedChannel(null);
                            }}
                            className="bg-white text-black rounded-lg px-4 py-2 flex-1 text-base font-medium cursor-pointer border-none outline-none"
                        >
                            {records.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    <div className="w-full sm:w-60">
                        {!selectedChannel && permissions.includes(Permission.OPEN_CHANNEL) && (
                            <Button variant="primary" onClickAction={() => setIsOpen(true)} link={""}>
                                Créer un fil
                            </Button>
                        )}
                        {selectedChannel && (
                            <Button
                                variant="retourFil"
                                onClickAction={() => setSelectedChannel(null)}
                                link={""}
                            >
                                Retour
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- ZONE DE CONTENU VARIABLE --- */}
            <div className={`flex flex-col ${selectedChannel ? "flex-1 min-h-0 overflow-hidden" : ""}`}>
                {selectedChannel ? (
                    /* VUE DISCUSSION */
                    <div className="bg-white rounded-[2.5rem] shadow-sm flex-1 border border-gray-100 flex flex-col overflow-hidden min-h-0">

                        {/* Header interne */}
                        <div className="px-4 md:px-8 py-3 md:py-4 flex items-center justify-between bg-[#26b3a9] text-white w-full flex-none gap-2">
                            {/* ZONE GAUCHE : Prend le maximum de place et tronque si besoin */}
                            <div className="flex items-center gap-3 md:gap-6 min-w-0 flex-1">
                                <div className="bg-white p-2 md:p-4 rounded-full text-[#26b3a9] shrink-0 shadow-md">
                                    <svg className="w-5 h-5 " fill="currentColor" viewBox="0 0 30 30">
                                        <path d="M4.80002 21.6002H7.20002V26.4974L13.3212 21.6002H19.2C20.5236 21.6002 21.6 20.5238 21.6 19.2002V9.6002C21.6 8.2766 20.5236 7.2002 19.2 7.2002H4.80002C3.47642 7.2002 2.40002 8.2766 2.40002 9.6002V19.2002C2.40002 20.5238 3.47642 21.6002 4.80002 21.6002Z" />
                                        <path d="M24 2.40039H9.59995C8.27635 2.40039 7.19995 3.47679 7.19995 4.80039H21.6C22.9236 4.80039 24 5.87679 24 7.20039V16.8004C25.3236 16.8004 26.4 15.724 26.4 14.4004V4.80039C26.4 3.47679 25.3236 2.40039 24 2.40039Z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <h2 className="text-sm md:text-xl font-bold leading-tight truncate">
                                        {capitalizeWords(selectedChannel.title)}
                                    </h2>
                                    <span className="text-[10px] md:text-sm opacity-90 truncate">
                                        {selectedChannel.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-center shrink-0 gap-1">
                                <span className="font-bold text-[10px] md:text-sm whitespace-nowrap">
                                    {new Date(selectedChannel.creationDate).toLocaleDateString()}
                                </span>
                                {permissions.includes(Permission.CLOSE_CHANNEL) && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setChannelToArchive(selectedChannel);
                                            setShowArchiveModal(true);
                                        }}
                                        className="flex items-center justify-center gap-2 h-9 md:h-10 px-3 md:w-40 border border-white rounded-full text-white font-bold transition-all hover:bg-[#f87c7c] hover:border-[#f87c7c] shrink-0"
                                    >
                                        <svg className="w-5 h-5 md:w-6 md:h-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.5 5.25A2.25 2.25 0 0 1 3.75 3h16.5a2.25 2.25 0 0 1 2.25 2.25v1.5A2.25 2.25 0 0 1 21 8.873V9.9a8.252 8.252 0 0 0-1.5-.59V9h-15v8.25a2.25 2.25 0 0 0 2.25 2.25h2.56A8.19 8.19 0 0 0 9.9 21H6.75A3.75 3.75 0 0 1 3 17.25V8.873A2.25 2.25 0 0 1 1.5 6.75v-1.5zm2.25-.75a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 .75.75h16.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75H3.75zM17.25 24a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5zm-1.344-9.594L14.56 15.75h2.315A4.125 4.125 0 0 1 21 19.875v.375a.75.75 0 1 1-1.5 0v-.375a2.625 2.625 0 0 0-2.625-2.625H14.56l1.346 1.344a.75.75 0 0 1-1.062 1.062l-2.628-2.631a.75.75 0 0 1 .003-1.057l2.625-2.626a.75.75 0 0 1 1.062 1.063" fill="currentColor"/>
                                        </svg>
                                        <span className="sm:inline text-sm md:text-base">Archiver</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-[#f9fafb]">
                            {sortedMessages.map((msg: MessageResponse, index: number) => {
                                const isMe = msg.authorUserName === currentUserName;

                                const isDeleted = msg.isDeleted
                                const isEditing = editingMessageId === msg.id;

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

                                            {isMe && !isDeleted && !isEditing && (
                                                <div className="flex gap-4 mb-2 bg-gray-200/50 rounded-full px-4 py-1.5">
                                                    {permissions.includes(Permission.MODIFY_MESSAGE) && (
                                                        <Image
                                                            src="/images/icons/icons-modify.svg"
                                                            alt="modify"
                                                            width={24}
                                                            height={24}
                                                            priority
                                                            className="cursor-pointer transition-transform duration-200 hover:scale-125 hover:opacity-80"
                                                            onClick={() => {
                                                                setEditingMessageId(msg.id);
                                                                setEditingContent(msg.content);
                                                            }}
                                                        />
                                                    )}

                                                    {permissions.includes(Permission.DELETE_MESSAGE) && (
                                                        <Image
                                                            src="/images/icons/icons-delete.svg"
                                                            alt="delete"
                                                            width={24}
                                                            height={24}
                                                            priority
                                                            className="cursor-pointer transition-transform duration-200 hover:scale-125 hover:opacity-80"
                                                            onClick={() => {
                                                                setMessageToDelete(msg.id);
                                                                setShowDeleteMessageModal(true);
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            {/* Bulle de Message */}
                                            <div className={`max-w-[85%] md:max-w-[70%] rounded-3xl p-5 shadow-sm relative ${bubbleStyles}`}>

                                                {isEditing ? (
                                                    <div className="flex flex-col gap-3 min-w-[200px] md:min-w-[300px]">
                                                        <textarea
                                                            className="w-full p-3 text-black rounded-xl border-2 border-blue-200 focus:border-[#0551ab] outline-none resize-none font-semibold text-sm md:text-base bg-white"
                                                            value={editingContent}
                                                            onChange={(e) => setEditingContent(e.target.value)}
                                                            autoFocus
                                                            rows={2}
                                                        />
                                                        <div className="flex justify-end gap-3">
                                                            <button
                                                                className="text-xs md:text-sm font-bold text-[#f67a7a] hover:scale-110 hover:cursor-pointer"
                                                                onClick={() => setEditingMessageId(null)}
                                                            >
                                                                Annuler
                                                            </button>
                                                            <button
                                                                className="bg-white text-[#0551ab] hover:scale-110 hover:cursor-pointer transition-transform px-4 py-1.5 rounded-full text-xs md:text-sm font-bold shadow-sm"
                                                                onClick={() => handleSaveEdit(msg.id)}
                                                            >
                                                                Enregistrer
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* MODE AFFICHAGE CLASSIQUE */
                                                    <>
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
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                                                                </svg>
                                                            )}
                                                            <p className={`text-sm md:text-base font-semibold leading-relaxed wrap-break-word ${isDeleted ? "italic opacity-80" : ""}`}>
                                                                {isDeleted
                                                                    ? msg.content.replace(/\u200B/g, "")
                                                                    : msg.content}
                                                            </p>
                                                        </div>
                                                    </>
                                                )}

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

                        {permissions.includes(Permission.SEND_MESSAGE) && !editingMessageId && (
                            <div className="p-3 md:p-8 bg-white border-t w-full flex-none">
                                <form onSubmit={handleSendChatMessage} className="w-full flex items-center gap-2 md:gap-4">
                                    <div className="flex-1 min-w-0">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Ecrivez votre message ici"
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl px-3 md:px-6 py-3 md:py-4 focus:border-[#0551ab] transition-all outline-none text-gray-800 font-bold text-sm md:text-base placeholder:text-xs md:placeholder:text-base"
                                        />
                                    </div>
                                    <div className="shrink-0">
                                        <button type="submit" className="bg-[#0551ab] text-white font-bold h-11 md:h-14 px-4 md:px-8 rounded-xl md:rounded-2xl hover:bg-[#f87c7c] transition-colors text-sm md:text-base flex items-center justify-center whitespace-nowrap">
                                            <span className="hidden md:inline">Envoyer</span>
                                            <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 12h14M12 5l7 7-7 7"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                ) : (
                    /* VUE LISTE */
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 flex flex-wrap justify-between gap-4 w-full border border-gray-100 flex-none">
                            {filteredCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        // Si médecin, on empêche de décocher "Santé"
                                        if (permissions.includes(Permission.IS_MEDECIN)) return;
                                        toggleCategory(cat);
                                    }}
                                    className={` flex-1 min-w-[130px] py-3 rounded-xl border-2 font-bold text-lg transition-all ${
                                        selectedCategories.includes(cat)
                                            ? "bg-[#26b3a9] text-white border-[#26b3a9]"
                                            : "text-[#26b3a9] border-[#26b3a9] hover:bg-gray-50 shadow-sm"
                                    } ${permissions.includes(Permission.IS_MEDECIN) ? "cursor-default" : "hover:cursor-pointer"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-sm p-4 md:p-10 border border-gray-50 flex flex-col">
                            <h2 className="text-[#26b3a9] font-bold text-3xl mb-8 tracking-tight flex-none">
                                {selectedCategories.length === 0 || selectedCategories.length === categories.length ? "Toutes les transmissions" : selectedCategories.join(", ")}
                            </h2>

                            <div className="relative mb-10 text-black flex-none">
                                <input
                                    type="text"
                                    placeholder="Recherche par titre"
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
                                        className="bg-gray-100 p-4 sm:p-6 rounded-2xl flex justify-between items-center group hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-200 gap-3"
                                    >
                                        {/* Conteneur de gauche : Icône + Texte */}
                                        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                                            {/* Icône adaptative : plus petite sur mobile */}
                                            <div className="bg-[#26b3a9] p-4 rounded-full text-white shadow-md shrink-0">
                                                <svg className="w-5 h-5 " fill="currentColor" viewBox="0 0 30 30">
                                                    <path d="M4.80002 21.6002H7.20002V26.4974L13.3212 21.6002H19.2C20.5236 21.6002 21.6 20.5238 21.6 19.2002V9.6002C21.6 8.2766 20.5236 7.2002 19.2 7.2002H4.80002C3.47642 7.2002 2.40002 8.2766 2.40002 9.6002V19.2002C2.40002 20.5238 3.47642 21.6002 4.80002 21.6002Z" fill="white"/>
                                                    <path d="M24 2.40039H9.59995C8.27635 2.40039 7.19995 3.47679 7.19995 4.80039H21.6C22.9236 4.80039 24 5.87679 24 7.20039V16.8004C25.3236 16.8004 26.4 15.724 26.4 14.4004V4.80039C26.4 3.47679 25.3236 2.40039 24 2.40039Z" fill="white"/>
                                                </svg>
                                            </div>

                                            {/* Textes avec gestion du débordement */}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-black text-sm sm:text-xl mb-0.5 sm:mb-1 truncate">
                                                    {channel.category === "Maisonterrain"
                                                        ? "Maison/Terrain"
                                                        : channel.category
                                                    } | {capitalizeWords(channel.title)}
                                                </h3>
                                                <p className="text-black opacity-80 font-medium line-clamp-1 italic text-[10px] sm:text-sm">
                                                    {channel.lastMessageAuthor ? (
                                                        <><span className="font-bold">{channel.lastMessageAuthor} : </span>{channel.lastMessage}</>
                                                    ) : "Nouveau fil"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Conteneur de droite : Date + Bouton */}
                                        <div className="flex flex-col items-end gap-1 sm:gap-3 shrink-0 ml-2">
                                            <span className="text-[10px] sm:text-sm font-bold text-gray-400 whitespace-nowrap">
                                                {new Date(channel.creationDate).toLocaleDateString()}
                                            </span>
                                            {permissions.includes(Permission.CLOSE_CHANNEL) && (
                                                <button
                                                    className="text-[#f27474] hover:scale-110 hover:cursor-pointer transition-transform"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setChannelToArchive(channel);
                                                        setShowArchiveModal(true);
                                                    }}
                                                >
                                                    <svg className="w-5 h-6 sm:w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.5 5.25A2.25 2.25 0 0 1 3.75 3h16.5a2.25 2.25 0 0 1 2.25 2.25v1.5A2.25 2.25 0 0 1 21 8.873V9.9a8.252 8.252 0 0 0-1.5-.59V9h-15v8.25a2.25 2.25 0 0 0 2.25 2.25h2.56A8.19 8.19 0 0 0 9.9 21H6.75A3.75 3.75 0 0 1 3 17.25V8.873A2.25 2.25 0 0 1 1.5 6.75v-1.5zm2.25-.75a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 .75.75h16.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75H3.75zM17.25 24a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5zm-1.344-9.594L14.56 15.75h2.315A4.125 4.125 0 0 1 21 19.875v.375a.75.75 0 1 1-1.5 0v-.375a2.625 2.625 0 0 0-2.625-2.625H14.56l1.346 1.344a.75.75 0 0 1-1.062 1.062l-2.628-2.631a.75.75 0 0 1 .003-1.057l2.625-2.626a.75.75 0 0 1 1.062 1.063" fill="#0551AB"/>
                                                    </svg>
                                                </button>
                                            )}
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
                        <Button variant="cancel" type="button" onClickAction={() => setIsOpen(false)} link={""}>Annuler</Button>
                        <Button variant="validate" type="submit" link={""}>Créer le fil</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Archivage */}
            {showArchiveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowArchiveModal(false)}>
                    <div className="bg-white rounded-2xl w-[420px] p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center mb-4">
                            <Image src="/images/icons/attention.svg" alt="attention" width={48} height={48} priority />
                        </div>
                        <h2 className="text-center text-xl font-bold text-[#0551ab] mb-2">Voulez-vous archiver ce fil?</h2>
                        <p className="text-center text-gray-700 mb-6">Ce fil sera archivé définitivement</p>
                        <div className="flex justify-center gap-4">
                            <Button variant={"cancel"} link={""} onClickAction={() => setShowArchiveModal(false)}>Non</Button>
                            <Button variant={"validate"} link={""}  onClickAction={() => {
                                confirmArchive().then();
                                setSelectedChannel(null);
                            }}>Oui</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Suppression */}
            {showDeleteMessageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowDeleteMessageModal(false)}>
                    <div className="bg-white rounded-2xl w-[420px] p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center mb-4">
                            <Image src="/images/icons/attention.svg" alt="attention" width={48} height={48} priority />
                        </div>
                        <h2 className="text-center text-xl font-bold text-[#0551ab] mb-2">Voulez-vous supprimer ce message?</h2>
                        <p className="text-center text-gray-700 mb-6">Ce message sera supprimé définitivement.</p>
                        <div className="flex justify-center gap-4">
                            <Button variant={"cancel"} link={""} onClickAction={() => setShowDeleteMessageModal(false)}>Non</Button>
                            <Button variant={"validate"} link={""}  onClickAction={() => {
                                handleDeleteChatMessage(messageToDelete).then()
                                setShowDeleteMessageModal(false)
                            }}>Oui</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}