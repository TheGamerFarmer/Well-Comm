// noinspection CssUnusedSymbol

'use client';

import React, {useEffect, useState, useRef, useCallback} from 'react';
import FullCalendar from '@fullcalendar/react';
import { HexColorPicker } from "react-colorful";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from "@/components/ButtonMain";
import {getCurrentUser} from "@/functions/fil-API";
import {DateSelectArg, EventClickArg} from "@fullcalendar/core";

interface MyEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    location?: string;
    description?: string;
    color: string;
}

export default function FramagendaView() {
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isOpen, toggleOpen] = useState(false);
    const popover = useRef<HTMLDivElement>(null);
    let calendarViewState = "timeGridWeek";

    const PRESET_COLORS = [
        "#FF0000", "#FF7F00", "#FFD700", "#00FF00",
        "#00FFFF", "#007FFF", "#0000FF", "#7F00FF",
        "#FF00FF", "#FF1493", "#ADFF2F", "#00FA9A"
    ];

    const [userName, setUserName] = useState<string | null>(null);

    const hasPermission = true;

    const calendarRef = useRef<FullCalendar>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;

            if (isOpen) {
                if (popover.current && !popover.current.contains(target)) {
                    toggleOpen(false);
                    return;
                }
            }

            if (!isOpen && selectedEvent) {
                if (target instanceof HTMLElement && target.id === "modal-overlay") {
                    setSelectedEvent(null);
                    setIsEditing(false);
                    setIsCreating(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, selectedEvent, isEditing, isCreating]);

    useEffect(() => {
        getCurrentUser().then(setUserName);
    }, []);

    const fetchEvents = useCallback(async (fetchInfo: { start: Date; end: Date }, successCallback: (events: MyEvent[]) => void, failureCallback: (error: Error) => void) => {
        if (!userName) {
            successCallback([]);
            return;
        }

        const start = fetchInfo.start.toISOString().split('.')[0];
        const end = fetchInfo.end.toISOString().split('.')[0];

        const response = await fetch(
            `http://localhost:8080/api/${userName}/records/10/calendar/startDate/${start}/endDate/${end}`, {
                credentials: 'include'
            }
        );

        if (!response.ok) {
            failureCallback(new Error())
            return;
        }

        const data = await response.json();
        successCallback(data);
    }, [userName]);

    const handleSelect = (selectInfo: DateSelectArg) => {
        const newEvent: MyEvent = {
            id: "",
            title: "",
            start: selectInfo.startStr.split('+')[0].split('Z')[0],
            end: selectInfo.endStr.split('+')[0].split('Z')[0],
            location: "",
            description: "",
            color: "#0551ab", // Couleur par défaut
        };

        setSelectedEvent(newEvent);
        setEditData(newEvent);
        setIsEditing(true);
        setIsCreating(true); // On active le mode création
    };

    const handleEventChange = async (changeInfo: EventClickArg) => {
        if (!hasPermission) return;

        const updatedEvent = {
            id: changeInfo.event.id,
            title: changeInfo.event.title,
            start: changeInfo.event.startStr.split('+')[0].split('Z')[0],
            end: changeInfo.event.endStr.split('+')[0].split('Z')[0],
            ...changeInfo.event.extendedProps
        };

        const response = await fetch(`http://localhost:8080/api/${userName}/records/10/calendar`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(updatedEvent)
        });

        if (response.ok) {
            calendarRef.current?.getApi().refetchEvents();
        }
    };

    const handleEventClick = (info: EventClickArg) => {
        const eventData: MyEvent = {
            id: info.event.id,
            title: info.event.title,
            start: info.event.startStr.split('+')[0].split('Z')[0],
            end: info.event.endStr.split('+')[0].split('Z')[0],
            color: info.event.backgroundColor,
            location: info.event.extendedProps.location || "",
            description: info.event.extendedProps.description || "",
        };

        setSelectedEvent(eventData);
        setEditData(eventData);
        setIsEditing(false);
    };

    const saveEdits = async () => {
        if (!editData || !userName)
            return;

        setIsEditing(false);
        setIsCreating(false);
        setSelectedEvent(null);

        const response = await fetch(`http://localhost:8080/api/${userName}/records/10/calendar/event` + (isCreating ? "" : `/${editData.id}`), {
            method: isCreating ? "POST" : "PUT",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(editData)
        });

        if (response.ok) {
            calendarRef.current?.getApi().refetchEvents();
        }
    }

    const deleteEvent = async () => {
        setIsEditing(false)
        setEditData(null);

        const response = await fetch(`http://localhost:8080/api/${userName}/records/10/calendar/event/${editData.id}`, {
            method: "DELETE",
            credentials: 'include',
        });

        if (response.ok) {
            calendarRef.current?.getApi().refetchEvents();
        }
    }

    const formatDisplayTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="h-screen p-4 bg-white rounded-2xl">
            <FullCalendar
                key={userName}
                ref={calendarRef}
                events={fetchEvents}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={typeof window !== 'undefined' && window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek'}

                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}

                buttonText={{
                    today: "Aujourd'hui",
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour",
                    list: "Liste"
                }}

                windowResize={(arg) => {
                    if (arg.view.type !== "timeGridDay")
                        calendarViewState = arg.view.type;

                    const newView = window.innerWidth < 768 ? 'timeGridDay' : calendarViewState;

                    if (arg.view.type !== newView)
                        arg.view.calendar.changeView(newView);
                }}

                firstDay={1}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"

                selectable={hasPermission}
                select={handleSelect as any}

                // --- CONFIGURATION MODIFICATION ---
                editable={hasPermission} // Active le drag&drop et resize seulement si autorisé
                eventStartEditable={hasPermission}
                eventDurationEditable={hasPermission}
                eventDrop={handleEventChange}   // Appelé après un glisser-déposer
                eventResize={handleEventChange} // Appelé après avoir étiré l'évènement

                eventClick={handleEventClick}
                locale="fr"
                height="100%"
                allDaySlot={true}
                allDayText="Jour"
                nowIndicator={true}
                handleWindowResize={true}
            />

            <style jsx global>{`
                .fc .fc-button-primary {
                    background-color: #0551ab !important;
                    border-color: #0551ab !important;
                    color: #ffffff !important;
                    text-transform: capitalize;
                    font-weight: bold;
                    border-radius: 8px;
                }

                .fc .fc-button-primary:not(:disabled):hover {
                    background-color: #ffffff !important;
                    color: #0551ab !important;
                }
                
                .fc-event {
                    cursor: pointer;
                }

                .fc-event-draggable {
                    cursor: grab !important;
                }
                .fc-event-draggable:active {
                    cursor: grabbing !important;
                }
                
            `}</style>

            {selectedEvent && editData && (
                <div id="modal-overlay" className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-250 h-full max-h-175 overflow-hidden transform transition-all flex flex-col border border-gray-200">

                        <div className="p-6 border-b border-gray-100 flex flex-col" style={{ borderLeft: `16px solid ${editData.color}` }}>
                            {isEditing ? (
                                <div className="space-y-4">
                                    <input
                                        className="text-2xl font-black w-full border-b-4 border-black outline-none bg-gray-50 text-[#0551ab]"
                                        placeholder="Titre de l'événement"
                                        value={editData.title}
                                        onChange={(e) => setEditData({...editData, title: e.target.value})}
                                    />
                                    <div className="flex flex-wrap gap-4 items-center text-sm">
                                        <input type="datetime-local" className="border p-1 rounded" value={editData.start} onChange={(e) => setEditData({...editData, start: e.target.value})} />
                                        <span>au</span>
                                        <input type="datetime-local" className="border p-1 rounded" value={editData.end} onChange={(e) => setEditData({...editData, end: e.target.value})} />
                                        <div
                                            className="w-10 h-10 cursor-pointer border-1 border-gray-200 shadow-md transition-transform hover:scale-110"
                                            style={{ backgroundColor: editData.color }}
                                            onClick={() => toggleOpen(true)}
                                        />

                                        {isOpen && (
                                            <div className="absolute z-[100] mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 w-64" ref={popover}>
                                                <HexColorPicker
                                                    color={editData.color}
                                                    onChange={(c) => setEditData({...editData, color: c})}
                                                />

                                                <div className="mt-4 grid grid-cols-6 gap-2">
                                                    {PRESET_COLORS.map((c) => (
                                                        <button
                                                            key={c}
                                                            className="w-6 h-6 border border-gray-200 transition-transform hover:scale-125"
                                                            style={{ backgroundColor: c }}
                                                            onClick={() => setEditData({...editData, color: c})}
                                                        />
                                                    ))}
                                                </div>

                                                <input
                                                    className="mt-4 w-full text-center font-mono text-xs p-1 bg-gray-50 rounded border uppercase"
                                                    value={editData.color}
                                                    onChange={(e) => setEditData({...editData, color: e.target.value})}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-black text-[#0551ab] leading-tight">
                                        {selectedEvent.title || "(Sans titre)"}
                                    </h3>
                                    <p className="text-l text-gray-600 mt-2 font-medium">
                                    🕒 {formatDisplayTime(selectedEvent.start)} — {formatDisplayTime(selectedEvent.end)}
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Corps Modale */}
                        <div className="p-10 space-y-10 flex-1 overflow-y-auto">
                            <div>
                                <label className="text-xl font-bold uppercase text-[#0551ab] block mb-4">
                                    Description
                                </label>
                                {isEditing ? (
                                    <textarea
                                        className="w-full text-l border-4 border-gray-100 rounded-2xl p-6 min-h-[200px] outline-none focus:border-black"
                                        placeholder="Description de l'événement"
                                        value={editData.description}
                                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                                    />
                                ) : (
                                    <p className="text-l text-black leading-relaxed whitespace-pre-line font-medium">
                                        {selectedEvent.description || "Aucune description fournie."}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label className="text-xl font-bold uppercase text-[#0551ab] block mb-4">
                                    Lieu
                                </label>
                                {isEditing ? (
                                    <input
                                        className="w-full text-l font-black border-b-4 border-gray-100 outline-none focus:border-black"
                                        placeholder="Lieu de l'événement"
                                        value={editData.location}
                                        onChange={(e) => setEditData({...editData, location: e.target.value})}
                                    />
                                ) : (
                                    <p className="text-l text-black">
                                        {selectedEvent.location || "Non spécifié"}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="p-6 flex justify-between items-center mt-auto">
                            <div className="flex gap-6">
                                {hasPermission && !isEditing && !isCreating && (
                                    <Button variant="primary" onClickAction={() => setIsEditing(true)}>
                                        Modifier
                                    </Button>
                                )}
                                {isEditing && (
                                    <Button variant="validate" onClickAction={() => saveEdits()}>
                                        Enregistrer
                                    </Button>
                                )}
                                {hasPermission && !isCreating && (
                                    <Button variant="cancel" onClickAction={() => deleteEvent()}>
                                        Supprimer
                                    </Button>
                                )}
                            </div>

                            <Button variant="cancel" onClickAction={() => {
                                        if (!isEditing || isCreating)
                                            setSelectedEvent(null);
                                        setIsEditing(false);
                                        setIsCreating(false)}}>
                                {isEditing ? "ANNULER" : "FERMER"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}