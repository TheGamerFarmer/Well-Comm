// noinspection CssUnusedSymbol

'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import "react-datepicker/dist/react-datepicker.css";
import {useCalendarLogic} from "@/hooks/useCalendarLogic";
import { CalendarStyles } from './CalendarStyles';
import { EventModal } from './EventModal';

export default function Agenda() {
    const {
        hasEditPermission,
        userName,
        calendarRef, calendarViewState, setCalendarViewState,
        getEvents,
        handleSelect, handleEventChange, handleEventClick,
        selectedEvent, setSelectedEvent,
        editData, setEditData,
        isEditing, setIsEditing,
        formatDisplayTime, joinISO, splitISO,
        isCreating, setIsCreating,
        saveEdits, deleteEvent,
        colorPopup, isColorPopupOpen, toggleColorPopupOpen, PRESET_COLORS
    } = useCalendarLogic();

    return (
        <div className="h-screen p-2 sm:p-4 bg-white rounded-xl sm:rounded-2xl">
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

            <CalendarStyles />

            <EventModal
                selectedEvent={selectedEvent}
                editData={editData}
                setEditData={setEditData}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                isCreating={isCreating}
                setIsCreating={setIsCreating}
                setSelectedEvent={setSelectedEvent}
                hasEditPermission={hasEditPermission ?? false}
                formatDisplayTime={formatDisplayTime}
                joinISO={joinISO}
                splitISO={splitISO}
                saveEdits={saveEdits}
                deleteEvent={deleteEvent}
                isColorPopupOpen={isColorPopupOpen}
                toggleColorPopupOpen={toggleColorPopupOpen}
                colorPopupRef={colorPopup}
                presetColors={PRESET_COLORS}
            />
        </div>
    );
}