import { API_BASE_URL } from "@/config";

export interface UserProfile {
    userName: string;
    firstName: string;
    lastName: string;
}

export async function getUserProfile(userName: string): Promise<UserProfile | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userName}/infos`, {
            credentials: "include",
            cache: "no-store",
        });

        console.log("Response status:", response.status);

        if (response.ok) {
            const data = await response.json();
            console.log("Data:", data);
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
    userName: string,
    currentPassword: string,
    newPassword: string
): Promise<boolean> {
    try {

        const url = `${API_BASE_URL}/api/${userName}/changePassword`;
        console.log("FETCH URL =", url);
        const res = await fetch(url, {
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

export async function changeUserInfos(
    userName: string,
    newUserName: string,
    firstName: string,
    lastName: string
): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/${userName}/changeUserInfos`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
            "Content-Type": "application/json",
        },
            body: JSON.stringify({
                userName: newUserName,
                firstName,
                lastName,
            }),
        }
    );

        if (res.ok) {
            return true;
        } else {
            const text = await res.text();
            alert("Erreur: " + text);
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}