// noinspection CssUnusedSymbol

'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import "react-datepicker/dist/react-datepicker.css";
import {useCalendarLogic} from "@/hooks/useCalendarLogic";
import { Button } from "@/components/ButtonMain";
import DatePicker from "react-datepicker";
import { fr } from 'date-fns/locale/fr';
import {HexColorPicker} from "react-colorful";

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
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Début de l&#39;événement</label>
                                            <div className="flex gap-2">
                                                <DatePicker
                                                    selected={new Date(editData.start)}
                                                    onChange={(date: Date | null) => date && setEditData({...editData, start: joinISO(date.toISOString().split('T')[0], splitISO(editData.start).time)})}
                                                    dateFormat="dd/MM/yyyy"
                                                    locale={fr}
                                                    wrapperClassName="w-36"
                                                    className="w-full p-2.5 rounded-xl border-none shadow-sm font-medium focus:ring-2 focus:ring-[#0551ab] outline-none cursor-pointer bg-white text-sm"/>
                                                <input
                                                    type="time"
                                                    className="w-24 p-2 rounded-xl border-none bg-white shadow-sm font-medium focus:ring-2 focus:ring-[#0551ab] outline-none"
                                                    value={splitISO(editData.start).time}
                                                    onChange={(e) => setEditData({...editData, start: joinISO(splitISO(editData.start).date, e.target.value)})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Fin de l&#39;événement</label>
                                            <div className="flex gap-2">
                                                <DatePicker
                                                    selected={new Date(editData.end)}
                                                    onChange={(date: Date | null) => date && setEditData({...editData, end: joinISO(date.toISOString().split('T')[0], splitISO(editData.end).time)})}
                                                    dateFormat="dd/MM/yyyy"
                                                    locale={fr}
                                                    wrapperClassName="w-36"
                                                    className="w-full p-2.5 rounded-xl border-none shadow-sm font-medium focus:ring-2 focus:ring-[#0551ab] outline-none cursor-pointer bg-white text-sm"/>
                                                <input
                                                    type="time"
                                                    className="w-24 p-2 rounded-xl border-none bg-white shadow-sm font-medium focus:ring-2 focus:ring-[#0551ab] outline-none"
                                                    value={splitISO(editData.end).time}
                                                    onChange={(e) => setEditData({...editData, end: joinISO(splitISO(editData.end).date, e.target.value)})}
                                                />
                                            </div>
                                        </div>

                                        <div
                                            className="w-10 h-10 cursor-pointer border-1 border-gray-200 shadow-md transition-transform hover:scale-110"
                                            style={{ backgroundColor: editData.color }}
                                            onClick={() => toggleColorPopupOpen(true)}
                                        />

                                        {isColorPopupOpen && (
                                            <div className="absolute z-[100] mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 w-64" ref={colorPopup}>
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
                                {hasEditPermission && !isEditing && !isCreating && (
                                    <Button variant="primary" onClickAction={() => setIsEditing(true)}>
                                        Modifier
                                    </Button>
                                )}
                                {isEditing && (
                                    <Button variant="validate" onClickAction={() => saveEdits()}>
                                        Enregistrer
                                    </Button>
                                )}
                                {hasEditPermission && !isCreating && (
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