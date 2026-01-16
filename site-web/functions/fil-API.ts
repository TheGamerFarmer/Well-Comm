/**
 * Logique de communication avec le backend pour les fils de transmission
 */

import { API_BASE_URL } from "@/config";
import {Permission} from "@/app/fil/page";

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

export async function getCurrentUser(): Promise<string | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/me`, {
            credentials: 'include',
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
            const data = await response.json();
            return data.userName;
        }
    } catch (err) {
        console.error("Erreur identification:", err);
    }
    return null;
}

export async function getRecords(userName: string): Promise<DossierResponse[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userName}/records/`, {
            credentials: 'include',
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
            return await response.json();
        }
    } catch (err) {
        console.error("Erreur records:", err);
    }
    return [];
}

export async function fetchAllChannels(
    userName: string,
    recordId: number,
    selectedCategories: string[],
    allAvailableCategories: string[]
): Promise<FilResponse[]> {

    const categoriesToFetch = selectedCategories.length === 0 ? allAvailableCategories : selectedCategories;

    try {
        const promises = categoriesToFetch.map(cat => getChannels(userName, recordId, cat));
        const results = await Promise.all(promises);
        const flatResults = results.flat();

        return flatResults.sort((a, b) =>
            new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );
    } catch (err) {
        console.error("Erreur fetchAllChannels:", err);
        return [];
    }
}

export async function getChannels(userName: string, recordId: number, category: string): Promise<FilResponse[]> {
    const categoryEnum = mapCategoryToEnum(category);
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userName}/records/${recordId}/channels/${categoryEnum}`, {
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

export async function getChannelContent(userName: string, recordId: number, channelId: number): Promise<ChannelContentResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userName}/records/${recordId}/channels/${channelId}/`, {
            credentials: 'include',
            cache: 'no-store'
        });
        if (response.ok) return await response.json();
    } catch (err) { console.error(err); }
    return null;
}

export async function getCloseChannels(userName: string, recordId: number, category: string): Promise<FilResponse[]> {
    const categoryEnum = mapCategoryToEnum(category);
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userName}/records/${recordId}/closechannels/${categoryEnum}`, {
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
    userName: string,
    recordId: number,
    title: string,
    category: string,
    message: string
): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userName}/records/${recordId}/channels/new`, {
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
        console.error("Erreur lors de la création du fil:", err);
        return false;
    }
}

export async function archiveChannel(userName: string, recordId: number, channelId: number): Promise<boolean> {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/${userName}/records/${recordId}/channels/${channelId}/archive`,
            {
                method: "POST",
                credentials: "include",
                cache: 'no-store'
            }
        );
        return res.ok;
    } catch (err) {
        console.error("Erreur archivage:", err);
        return false;
    }
}

export async function addMessage(userName: string, recordId: number, channelId: number, content: string): Promise<MessageResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userName}/records/${recordId}/channels/${channelId}/messages`, {
            method: 'POST',
            credentials: 'include',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: content
        });
        if (response.ok) return await response.json();
    } catch (err) {
        console.error("Erreur envoi message:", err);
    }
    return null;
}

export async function getPermissions(userName: string, recordId: number): Promise<Permission[]> {
    if (!userName || !recordId) return [];

    try {
        const res = await fetch(
            `${API_BASE_URL}/api/${userName}/recordsaccount/${recordId}/permissions`,
            {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            }
        );

        if (!res.ok) {
            console.error("Erreur HTTP:", res.status);
            return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : data.permissions ?? [];
    } catch (err) {
        console.error("Erreur permissions:", err);
        return [];
    }
}
