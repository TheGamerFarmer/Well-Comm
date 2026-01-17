import { API_BASE_URL } from "@/config";

export interface UserProfile {
    userName: string;
    firstName: string;
    lastName: string;
}

export async function getUserProfile(): Promise<UserProfile | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/profile`, {
            credentials: "include",
        });

        console.log("Response status:", response.status); // <- добавлено

        if (response.ok) {
            const data = await response.json();
            console.log("Data:", data); // <- добавлено
            return data;
        } else {
            console.error("Failed to fetch profile:", response.status);
        }
    } catch (err) {
        console.error("Erreur getUserProfile:", err);
    }
    return null;
}

