// noinspection CssUnusedSymbol

'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import "react-datepicker/dist/react-datepicker.css";
import {useCalendarLogic} from "@/hooks/useCalendarLogic";
import EventPopup from '@/components/EventPopup';

export default function FramagendaView() {
    const {
        userName,
        calendarRef, calendarViewState, setCalendarViewState,
        getEvents,
        hasEditPermission,
        handleSelect, handleEventChange, handleEventClick,
        selectedEvent,
        editData,
    } = useCalendarLogic();

    return (
        <div className="h-screen p-4 bg-white rounded-2xl">
            <FullCalendar
                key={userName}
                ref={calendarRef}
                events={getEvents}
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
                        setCalendarViewState(arg.view.type);

                    const newView = window.innerWidth < 768 ? 'timeGridDay' : calendarViewState;

                    if (arg.view.type !== newView)
                        arg.view.calendar.changeView(newView);
                }}

                firstDay={1}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"

                selectable={hasEditPermission ?? false}
                select={handleSelect as never}

                editable={hasEditPermission ?? false}
                eventStartEditable={hasEditPermission ?? false}
                eventDurationEditable={hasEditPermission ?? false}
                eventDrop={handleEventChange}
                eventResize={handleEventChange}

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
                <EventPopup />
            )}
        </div>
    );
}