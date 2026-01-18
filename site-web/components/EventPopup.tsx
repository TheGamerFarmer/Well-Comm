import {useCalendarLogic} from "@/hooks/useCalendarLogic";
import { Button } from "@/components/ButtonMain";
import EditEventPopup from '@/components/EditEventPopup';

export default function EventPopup() {
    const {
        hasEditPermission,
        selectedEvent, setSelectedEvent,
        editData, setEditData,
        isEditing, setIsEditing,
        formatDisplayTime,
        isCreating, setIsCreating,
        saveEdits, deleteEvent,
    } = useCalendarLogic();

    return (
        <div id="modal-overlay" className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-250 h-full max-h-175 overflow-hidden transform transition-all flex flex-col border border-gray-200">

                <div className="p-6 border-b border-gray-100 flex flex-col" style={{ borderLeft: `16px solid ${editData.color}` }}>
                    {isEditing ? (
                        <EditEventPopup />
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
    );
}