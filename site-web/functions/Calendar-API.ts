import FullCalendar from "@fullcalendar/react";
import {RefObject} from "react";
import { API_BASE_URL } from "@/config";

export async function getEventsRequest(userId: number | null, activeRecordId: number | null, start: string, end: string) {
    return await fetch(
        `${API_BASE_URL}/api/${userId}/records/${activeRecordId}/calendar/startDate/${start}/endDate/${end}`, {
            credentials: 'include'
        }
    );
}

export async function saveEditsRequest(userId: number | null, activeRecordId: number | null, isCreating: boolean, editData: any, calendarRef: RefObject<FullCalendar | null>) {
    const response = await fetch(`${API_BASE_URL}/api/${userId}/records/${activeRecordId}/calendar/event` + (isCreating ? "" : `/${editData.id}`), {
        method: isCreating ? "POST" : "PUT",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(editData)
    });
    
    if (response.ok && calendarRef)
        calendarRef.current?.getApi().refetchEvents();
}

export async function deleteEventRequest(userId: number | null, activeRecordId: number | null, eventId: string, calendarRef: RefObject<FullCalendar | null>) {
    const response = await fetch(`${API_BASE_URL}/api/${userId}/records/${activeRecordId}/calendar/event/${eventId}`, {
        method: "DELETE",
        credentials: 'include',
    });

    if (response.ok) {
        calendarRef.current?.getApi().refetchEvents();
    }
}