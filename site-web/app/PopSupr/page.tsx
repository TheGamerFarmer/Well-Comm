"use client";

import {Button} from "@/components/ButtonMain";
import { useState } from "react";

export default function PopSupr() {
    const [items, setItems] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return;

        setItems((prev) => [...prev, name]);
        setName("");
        setIsOpen(false);
    };

    return (
        <div>

            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-[#0551ab] text-white rounded-full my-4">
                Supprimer
            </button>


        {isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-2xl w-[400px]">

                            <div className="flex justify-center items-center flex-col gap-y-4">
                                <img src="/images/icon-attention2x.png" alt="Attention" width={50}/>
                                <p className="font-bold text-blue-800 text-xl">Voulez-vous supprimer ?</p>
                                <p>Ceci sera supprimé définitivement.</p>
                                <div className="flex gap-4 justify-between mb-4">
                                    <Button variant="secondary" type="submit" onClick={() => setIsOpen(false)}>
                                        Oui
                                    </Button>
                                    <Button onClick={() => setIsOpen(false)}>
                                        Non
                                    </Button>
                                </div>
                            </div>
                </div>
            </div>
        )}
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
