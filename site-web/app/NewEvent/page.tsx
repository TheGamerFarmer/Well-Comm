import {Button} from "@/components/ButtonMain";

export default function NewEvent() {
    return (

        <div className="flex justify-center items-center">
            <div className="bg-white w-[95%] rounded-xl">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <p className="text-lg font-bold text-blue-800">Créer un évènement</p>
                </div>
                <form className="mx-auto max-w-132">
                    <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Titre de l'évènement</label>
                    <input type="text" className="h-[50px] self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>
                    <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Lieu de l'évènement</label>
                    <input type="text" className="h-[50px] self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>
                    <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Date de l'évènement</label>
                    <input type="date" className="h-[50px] self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>
                    <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Heure de début de l'évènement</label>
                    <input type="time" className="h-[50px] self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>
                    <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Heure de fin de l'évènement</label>
                    <input type="time" className="h-[50px] self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>

                    <div className="flex gap-4 justify-between mb-4">
                        <Button variant="">
                            Annuler
                        </Button>
                        <Button type="submit">
                            Créer
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
