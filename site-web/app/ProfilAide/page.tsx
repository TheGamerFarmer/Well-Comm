import {Button} from "@/components/ButtonMain";

export default function ProfilAide() {
    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <p className="p-4 font-bold text-[#0551ab] text-2xl">L'aidé</p>
            <div  className="flex justify-center items-center flex-col bg-[#f6f6f6] w-[100%] rounded-xl border-20 border-white">
                <div className="w-full h-[66px] mb-[22px] pt-4 pb-4 pl-[23px] rounded-xl bg-gradient-to-r from-[#45bbb1] to-[#215a9e]">
                    <p className="w-[229px] h-[34px] font-montserrat text-xl font-bold leading-[1.7px] text-left text-[#fff]">
                        DOSSIER PATIENT
                    </p>
                </div>
                {/*//photo de profil a decomenter quand les images seront recuperés */}
                {/*<div className="p-8 relative overflow-visible">*/}
                {/*    <Image*/}
                {/*        src="/images/avatar.svg"*/}
                {/*        alt="user avatar"*/}
                {/*        width={130}*/}
                {/*        height={130}*/}
                {/*        priority*/}
                {/*    />*/}

                {/*    <Image*/}
                {/*        src="/images/add_photo.svg"*/}
                {/*        alt="add photo"*/}
                {/*        width={32}*/}
                {/*        height={32}*/}
                {/*        priority*/}
                {/*        className="absolute bottom-11 right-11 z-3 translate-x-1/4 translate-y-1/4 cursor-pointer"*/}
                {/*    />*/}
                {/*    */}
                {/*</div>*/}

                <form className="mx-auto max-w-200 ">
                    <div className="flex flex-col md:flex-row md:gap-4">
                        <div>
                            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Prénom</label>
                            <input className="w-[300px] h-[50px] bg-white self-stretch flex  flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black" type="text"/>
                        </div>
                        <div>
                            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Nom</label>
                            <input className="w-[300px] h-[50px] bg-white self-stretch flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black" type="text"/>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:gap-4">
                        <div>
                            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Date de naissance</label>
                            <input type="date" className=" w-[300px] h-[50px] bg-white self-stretch  flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>
                        </div>
                        <div>
                            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Numéro de téléphone</label>
                            <input type="tel" className="w-[300px] h-[50px] bg-white self-stretch  flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>
                        </div>
                    </div>
                    <div className="w-[300px]">
                        <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Informations complémentaires</label>
                        <textarea className="h-[100px] w-[300px] bg-white self-stretch  flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"></textarea>
                    </div>
                    <div className="flex gap-4 justify-end mt-4 mb-4 lg:mt-16 lg:mb-16">
                        <Button variant="cancel" link={""}>Annuler</Button>
                        <Button type="submit" link={""} variant={"primary"}>Enregistrer</Button>
                    </div>
                </form>

            </div>
        </div>
    );
}
