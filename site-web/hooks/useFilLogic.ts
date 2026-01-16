import React, { useState, useEffect, useCallback, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import {
    getCurrentUser,
    getRecords,
    fetchAllChannels,
    createChannel,
    mapCategoryToEnum,
    archiveChannel,
    getChannelContent,
    addMessage,
    FilResponse,
    DossierResponse,
    MessageResponse
} from "@/functions/fil-API";

const categories = ["Santé", "Ménage", "Alimentation", "Maison", "Hygiène", "Autre"];

interface SockJSOptions extends SockJS.Options {
    withCredentials?: boolean;
}

export function useFilLogic() {

    // --- ÉTATS DES DONNÉES ---
    const [currentUserName, setCurrentUserName] = useState<string>("");
    const [records, setRecords] = useState<DossierResponse[]>([]);
    const [activeRecordId, setActiveRecordId] = useState<number | null>(null);
    const [channels, setChannels] = useState<FilResponse[]>([]);
    const [messages, setMessages] = useState<MessageResponse[]>([]);

    // --- ÉTATS UI ---
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState<FilResponse | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [channelToArchive, setChannelToArchive] = useState<FilResponse | null>(null);
    const stompClient = useRef<Client | null>(null);

    // --- ÉTAT FORMULAIRE ---
    const [formData, setFormData] = useState({
        category: mapCategoryToEnum("Santé"),
        title: "",
        message: ""
    });


    // 1. Initialisation (Utilisateur + Dossiers)
    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            const user = await getCurrentUser();
            if (user && isMounted) {
                setCurrentUserName(user);
                const userRecords = await getRecords(user);
                setRecords(userRecords);
                if (userRecords.length > 0) {
                    setActiveRecordId(userRecords[0].id);
                }
            }
        };
        init().then();
        return () => { isMounted = false; };
    }, []);

    // 2. Chargement des fils (Multi-catégories)
    const loadChannels = useCallback(async () => {
        if (!currentUserName || !activeRecordId) return;

        await Promise.resolve();
        setIsLoading(true);

        try {
            const data = await fetchAllChannels(currentUserName, activeRecordId, selectedCategories, categories);
            setChannels(data);
        } catch (error) {
            console.error("Erreur chargement fils:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentUserName, activeRecordId, selectedCategories]);

    useEffect(() => {
        loadChannels().then();
    }, [loadChannels]);

    // 3. Chargement des messages quand un fil est sélectionné
    useEffect(() => {
        let ignore = false;
        const loadMessages = async () => {
            if (selectedChannel && activeRecordId) {
                const content = await getChannelContent(currentUserName, activeRecordId, selectedChannel.id);
                if (!ignore) {
                    if (content && content.messages) setMessages(content.messages);
                    else setMessages([]);
                }
            }
        };
        loadMessages().then();
        return () => { ignore = true; };
    }, [selectedChannel, activeRecordId, currentUserName]);

    useEffect(() => {
        if (!selectedChannel) return;

        // Configuration du client STOMP
        const options: SockJSOptions = {
            sessionId: 10,
            transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
            withCredentials: true
        };

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws', null, options),
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            // S'abonner au topic diffusé par le ChannelController
            client.subscribe(`/topic/messages/${selectedChannel.id}`, (payload) => {
                const newMessage: MessageResponse = JSON.parse(payload.body);

                // --- FILTRE ANTI-DOUBLON ---
                setMessages((prev) => {
                    // On vérifie si le message (par son ID) est déjà dans la liste
                    const exists = prev.some(m => m.id === newMessage.id);
                    if (exists) return prev; // Si oui, on ne change rien
                    return [...prev, newMessage]; // Sinon, on l'ajoute
                });
            });
        };

        client.activate();
        stompClient.current = client;

        return () => {
            if (stompClient.current) stompClient.current.deactivate().then();
        };
    }, [selectedChannel]);

    // --- ACTIONS ---

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUserName || !activeRecordId) return;
        const success = await createChannel(currentUserName, activeRecordId, formData.title, formData.category, formData.message);
        if (success) {
            setIsOpen(false);
            setFormData({ category: mapCategoryToEnum("Santé"), title: "", message: "" });
            loadChannels().then();
        }
    };

    const handleSendChatMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChannel || !activeRecordId) return;

        const sentMsg = await addMessage(currentUserName, activeRecordId, selectedChannel.id, newMessage);
        if (sentMsg) {
            setNewMessage("");
        }
    };

    // Filtrage local (Recherche par titre)
    const filteredChannels = channels.filter(c =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const confirmArchive = async () => {
        if (!activeRecordId || !channelToArchive) return;

        const success = await archiveChannel(currentUserName, activeRecordId, channelToArchive.id);
        if (success) {
            setChannels(prev => prev.filter(ch => ch.id !== channelToArchive.id));
            setShowArchiveModal(false);
            setChannelToArchive(null);
        }
    };


    return {
        // Données & Listes
        categories, records, channels: filteredChannels, currentUserName, messages,channelToArchive,
        // Navigation & Filtres
        activeRecordId, setActiveRecordId, selectedCategories, toggleCategory,
        searchQuery, setSearchQuery, isLoading, selectedChannel, setSelectedChannel,setShowArchiveModal,setChannelToArchive,
        // Modale & Formulaire
        isOpen, setIsOpen, formData, setFormData, handleCreateSubmit,showArchiveModal,
        // Chat
        newMessage, setNewMessage, handleSendChatMessage,
        // Actions
        confirmArchive
    };
}