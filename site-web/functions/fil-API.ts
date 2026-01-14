/**
 * Logique de communication avec le backend pour les fils de transmission
 */

import { API_BASE_URL } from "@/config";

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

export async function getCurrentUser(): Promise<string | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/me`, {
            credentials: 'include',
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

export async function getChannels(userName: string, recordId: number, category: string): Promise<FilResponse[]> {
    const categoryEnum = mapCategoryToEnum(category);
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userName}/records/${recordId}/channels/${categoryEnum}`, {
            credentials: 'include'
        });

        if (response.status === 204) return [];

        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) return data;
            return data.opened_channel || data.opened_channels || data.openedChannels || [];
        }
    } catch (err) {
        console.error("Erreur channels:", err);
    }
    return [];
}

export async function getCloseChannels(userName: string, recordId: number, category: string): Promise<FilResponse[]> {
    const categoryEnum = mapCategoryToEnum(category);
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userName}/records/${recordId}/closechannels/${categoryEnum}`, {
            credentials: 'include'
        });

        if (response.status === 204) return [];

        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) return data;
            return data.opened_channel || data.opened_channels || data.openedChannels || [];
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                category: category, // Déjà mappé en Enum par le composant
                firstMessage: message
            })
        });
        return response.ok;
    } catch (err) {
        console.error("Erreur lors de la création du fil:", err);
        return false;
    }
}