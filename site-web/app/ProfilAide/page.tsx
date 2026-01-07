import {Button} from "@/components/ButtonMain";

export default function ProfilAide() {
    return (

        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <p className="text-lg font-medium font-bold text-blue-800">L'aidé</p>
            <div>
        <div className="w-full h-[66px] mb-[22px] pt-4 pb-4 pl-[23px] bg-gradient-to-r from-[#45bbb1] to-[#215a9e]">
            <p className="w-[229px] h-[34px] font-montserrat text-xl font-bold leading-[1.7px] text-left text-[#fff]">
                DOSSIER PATIENT
            </p>
        </div>
            <form className="mx-auto max-w-132">
                <div className="flex flex-col md:flex-row gap-4">
                    <div>
                        <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Prénom</label>
                        <input className="h-[50px] self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black" type="text"/>
                    </div>
                    <div>
                        <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Nom</label>
                        <input className="h-[50px] self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black" type="text"/>
                    </div>
                </div>

                    <div className="flex flex-col md:flex-row  gap-4">
                        <div>
                            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Age</label>
                            <input className="h-[50px] self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black" type="text"/>
                        </div>
                        <div>
                            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Numero de téléphone</label>
                            <input className="h-[50px] self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black" type="text"/>
                        </div>
                    </div>
                <div className="w-full">
                <label className="flex font-montserrat text-sm font-bold text-left text-[#727272] text-blue-600">L'aidé Info</label>
                <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Informations complémentaires</label>
                <textarea className="h-[50px] w-full self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"></textarea>
                </div>
            </form>
                <div className="flex gap-4 justify-end">
                <Button variant="" type="submit">
                    Cancel
                </Button>
                <Button type="submit">
                    Save
                </Button>
                </div>
        </div>
        </div>
    );
}
