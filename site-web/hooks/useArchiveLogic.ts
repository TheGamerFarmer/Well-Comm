import { useState, useEffect, useCallback } from "react";
import {
    getCurrentUser,
    getRecords,
    fetchAllCloseChannels,
    getCloseChannelContent,
    FilResponse,
    DossierResponse,
    MessageResponse,
    categories
} from "@/functions/fil-API";

export function useArchiveLogic() {

    // profil
    const [currentUserName, setCurrentUserName] = useState<string>("");

    // record & channel
    const [records, setRecords] = useState<DossierResponse[]>([]);
    const [activeRecordId, setActiveRecordId] = useState<number | null>(null);
    const [channels, setChannels] = useState<FilResponse[]>([]);

    // messages
    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<FilResponse | null>(null);

    // filter & search
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
            const data = await fetchAllCloseChannels(currentUserName, activeRecordId, selectedCategories, categories);
            setChannels(data);
        } catch (error) {
            console.error("Erreur chargement archives:", error);
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
                const content = await getCloseChannelContent(currentUserName, activeRecordId, selectedChannel.id);
                if (!ignore) {
                    if (content && content.messages) setMessages(content.messages);
                    else setMessages([]);
                }
            }
        };
        loadMessages().then();
        return () => { ignore = true; };
    }, [selectedChannel, activeRecordId, currentUserName]);

    const toggleCategory = useCallback((category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    }, []);

    const filteredChannels = channels.filter(c =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        // profil
        currentUserName,
        // record & channel
        records, activeRecordId, setActiveRecordId, channels: filteredChannels, categories,
        // messages
        messages, selectedChannel, setSelectedChannel,
        // filter & search
        selectedCategories, toggleCategory, searchQuery, setSearchQuery, isLoading,
    };
}