import {useCallback, useEffect, useRef, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import {getCurrentUser, getCurrentUserId} from "@/functions/fil-API";
import {DateSelectArg, EventClickArg} from "@fullcalendar/core";
import {deleteEventRequest, getEventsRequest, saveEditsRequest} from "@/functions/Calendar-API";
import {getPermissions, Permission} from "@/functions/Permissions";

export interface MyEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    location?: string;
    description?: string;
    color: string;
}

export function useCalendarLogic() {
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isColorPopupOpen, toggleColorPopupOpen] = useState(false);
    const colorPopup = useRef<HTMLDivElement>(null);
    const [calendarViewState, setCalendarViewState] = useState<string>("timeGridWeek");
    const [activeRecordId, setActiveRecordId] = useState<number>(0);
    const [hasEditPermission, setHasEditPermission] = useState<boolean | null>(null);

    const PRESET_COLORS = [
        "#FF0000", "#FF7F00", "#FFD700", "#00FF00",
        "#00FFFF", "#007FFF", "#0000FF", "#7F00FF",
        "#FF00FF", "#FF1493", "#ADFF2F", "#00FA9A"
    ];

    const [userName, setUserName] = useState<string>("null");
    const [userId, setUserId] = useState<number | null>(null);
    const calendarRef = useRef<FullCalendar>(null);

    useEffect(() => {
        const localRecordId = localStorage.getItem('activeRecordId');
        if (localRecordId) {
            const id = Number(localRecordId);
            if (!isNaN(id))
                setTimeout(() => {
                    setActiveRecordId(id);
                }, 0);
        }
    }, []);

    useEffect(() => {
        getPermissions(userId, activeRecordId)
            .then((permission: Permission[]) => {
                setHasEditPermission(permission.includes(Permission.EDIT_CALENDAR));
            })
    }, [userId, activeRecordId])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;

            if (isColorPopupOpen) {
                if (colorPopup.current && !colorPopup.current.contains(target)) {
                    toggleColorPopupOpen(false);
                    return;
                }
            }

            if (!isColorPopupOpen && selectedEvent) {
                if (target instanceof HTMLElement && target.id === "modal-overlay") {
                    setSelectedEvent(null);
                    setIsEditing(false);
                    setIsCreating(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isColorPopupOpen, selectedEvent, isEditing, isCreating]);

    useEffect(() => {
        getCurrentUser().then(setUserName);
        getCurrentUserId().then(setUserId);
    }, []);

    function handleSelect(selectInfo: DateSelectArg) {
        const newEvent: MyEvent = {
            id: "",
            title: "",
            start: selectInfo.startStr.split('+')[0].split('Z')[0],
            end: selectInfo.endStr.split('+')[0].split('Z')[0],
            location: "",
            description: "",
            color: "#0551ab",
        };

        setSelectedEvent(newEvent);
        setEditData(newEvent);
        setIsEditing(true);
        setIsCreating(true);
    }

    function handleEventClick (info: EventClickArg) {
        const eventData: MyEvent = {
            id: info.event.id,
            title: info.event.title,
            start: info.event.startStr.split('+')[0].split('Z')[0],
            end: info.event.endStr.split('+')[0].split('Z')[0],
            color: info.event.backgroundColor || "#0551ab",
            location: info.event.extendedProps.location || "",
            description: info.event.extendedProps.description || "",
        };

        setSelectedEvent(eventData);
        setEditData(eventData);
        setIsEditing(false);
    }

    function handleEventChange(changeInfo: EventClickArg) {
        if (!hasEditPermission)
            return;

        const updatedEvent = {
            id: changeInfo.event.id,
            title: changeInfo.event.title,
            start: changeInfo.event.startStr.split('+')[0].split('Z')[0],
            end: changeInfo.event.endStr.split('+')[0].split('Z')[0],
            ...changeInfo.event.extendedProps
        };

        saveEditsRequest(userId, activeRecordId, false, updatedEvent, calendarRef);
    }

    function formatDisplayTime (iso: string){
        return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function splitISO (isoString: string) {
        if (!isoString) return { date: '', time: '' };
        const [date, fullTime] = isoString.split('T');
        const time = fullTime ? fullTime.substring(0, 5) : '00:00';
        return { date, time };
    }

    function joinISO (date: string, time: string){
        return `${date}T${time}:00`;
    }

    async function fetchEvents(userId: number | null, activeRecordId: number, fetchInfo: { start: Date; end: Date }, successCallback: (events: MyEvent[]) => void, failureCallback: (error: Error) => void) : Promise<void> {
        if (!userId) {
            successCallback([]);
            return;
        }

        const start = fetchInfo.start.toISOString().split('.')[0];
        const end = fetchInfo.end.toISOString().split('.')[0];

        const response = await getEventsRequest(userId, activeRecordId, start, end)

        if (!response.ok) {
            failureCallback(new Error())
            return;
        }

        const data = await response.json();
        successCallback(data);
    }

    async function saveEdits () {
        if (!editData || !userId)
            return;

        setIsEditing(false);
        setIsCreating(false);
        setSelectedEvent(null);

        await saveEditsRequest(userId, activeRecordId, isCreating, editData, calendarRef);
    }

    async function deleteEvent() {
        setIsEditing(false)
        setEditData(null);

        await deleteEventRequest(userId, activeRecordId, editData.id, calendarRef);
    }

    const getEvents = useCallback((fetchInfo: { start: Date; end: Date }, successCallback: (events: MyEvent[]) => void, failureCallback: (error: Error) => void) => {
        fetchEvents(userId, activeRecordId, fetchInfo, successCallback, failureCallback).then();
    }, [userId, activeRecordId]);

    return {
        selectedEvent, setSelectedEvent,
        isEditing, setIsEditing,
        editData, setEditData,
        isCreating, setIsCreating,
        colorPopup, isColorPopupOpen, toggleColorPopupOpen, PRESET_COLORS,
        calendarViewState, setCalendarViewState,
        activeRecordId, setActiveRecordId,
        userName, setUserName,
        hasEditPermission,
        calendarRef,
        handleSelect, handleEventClick, handleEventChange,
        formatDisplayTime,
        splitISO,
        joinISO,
        getEvents, deleteEvent, saveEdits,
    }
}