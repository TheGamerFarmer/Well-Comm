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
    deleteMessage,
    FilResponse,
    DossierResponse,
    MessageResponse,
    updateMessage,
    categories
} from "@/functions/fil-API";

interface SockJSOptions extends SockJS.Options {
    withCredentials?: boolean;
}

export function useFilLogic() {
    // profil
    const [currentUserName, setCurrentUserName] = useState<string>("");
    // record & channel
    const [records, setRecords] = useState<DossierResponse[]>([]);
    const [activeRecordId, setActiveRecordId] = useState<number | null>(null);
    const [channels, setChannels] = useState<FilResponse[]>([]);
    // messages
    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<FilResponse | null>(null);
    const stompClient = useRef<Client | null>(null);
    // filter & search
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // channel creation
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        category: mapCategoryToEnum("Santé"),
        title: "",
        message: ""
    });
    // send message
    const [newMessage, setNewMessage] = useState("");
    // edit message
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState("");
    // archiving
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [channelToArchive, setChannelToArchive] = useState<FilResponse | null>(null);
    // delete message
    const [showDeleteMessageModal, setShowDeleteMessageModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            const user = await getCurrentUser();
            if (user && isMounted) {
                setCurrentUserName(user);
                const userRecords = await getRecords(user);
                setRecords(userRecords);
            }
        };
        init().then();
        return () => { isMounted = false; };
    }, []);

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
            client.subscribe(`/topic/messages/${selectedChannel.id}`, (payload) => {
                const data = JSON.parse(payload.body);

                if (data.type === 'UPDATE' || data.type === 'DELETE') {
                    setMessages((prev) => prev.map(m =>
                        m.id === data.id || m.id === data.deletedMessageId
                            ? { ...m, content: data.content || "Ce message a été supprimé"}
                            : m
                    ));
                }
                else if (data.id) {
                    setMessages((prev) => {
                        if (prev.some(m => m.id === data.id)) return prev;
                        return [...prev, data];
                    });
                }
            });
        };

        client.activate();
        stompClient.current = client;

        return () => {
            if (stompClient.current) stompClient.current.deactivate().then();
        };
    }, [selectedChannel]);


    const toggleCategory = useCallback((category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    }, []);

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

    const handleDeleteChatMessage = async (messageId: number | null) => {
        if (!selectedChannel || !activeRecordId || messageId==null) return;

        const success = await deleteMessage(currentUserName, activeRecordId, selectedChannel.id, messageId);
        if (success) {
            console.log("Message envoyé pour suppression");
        }
    };

    const handleSaveEdit = async (id: number) => {
        if (!editingContent.trim() || !selectedChannel || !activeRecordId) return;
        const success = await updateMessage(currentUserName, activeRecordId, selectedChannel.id, id, editingContent);
        if (success) setEditingMessageId(null);
    };

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
        // profil
        currentUserName,
        // record & channel
        records, activeRecordId, setActiveRecordId, channels: filteredChannels, categories,
        // messages
        messages, selectedChannel, setSelectedChannel,
        // filter & search
        selectedCategories, toggleCategory, searchQuery, setSearchQuery, isLoading,
        // channel creation
        isOpen, setIsOpen, formData, setFormData, handleCreateSubmit,
        // send message
        newMessage, setNewMessage, handleSendChatMessage,
        // edit message
        editingMessageId, setEditingMessageId, editingContent, setEditingContent, handleSaveEdit,
        // archiving
        showArchiveModal, setShowArchiveModal, channelToArchive, setChannelToArchive, confirmArchive,
        // delete message
        showDeleteMessageModal, setShowDeleteMessageModal, messageToDelete, setMessageToDelete, handleDeleteChatMessage,
    };
}