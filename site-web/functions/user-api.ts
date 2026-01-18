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

export async function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/changePassword`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        });

        if (res.ok) {
            return true;
        } else {
            const text = await res.text();
            alert("Erreur: " + text);
            return false;
        }
    } catch (err) {
        console.error(err);
        alert("Erreur réseau");
        return false;
    }
}

export async function deleteAccount(userName: string): Promise<boolean> {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/${userName}/deleteUser`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        return res.ok;
    } catch (e) {
        console.error(e);
        return false;
    }
}


