import FullCalendar from "@fullcalendar/react";
import {RefObject} from "react";

export async function getEventsRequest(userName: string | null, activeRecordId: number | null, start: string, end: string) {
    return await fetch(
        `http://localhost:8080/api/${userName}/records/${activeRecordId}/calendar/startDate/${start}/endDate/${end}`, {
            credentials: 'include'
        }
    );
}

export async function saveEditsRequest(userName: string | null, activeRecordId: number | null, isCreating: boolean, editData: any, calendarRef: RefObject<FullCalendar | null>) {
    const response = await fetch(`http://localhost:8080/api/${userName}/records/${activeRecordId}/calendar/event` + (isCreating ? "" : `/${editData.id}`), {
        method: isCreating ? "POST" : "PUT",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(editData)
    });
    
    if (response.ok && calendarRef)
        calendarRef.current?.getApi().refetchEvents();
}

export async function deleteEventRequest(userName: string | null, activeRecordId: number | null, eventId: string, calendarRef: RefObject<FullCalendar | null>) {
    const response = await fetch(`http://localhost:8080/api/${userName}/records/${activeRecordId}/calendar/event/${eventId}`, {
        method: "DELETE",
        credentials: 'include',
    });

    if (response.ok) {
        calendarRef.current?.getApi().refetchEvents();
    }
}