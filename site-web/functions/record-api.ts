import { API_BASE_URL } from "@/config";


export interface Record {
    recordName: string;
    userName: string;
}

export async function getRecordName(userName: string, recordId: string): Promise<Record | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userName}/records/${recordId}/name`, {
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
        console.error("Erreur getRecordName:", err);
    }
    return null;
}

