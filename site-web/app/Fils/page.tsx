import {Button} from "@/components/ButtonMain";
import Categories from "@/components/Categories";
import HeaderLoged from "@/components/HeaderLoged";

export default function ProfilAide() {
    return (
        <div className="bg-[#f1f2f2]">
            <HeaderLoged/>
            <p className="text-lg font-bold text-blue-800">Fil de transmission</p>
            <div className="bg-white rounded-xl border-20 border-white flex-col items-center">
                <Categories />
                <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20 21H4V10h2v9h12v-9h2zM3 3h18v6H3zm6.5 8h5c.28 0 .5.22.5.5V13H9v-1.5c0-.28.22-.5.5-.5M5 5v2h14V5z"/></svg>
                <p>Dans les archives:</p>
                </div>
            </div>
        </div>
    );
}
