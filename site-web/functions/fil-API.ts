import { API_BASE_URL } from "@/config";

export const categories = ["Santé", "Ménage", "Alimentation", "Maison", "Hygiène", "Autre"];

export interface FilResponse {
    id: number;
    title: string;
    category: string;
    creationDate: string;
    lastMessage: string | null;
    lastMessageAuthor: string | null;
}

export interface DossierResponse {
    id: number;
    name: string;
}

export interface MessageResponse {
    id: number;
    content: string;
    date: string;
    authorTitle?: string;
    authorUserName?: string;
    isDeleted: boolean;
}

export interface ChannelContentResponse {
    id: number;
    title: string;
    category: string;
    messages: MessageResponse[];
}

export const mapCategoryToEnum = (cat: string): string => {
    switch (cat) {
        case "Santé": return "Sante";
        case "Ménage": return "Menage";
        case "Alimentation": return "Alimentation";
        case "Maison": return "Maisonterrain";
        case "Hygiène": return "Hygiene";
        case "Autre": return "Autres";
        default: return "Sante";
    }
};

export function capitalizeWords(str: string | undefined | null): string {
    if (!str) return "";

    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export async function getCurrentUser(): Promise<string> {
    const userName = localStorage.getItem('username');
    if (userName)
        return userName;
    else
        return "null";
}

export async function getCurrentUserId(): Promise<number | null> {
    const userId = localStorage.getItem('userId');

    if (userId) {
        return Number(userId);
    }

    return null;
}

export async function getRecords(userId: number): Promise<DossierResponse[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userId}/records/`, {
            credentials: 'include',
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
            return await response.json();
        }
    } catch (err) {
        console.log("Erreur records:", err);
    }
    return [];
}

export async function fetchAllChannels(
    userId: number | null,
    recordId: number,
    selectedCategories: string[],
    allAvailableCategories: string[]
): Promise<FilResponse[]> {

    const categoriesToFetch = selectedCategories.length === 0 ? allAvailableCategories : selectedCategories;

    try {
        const promises = categoriesToFetch.map(cat => getChannels(userId, recordId, cat));
        const results = await Promise.all(promises);
        const flatResults = results.flat();

        return flatResults.sort((a, b) =>
            new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );
    } catch (err) {
        console.log("Erreur fetchAllChannels:", err);
        return [];
    }
}

export async function getChannels(userId: number | null, recordId: number, category: string): Promise<FilResponse[]> {
    const categoryEnum = mapCategoryToEnum(category);
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userId}/records/${recordId}/channels/${categoryEnum}`, {
            credentials: 'include',
            cache: 'no-store'
        });

        if (response.status === 204) return [];

        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) return data;
            return data.opened_channels || [];
        }
    } catch (err) {
        console.log("Erreur channels:", err);
    }
    return [];
}

export async function getChannelContent(userId: number | null, recordId: number, channelId: number): Promise<ChannelContentResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userId}/records/${recordId}/channels/${channelId}/`, {
            credentials: 'include',
            cache: 'no-store'
        });
        if (response.ok) return await response.json();
    } catch (err) { console.log(err); }
    return null;
}

export async function getCloseChannels(userId: number | null, recordId: number, category: string): Promise<FilResponse[]> {
    const categoryEnum = mapCategoryToEnum(category);
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userId}/records/${recordId}/closechannels/${categoryEnum}`, {
            credentials: 'include',
            cache: 'no-store'
        });

        if (response.status === 204) return [];

        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) return data;
            return data.opened_channels || [];
        }
    } catch (err) {
        console.log("Erreur channels:", err);
    }
    return [];
}

export async function getLastWeekChannels(userId: number, recordId: number, category: string): Promise<FilResponse[]> {
    const categoryEnum = mapCategoryToEnum(category);
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userId}/records/${recordId}/channels/${categoryEnum}/week`, {
            credentials: 'include',
            cache: 'no-store'
        });

        if (response.status === 204) return [];

        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) return data;
            return data.opened_channels || [];
        }
    } catch (err) {
        console.error("Erreur channels:", err);
    }
    return [];
}


export async function createChannel(
    userId: number | null,
    recordId: number,
    title: string,
    category: string,
    message: string
): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userId}/records/${recordId}/channels/new`, {
            method: 'POST',
            credentials: 'include',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                category: category,
                firstMessage: message
            })
        });
        return response.ok;
    } catch (err) {
        console.log("Erreur lors de la création du fil:", err);
        return false;
    }
}

export async function archiveChannel(userId: number | null, recordId: number, channelId: number): Promise<boolean> {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/${userId}/records/${recordId}/channels/${channelId}/archive`,
            {
                method: "POST",
                credentials: "include",
                cache: 'no-store'
            }
        );
        return res.ok;
    } catch (err) {
        console.log("Erreur archivage:", err);
        return false;
    }
}

export async function addMessage(userId: number | null, recordId: number, channelId: number, content: string): Promise<MessageResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userId}/records/${recordId}/channels/${channelId}/messages`, {
            method: 'POST',
            credentials: 'include',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: content
        });
        if (response.ok) return await response.json();
    } catch (err) {
        console.log("Erreur envoi message:", err);
    }
    return null;
}

export async function deleteMessage(userId: number | null, recordId: number, channelId: number, messageId: number): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userId}/records/${recordId}/channels/${channelId}/messages/${messageId}/delete`, {
            method: 'DELETE',
            credentials: 'include',
            cache: 'no-store',
        });
        return response.ok;
    } catch (err) {
        console.log("Erreur suppression message:", err);
    }
    return false;
}

export async function updateMessage(userId: number | null, recordId: number, channelId: number, messageId: number, content: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userId}/records/${recordId}/channels/${channelId}/messages/${messageId}/update`, {
            method: 'PUT',
            credentials: 'include',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: content
        });
        return response.ok;
    } catch (err) {
        console.log("Erreur modification message:", err);
        return false;
    }
}

export async function fetchAllCloseChannels(
    userId: number | null,
    recordId: number,
    selectedCategories: string[],
    allAvailableCategories: string[]
): Promise<FilResponse[]> {

    const categoriesToFetch = selectedCategories.length === 0 ? allAvailableCategories : selectedCategories;

    try {
        const promises = categoriesToFetch.map(cat => getCloseChannels(userId, recordId, cat));
        const results = await Promise.all(promises);
        const flatResults = results.flat();

        return flatResults.sort((a, b) =>
            new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );
    } catch (err) {
        console.error("Erreur fetchAllCloseChannels:", err);
        return [];
    }
}

export async function getCloseChannelContent(userId: number | null, recordId: number, channelId: number): Promise<ChannelContentResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userId}/records/${recordId}/closechannels/${channelId}/`, {
            credentials: 'include',
            cache: 'no-store'
        });
        if (response.ok) return await response.json();
    } catch (err) {
        console.error("Erreur getCloseChannelContent:", err);
    }
    return null;
}