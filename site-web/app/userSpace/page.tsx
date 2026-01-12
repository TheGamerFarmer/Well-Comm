
import HeaderLoged from "@/components/HeaderLoged";
import {Button} from "@/components/ButtonMain";
import Image from "next/image";

export default function UserSpace() {
    return (

<div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <p className=" p-4 text-lg font-bold text-blue-800">Mon Profil</p>


            <div  className=" flex justify-center items-center flex-col  bg-[#ffffff] w-[100%] rounded-xl border-20 border-white">

            <div className="p-4 w-[130px]  h-[130px]">
                <Image
                    src="/images/avatar.svg"
                    alt="user avatar"
                    className="relative"
                    width={130}
                    height={130}
                    priority
                />

                <Image
                    src="/images/add_photo.svg"
                    alt="user avatar"
                    width={32}
                    height={32}
                    className="sticky right-5"
                    priority
                />

            </div>

            <form className="mx-auto max-w-200 ">
                <div className="flex flex-col md:flex-row md:gap-4">
                    <div>
                        <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Prénom</label>
                        <input className="w-[300px] h-[50px] bg-white self-stretch flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black" type="text"/>
                    </div>
                    <div>
                        <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Nom</label>
                        <input className="w-[300px] h-[50px] bg-white self-stretch flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black" type="text"/>
                    </div>
                </div>

                    <div className="flex flex-col md:flex-row md:gap-4">
                        <div>
                            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Date de naissance</label>
                            <input type="date" className="w-[300px] h-[50px] bg-white self-stretch flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>
                        </div>
                        <div>
                            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Nom utilisateur</label>
                            <input className="w-[300px] h-[50px] bg-white self-stretch flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>
                        </div>
                    </div>

                <div className="flex gap-4 justify-end">
                    <Button variant="cancel" link={""}>
                        Annuler
                    </Button>
                    <Button type="submit" link={""} variant={"primary"}>
                        Enregistrer
                    </Button>
                </div>
            </form>

        </div>
        </div>

);
}