import {Button} from "@/components/ButtonMain";

export default function PopSupr() {
    return (
        <div>
        <div className="flex justify-center items-center flex-col gap-y-4">
            <img src="/images/icon-attention2x.png" alt="Attention" width={50}/>
            <p className="font-bold text-blue-800 text-xl">Voulez-vous supprimer ?</p>
            <p>Ceci sera supprimé définitivement.</p>
            <div className="flex gap-4 justify-between mb-4">
                <Button variant="secondary">
                    Oui
                </Button>
                <Button type="submit">
                    Non
                </Button>
            </div>
        </div>

    <div className="flex justify-center items-center flex-col gap-y-4">
        <form>
            <label className="flex font-bold text-blue-800 text-xl font-bold text-left text-[#727272]">Invitation</label>
            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Email</label>
            <input className="h-[50px] self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black" type="text"/>
            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Message</label>
            <textarea className="h-[100px] w-full mb-2 self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"></textarea>
        </form>
        <div className="flex gap-4 justify-between mb-4">
            <Button type="submit">
                Envoyer l'invitation
            </Button>
        </div>
    </div>

    </div>
    );
}
