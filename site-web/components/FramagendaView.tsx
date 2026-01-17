'use client';

import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventSourceInput, EventClickArg } from '@fullcalendar/core';
import { Button } from "@/components/ButtonMain";

interface MyEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    location?: string;
    description?: string;
    color: string;
}

export default function FramagendaView() {
    const [events, setEvents] = useState<MyEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    let calendarViewState = "timeGridWeek";

    // Variable de permission (à lier à ton auth)
    const hasPermission = true;

    const calendarRef = useRef<any>(null);

    const loadData = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/TheGamerFarmer/records/5/calendar', {
                method: "GET",
                credentials: 'include',
                cache: 'no-store'
            });
            const data: MyEvent[] = await response.json();
            const formatted = data.map(evt => ({
                ...evt,
                start: formatIcsDate(evt.start),
                end: formatIcsDate(evt.end),
                location: evt.location,
                description: evt.description,
                color: evt.color,
            }));
            setEvents(formatted);
        } catch (error) {
            console.error("Erreur de fetch :", error);
        }
    };

    const formatIcsDate = (icsDate: string) => {
        if (!icsDate || icsDate.includes("-")) return icsDate;
        return icsDate.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}).*$/, "$1-$2-$3T$4:$5:$6");
    };

    useEffect(() => { loadData().then(); }, []);

    const handleEventChange = async (changeInfo: any) => {
        if (!hasPermission) return;

        const updatedEvent = {
            id: changeInfo.event.id,
            title: changeInfo.event.title,
            start: changeInfo.event.startStr,
            end: changeInfo.event.endStr,
            ...changeInfo.event.extendedProps
        };

        const response = await fetch(`http://localhost:8080/api/TheGamerFarmer/records/5/calendar`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(updatedEvent)
        });

        if (response.ok) {
            await loadData();
        }
    };

    const handleEventClick = (info: EventClickArg) => {
        const eventData = {
            id: info.event.id,
            title: info.event.title,
            start: info.event.start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            end: info.event.end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color: info.event.backgroundColor,
            ...info.event.extendedProps
        };
        setSelectedEvent(eventData);
        setEditData(eventData);
        setIsEditing(false); // Toujours en lecture seule au clic
    };

    const syncEvent = async (event: MyEvent) => {
        try {
            const response = await fetch(`http://localhost:8080/api/TheGamerFarmer/records/5/calendar`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(event)
            });

            if (response.ok) {
                await loadData();
            }
        } catch (error) {
            console.error("Erreur de synchro :", error);
        }
    };

    const saveEdits = async () => {
        await syncEvent(editData);
        setIsEditing(false)
        setEditData(null);
    }

    const deleteEvent = async () => {
        const response = await fetch(`http://localhost:8080/api/TheGamerFarmer/records/5/calendar`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(editData)
        });

        if (response.ok) {
            setIsEditing(false)
            setEditData(null);
        }
    }

    return (
        <div className="h-screen p-4 bg-white rounded-2xl">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={typeof window !== 'undefined' && window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek'}

                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}

                buttonText={{
                    today:    "Aujourd'hui",
                    month:    "Mois",
                    week:     "Semaine",
                    day:      "Jour",
                    list:     "Liste"
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

                // --- CONFIGURATION MODIFICATION ---
                editable={hasPermission} // Active le drag&drop et resize seulement si autorisé
                eventStartEditable={hasPermission}
                eventDurationEditable={hasPermission}
                eventDrop={handleEventChange}   // Appelé après un glisser-déposer
                eventResize={handleEventChange} // Appelé après avoir étiré l'évènement

                events={events as EventSourceInput}
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

            {selectedEvent && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-250 h-full max-h-175 overflow-hidden transform transition-all flex flex-col border border-gray-200">

                        <div className="p-10 border-b border-gray-100 flex flex-col" style={{ borderLeft: `16px solid ${selectedEvent.color}` }}>
                            {isEditing ? (
                                <input
                                    className="text-2xl font-black w-full border-b-4 border-black outline-none bg-gray-50 text-[#0551ab]"
                                    value={editData.title}
                                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                                />
                            ) : (
                                <h3 className="text-2xl font-black text-[#0551ab] leading-tight">
                                    {selectedEvent.title}
                                </h3>
                            )}
                            <p className="text-l text-gray-600 mt-2 font-medium">
                                🕒 {selectedEvent.start} — {selectedEvent.end}
                            </p>
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
                                {hasPermission && !isEditing && (
                                    <Button variant="primary" onClickAction={() => setIsEditing(true)}>
                                        Modifier
                                    </Button>
                                )}
                                {isEditing && (
                                    <Button variant="validate" onClickAction={() => saveEdits()}>
                                        Enregistrer
                                    </Button>
                                )}
                                {hasPermission && (
                                    <Button variant="cancel" onClickAction={() => deleteEvent()}>
                                        Supprimer
                                    </Button>
                                )}
                            </div>

                            <Button variant="cancel" onClickAction={() => { if (!isEditing) setSelectedEvent(null); setIsEditing(false); }}>
                                {isEditing ? "ANNULER" : "FERMER"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}