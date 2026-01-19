import DatePicker from "react-datepicker";
import { fr } from 'date-fns/locale/fr';

interface DateTimeInputProps {
    label: string;
    date: string;
    onDateChange: (date: Date | null) => void;
    onTimeChange: (time: string) => void;
    timeValue: string;
}

export function DateTimeInput({ label, date, onDateChange, onTimeChange, timeValue }: DateTimeInputProps) {
    return (
        <div className="space-y-2 w-full sm:w-auto">
            <label className="text-[10px] font-black uppercase text-gray-700 ml-1">{label}</label>
            <div className="flex gap-2">
                <DatePicker
                    selected={new Date(date)}
                    onChange={onDateChange}
                    dateFormat="dd/MM/yyyy"
                    locale={fr}
                    wrapperClassName="flex-1 sm:w-36"
                    className="w-full p-2.5 rounded-xl border-none shadow-sm font-medium focus:ring-2 focus:ring-[#0551ab] outline-none cursor-pointer bg-white text-xs sm:text-sm text-black"
                />
                <input
                    type="time"
                    className="w-20 sm:w-24 p-2 rounded-xl border-none bg-white shadow-sm font-medium focus:ring-2 focus:ring-[#0551ab] outline-none text-black text-xs sm:text-sm"
                    value={timeValue}
                    onChange={(e) => onTimeChange(e.target.value)}
                />
            </div>
        </div>
    );
}