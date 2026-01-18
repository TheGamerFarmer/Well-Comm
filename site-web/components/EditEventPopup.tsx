import {useCalendarLogic} from "@/hooks/useCalendarLogic";
import ColorPopup from "@/components/ColorPopup";
import DatePicker from "react-datepicker";
import { fr } from 'date-fns/locale/fr';

export default function EditEventPopup() {
    const {
        editData, setEditData,
        joinISO, splitISO,
        isColorPopupOpen, toggleColorPopupOpen,
    } = useCalendarLogic();

    return (
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
                    <ColorPopup />
                )}
            </div>
        </div>
    );
}