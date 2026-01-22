import { API_BASE_URL } from "@/config";


export async function getRecordName(userId: number, recordId: string): Promise<string | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${userId}/records/${recordId}/name`, {
            credentials: "include",
            cache: "no-store",
        });

        console.log("Response status:", response.status);

        if (response.ok) {
            const data = await response.text();
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


export async function changeRecordName(
    userId: number | null,
    recordId: string | null,
    newName: string
): Promise<boolean> {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/${userId}/records/${recordId}/${encodeURIComponent(newName)}`,
            {
                method: "PUT",
                credentials: "include",
            }
        );
        return res.ok;
    } catch (err) {
        console.error("Erreur changeRecordName:", err);
        return false;
    }
}
