import { API_BASE_URL } from "@/config";
import { fetchWithCert} from "@/functions/fetchWithCert";

export default async function logUser(userName: string, hashPassWord: string) : Promise<boolean | undefined> {
    try {
        const response = await fetchWithCert(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({
                userName: userName,
                password: hashPassWord,
            }),
        });

        return response.ok;
    } catch (err) {
        console.error(err);
    }
}