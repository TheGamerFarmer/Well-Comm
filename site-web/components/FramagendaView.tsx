'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventSourceInput, EventClickArg } from '@fullcalendar/core';

interface MyEvent {
    title: string;
    start: string;
    end: string;
    location?: string;
    description?: string;
    partners: string[];
}

// On définit ce que le composant doit recevoir
interface FramagendaViewProps {
    initialCookies: string;
}

export default function FramagendaView({ initialCookies }: FramagendaViewProps) {
    const [events, setEvents] = useState<MyEvent[]>([]);

    const formatIcsDate = (icsDate: string) => {
        if (!icsDate || icsDate.includes("-")) return icsDate;
        return icsDate.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}).*$/, "$1-$2-$3T$4:$5:$6");
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/TheGamerFarmer/records/5/calendar', {
                    method: "GET",
                    headers: {
                        "Cookie": initialCookies // On utilise les cookies passés en prop
                    },
                    cache: 'no-store'
                });
                const data: MyEvent[] = await response.json();
                const formatted = data.map(evt => ({
                    ...evt,
                    start: formatIcsDate(evt.start),
                    end: formatIcsDate(evt.end)
                }));
                setEvents(formatted);
            } catch (error) {
                console.error("Erreur de fetch :", error);
            }
        };
        loadData();
    }, [initialCookies]);

    const handleEventClick = (info: EventClickArg) => {
        const props = info.event.extendedProps as MyEvent;
        alert(`Partenaires : ${props.partners?.join(', ') || 'Aucun'}`);
    };

    return (
        <div className="h-screen p-4 bg-white">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events as EventSourceInput}
                eventClick={handleEventClick}
                locale="fr"
            />
        </div>
    );
}