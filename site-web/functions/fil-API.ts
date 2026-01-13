/**
 * Logique de communication avec le backend pour les fils de transmission
 */

const API_BASE_URL = "http://localhost:8080";

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
        const response = await fetch(`${API_BASE_URL}/api/accounts/me`, {
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
            // Support du format groupé si nécessaire
            return data.opened_channel || data.opened_channels || data.openedChannels || [];
        }
    } catch (err) {
        console.error("Erreur channels:", err);
    }
    return [];
}