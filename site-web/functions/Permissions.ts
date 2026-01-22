// noinspection JSUnusedGlobalSymbols

import { API_BASE_URL } from "@/config";

export enum Permission {
    IS_MEDECIN = "IS_MEDECIN",
    EDIT_CALENDAR = "EDIT_CALENDAR",
    ASSIGN_PERMISSIONS = "ASSIGN_PERMISSIONS",
    INVITE = "INVITE",
    SEND_MESSAGE = "SEND_MESSAGE",
    MODIFY_MESSAGE = "MODIFY_MESSAGE",
    DELETE_MESSAGE = "DELETE_MESSAGE",
    OPEN_CHANNEL = "OPEN_CHANNEL",
    CLOSE_CHANNEL = "CLOSE_CHANNEL",
    DELETE_RECORD = "DELETE_RECORD",
    SEE_CALENDAR = "SEE_CALENDAR",
}

export async function getPermissions(userId: number | null, recordId: number): Promise<Permission[]> {
    if (!userId || !recordId) return [];

    try {
        const res = await fetch(
            `${API_BASE_URL}/api/${userId}/records/${recordId}/permissions`,
            {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            }
        );

        if (!res.ok) {
            console.log("Erreur HTTP:", res.status);
            return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : data.permissions ?? [];
    } catch (err) {
        console.log("Erreur permissions:", err);
        return [];
    }
}