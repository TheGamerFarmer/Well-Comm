'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventSourceInput, EventClickArg } from '@fullcalendar/core';
import {Button} from "@/components/ButtonMain";

interface MyEvent {
    title: string;
    start: string;
    end: string;
    location?: string;
    description?: string;
    partners: string[];
    color: string;
}

export default function FramagendaView() {
    const [events, setEvents] = useState<MyEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    let calendarViewState = "timeGridWeek";

    const formatIcsDate = (icsDate: string) => {
        if (!icsDate || icsDate.includes("-")) return icsDate;
        return icsDate.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}).*$/, "$1-$2-$3T$4:$5:$6");
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/TheGamerFarmer/records/5/calendar', {
                    method: "GET",
                    credentials: 'include',
                    cache: 'no-store'
                });

                const data: MyEvent[] = await response.json();

                console.log(data);

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

        loadData().then();
    }, []);

    const handleEventClick = (info: EventClickArg) => {
        // On stocke les infos de l'événement cliqué dans l'état
        setSelectedEvent({
            title: info.event.title,
            start: info.event.start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            end: info.event.end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color: info.event.backgroundColor,
            ...info.event.extendedProps
        });
    };

    return (
        <div className="h-screen p-4 bg-white rounded-2xl">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
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

                    if (arg.view.type !== newView) {
                        arg.view.calendar.changeView(newView);
                    }
                }}

                firstDay={1}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
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
            `}</style>

            {selectedEvent && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-250 h-full max-h-175 overflow-hidden transform transition-all flex flex-col border border-gray-200">

                        {/* Header Modale */}
                        <div className="p-8 border-b border-gray-100" style={{ borderLeft: `12px solid ${selectedEvent.color}` }}>
                            {/* Titre ÉNORME et Noir */}
                            <h3 className="text-2xl font-black text-[#0551ab] leading-tight">
                                {selectedEvent.title}
                            </h3>
                            <p className="text-l text-gray-600 mt-2 font-medium">
                                🕒 {selectedEvent.start} — {selectedEvent.end}
                            </p>
                        </div>

                        {/* Corps Modale */}
                        <div className="p-10 space-y-10 flex-1 overflow-y-auto">

                            {/* Section Description */}
                            <div>
                                <label className="text-xl font-bold uppercase text-[#0551ab] block mb-4">
                                    Description
                                </label>
                                <p className="text-l text-black leading-relaxed whitespace-pre-line font-medium">
                                    {selectedEvent.description || "Aucune description fournie."}
                                </p>
                            </div>

                            {/* Section Lieu */}
                            <div className="flex flex-col">
                                <label className="text-xl font-bold uppercase text-[#0551ab] block mb-4">
                                    Lieu
                                </label>
                                <p className="text-l text-black">
                                    {selectedEvent.location || "Non spécifié"}
                                </p>
                            </div>

                            {/* Section Partenaires */}
                            <div>
                                <label className="text-xl font-bold uppercase text-[#0551ab] block mb-4">
                                    Participant
                                </label>
                                <div className="flex flex-wrap gap-4">
                                    {selectedEvent.partners?.length > 0 ? (
                                        <p className="text-black text-l">{selectedEvent.partners.join(", ")}</p>
                                    ) : (
                                        <p className="text-gray-400 text-l italic">Aucun partenaire</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Modale */}
                        <div className="p-6 flex justify-end mt-auto">
                            <Button
                                variant="cancel"
                                onClickAction={() => setSelectedEvent(null)}
                            >
                                Fermer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}