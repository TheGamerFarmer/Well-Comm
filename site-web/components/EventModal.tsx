import React from 'react';
import { Button } from "@/components/ButtonMain";
import { DateTimeInput } from './DateTimeInput';
import { ColorPicker } from './ColorPicker';

interface EventModalProps {
    selectedEvent: any;
    editData: any;
    setEditData: (data: any) => void;
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
    isCreating: boolean;
    setIsCreating: (value: boolean) => void;
    setSelectedEvent: (event: any) => void;
    hasEditPermission: boolean;
    formatDisplayTime: (iso:string) => string;
    joinISO: (date: string, time: string) => string;
    splitISO: (iso: string) => { date: string; time: string };
    saveEdits: () => void;
    deleteEvent: () => void;
    isColorPopupOpen: boolean;
    toggleColorPopupOpen: (open: boolean) => void;
    colorPopupRef: React.RefObject<HTMLDivElement | null>;
    presetColors: string[];
}

export function EventModal(props: EventModalProps) {
    if (!props.selectedEvent || !props.editData) return null;

    return (
        <div id="modal-overlay" className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-250 h-full max-h-[95vh] sm:max-h-175 overflow-hidden transform transition-all flex flex-col border border-gray-200">

                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col" style={{ borderLeft: `8px solid ${props.editData.color}` }}>
                    {props.isEditing ? (
                        <div className="space-y-3 sm:space-y-4">
                            <input
                                className="text-xl sm:text-2xl font-black w-full border-b-2 sm:border-b-4 border-black outline-none bg-gray-50 text-[#0551ab]"
                                placeholder="Titre de l'événement"
                                value={props.editData.title}
                                onChange={(e) => props.setEditData({...props.editData, title: e.target.value})}
                            />
                            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 items-start sm:items-center text-sm">
                                <DateTimeInput
                                    label="Début de l'événement"
                                    date={props.editData.start}
                                    onDateChange={(date) => date && props.setEditData({...props.editData, start: props.joinISO(date.toISOString().split('T')[0], props.splitISO(props.editData.start).time)})}
                                    onTimeChange={(time) => props.setEditData({...props.editData, start: props.joinISO(props.splitISO(props.editData.start).date, time)})}
                                    timeValue={props.splitISO(props.editData.start).time}
                                />

                                <DateTimeInput
                                    label="Fin de l'événement"
                                    date={props.editData.end}
                                    onDateChange={(date) => date && props.setEditData({...props.editData, end: props.joinISO(date.toISOString().split('T')[0], props.splitISO(props.editData.end).time)})}
                                    onTimeChange={(time) => props.setEditData({...props.editData, end: props.joinISO(props.splitISO(props.editData.end).date, time)})}
                                    timeValue={props.splitISO(props.editData.end).time}
                                />

                                <div
                                    className="w-10 h-10 cursor-pointer border border-gray-200 shadow-md transition-transform hover:scale-110 rounded"
                                    style={{ backgroundColor: props.editData.color }}
                                    onClick={() => props.toggleColorPopupOpen(true)}
                                />

                                {props.isColorPopupOpen && (
                                    <ColorPicker
                                        color={props.editData.color}
                                        onChange={(c) => props.setEditData({...props.editData, color: c})}
                                        presetColors={props.presetColors}
                                        colorPopupRef={props.colorPopupRef}
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-xl sm:text-2xl font-black text-[#0551ab] leading-tight">
                                {props.selectedEvent.title || "(Sans titre)"}
                            </h3>
                            <p className="text-sm sm:text-l text-black mt-2 font-semibold">
                                🕒 {props.formatDisplayTime(props.selectedEvent.start)} — {props.formatDisplayTime(props.selectedEvent.end)}
                            </p>
                        </>
                    )}
                </div>

                {/* Body */}
                <div className="p-4 sm:p-10 space-y-6 sm:space-y-10 flex-1 overflow-y-auto">
                    <div>
                        <label className="text-lg sm:text-xl font-bold uppercase text-[#0551ab] block mb-3 sm:mb-4">
                            Description
                        </label>
                        {props.isEditing ? (
                            <textarea
                                className="w-full text-sm sm:text-l border-2 sm:border-4 border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 min-h-[150px] sm:min-h-[200px] outline-none focus:border-black text-black"
                                placeholder="Description de l'événement"
                                value={props.editData.description}
                                onChange={(e) => props.setEditData({...props.editData, description: e.target.value})}
                            />
                        ) : (
                            <p className="text-sm sm:text-l text-black leading-relaxed whitespace-pre-line font-semibold">
                                {props.selectedEvent.description || "Aucune description fournie."}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg sm:text-xl font-bold uppercase text-[#0551ab] block mb-3 sm:mb-4">
                            Lieu
                        </label>
                        {props.isEditing ? (
                            <input
                                className="w-full text-sm sm:text-l font-black border-b-2 sm:border-b-4 border-gray-100 outline-none focus:border-black text-black pb-2"
                                placeholder="Lieu de l'événement"
                                value={props.editData.location}
                                onChange={(e) => props.setEditData({...props.editData, location: e.target.value})}
                            />
                        ) : (
                            <p className="text-sm sm:text-l text-black font-semibold">
                                {props.selectedEvent.location || "Non spécifié"}
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mt-auto border-t border-gray-100">
                    <div className="flex flex-wrap gap-2 sm:gap-6">
                        {props.hasEditPermission && !props.isEditing && !props.isCreating && (
                            <Button variant="primary" onClickAction={() => props.setIsEditing(true)}>
                                Modifier
                            </Button>
                        )}
                        {props.isEditing && (
                            <Button variant="validate" onClickAction={() => props.saveEdits()}>
                                Enregistrer
                            </Button>
                        )}
                        {props.hasEditPermission && !props.isCreating && (
                            <Button variant="cancel" onClickAction={() => props.deleteEvent()}>
                                Supprimer
                            </Button>
                        )}
                    </div>

                    <Button variant="cancel" onClickAction={() => {
                        if (!props.isEditing || props.isCreating)
                            props.setSelectedEvent(null);
                        props.setIsEditing(false);
                        props.setIsCreating(false);
                    }}>
                        {props.isEditing ? "ANNULER" : "FERMER"}
                    </Button>
                </div>
            </div>
        </div>
    );
}