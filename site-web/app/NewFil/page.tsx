import {Button} from "@/components/ButtonMain";

export default function NewFil() {
    return (

        <div className="flex justify-center items-center">
            <div className="bg-white w-[95%] rounded-xl">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <p className="text-lg font-bold text-blue-800">Créer un Fil de transmission</p>
                </div>
                <form className="mx-auto max-w-132">
                    <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Sélectionner une catégorie</label>
                    <div className="relative inline-block w-64">
                        <select
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="1">Santé</option>
                            <option value="2">Alimentation</option>
                            <option value="3">Maison/terrain</option>
                            <option value="4">Hygiène</option>
                            <option value="5">Ménage</option>
                            <option value="6">Autres</option>
                        </select>
                    </div>
                    <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Sujet du fil</label>
                    <input type="text" className="h-[50px] self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>
                    <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Description du fil</label>
                    <textarea className="h-[100px] w-full self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"></textarea>
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
