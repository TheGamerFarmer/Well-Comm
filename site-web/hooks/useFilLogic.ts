import React, {useCallback, useEffect, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import {
    addMessage,
    archiveChannel,
    categories,
    createChannel,
    deleteMessage,
    DossierResponse,
    fetchAllChannels,
    FilResponse,
    getChannelContent,
    getCurrentUser,
    getCurrentUserId,
    getRecords,
    mapCategoryToEnum,
    MessageResponse,
    updateMessage
} from "@/functions/fil-API";

interface SockJSOptions extends SockJS.Options {
    withCredentials?: boolean;
}

export function useFilLogic() {
    // profil
    const [currentUserName, setCurrentUserName] = useState<string>("");
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
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
            const user = await getCurrentUserId();
            if (user && isMounted) {
                setCurrentUserId(user);
                const userRecords = await getRecords(user);
                setRecords(userRecords);
            }
            const userName = await getCurrentUser();
            if (userName && isMounted) {
                setCurrentUserName(userName);
            }
        };
        init().then();
        return () => { isMounted = false; };
    }, []);

    const loadChannels = useCallback(async () => {
        if (!currentUserId || !activeRecordId) return;

        await Promise.resolve();
        setIsLoading(true);

        try {
            const data = await fetchAllChannels(currentUserId, activeRecordId, selectedCategories, categories);
            setChannels(data);
        } catch (error) {
            console.log("Erreur chargement fils:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentUserId, activeRecordId, selectedCategories]);

    useEffect(() => {
        loadChannels().then();
    }, [loadChannels]);

    useEffect(() => {
        let ignore = false;
        const loadMessages = async () => {
            if (selectedChannel && activeRecordId) {
                const content = await getChannelContent(currentUserId, activeRecordId, selectedChannel.id);
                if (!ignore) {
                    if (content && content.messages) {
                        setMessages(content.messages);
                    } else {
                        setMessages([]);
                    }
                }
            }
        };
        loadMessages().then();
        return () => { ignore = true; };
    }, [selectedChannel, activeRecordId, currentUserId]);

    useEffect(() => {
        if (!selectedChannel) return;

        const options: SockJSOptions = {
            sessionId: 10,
            transports: ['websocket'],
            withCredentials: true
        };

        const client = new Client({
            webSocketFactory: () => new SockJS('https://152.77.90.131/ws', null, options),
            reconnectDelay: 5000,
        });

        client.onConnect = () => {

            client.subscribe(`/topic/messages/${selectedChannel.id}`, (payload) => {
                const data = JSON.parse(payload.body);

                if (data.type === 'UPDATE') {
                    setMessages((prev) => {
                        return prev.map(m =>
                            m.id === data.id
                                ? {
                                    ...m,
                                    content: data.content,
                                }
                                : m
                        );
                    });
                }
                else if (data.type === 'DELETE') {
                    setMessages((prev) => {
                        return prev.map(m =>
                            m.id === data.id
                                ? {
                                    ...m,
                                    content: data.content,
                                    isDeleted: true
                                }
                                : m
                        );
                    });
                }
                else if (data.id) {
                    setMessages((prev) => {
                        if (prev.some(m => m.id === data.id)) {
                            return prev;
                        }
                        const newMsg: MessageResponse = {
                            id: data.id,
                            content: data.content,
                            date: data.date,
                            authorTitle: data.authorTitle,
                            authorUserName: data.authorUserName,
                            isDeleted: data.isDeleted || false
                        };
                        return [...prev, newMsg];
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
        if (!currentUserId || !activeRecordId) return;
        const success = await createChannel(currentUserId, activeRecordId, formData.title, formData.category, formData.message);
        if (success) {
            setIsOpen(false);
            setFormData({ category: mapCategoryToEnum("Santé"), title: "", message: "" });
            loadChannels().then();
        }
    };

    const handleSendChatMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChannel || !activeRecordId) return;

        const sentMsg = await addMessage(currentUserId, activeRecordId, selectedChannel.id, newMessage);
        if (sentMsg) {
            setNewMessage("");
        }
    };

    const handleDeleteChatMessage = async (messageId: number | null) => {
        if (!selectedChannel || !activeRecordId || messageId==null) return;
        await deleteMessage(currentUserId, activeRecordId, selectedChannel.id, messageId);
    };

    const handleSaveEdit = async (id: number) => {
        if (!editingContent.trim() || !selectedChannel || !activeRecordId) return;
        const success = await updateMessage(currentUserId, activeRecordId, selectedChannel.id, id, editingContent);
        if (success) setEditingMessageId(null);
    };

    const filteredChannels = channels.filter(c =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const confirmArchive = async () => {
        if (!activeRecordId || !channelToArchive) return;

        const success = await archiveChannel(currentUserId, activeRecordId, channelToArchive.id);
        if (success) {
            setChannels(prev => prev.filter(ch => ch.id !== channelToArchive.id));
            setShowArchiveModal(false);
            setChannelToArchive(null);
        }
    };


    return {
        // profil
        currentUserName,currentUserId,
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
