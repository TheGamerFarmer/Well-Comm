import { API_BASE_URL } from "@/config";

export default async function logUser(userName: string, hashPassWord: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({
                userName: userName,
                password: hashPassWord,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, userId: data.id };
        } else {
            const errorText = await response.text();
            return { success: false, message: errorText };
        }
    } catch (err) {
        console.log(err);
        return { success: false, message: "Erreur de connexion au serveur" };
    }
}