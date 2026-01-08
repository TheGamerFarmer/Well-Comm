"use client";

import { useState } from "react";
import FilArianne from '@/components/FilArianne';
import {Button} from "@/components/ButtonMain";

export default function Calendar() {
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

        <>
                <div className=" p-10">

                    <p className=" mt-10 flex font-montserrat text-2xl font-bold text-left text-[#0551ab]">
                        Choisir un dossier
                    </p>

                    <FilArianne />

                    <button
                        onClick={() => setIsOpen(true)}
                        className="px-4 py-2 bg-[#0551ab] text-white rounded-full my-4">
                        Ajouter un dossier
                    </button>

                    <div className=" p-4 rounded-2xl shadow-[0 3px 6px 0 rgba(0, 0, 0, 0.1)] bg-[#fff]">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => alert("fonctionne")}
                                    className="cursor-pointer rounded-xl border border-gray-200 p-4 hover:bg-gray-50 hover:shadow transition">
                                    {item}
                                </div>
                            ))}
                        </div>

                        {isOpen && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-2xl w-[400px]">
                                    <h2 className="text-lg font-bold mb-4 text-[#0551ab]">Nouveau dossier</h2>

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                                        <input
                                            type="text"
                                            value={name}
                                            placeholder="Nom du dossier"
                                            onChange={(e) => setName(e.target.value)}
                                            className="border rounded-lg p-2 text-black "/>

                                        <div className="flex justify-center gap-3">


                                            <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>
                                                Annuler
                                            </Button>

                                            <Button variant="primary"  type="submit" >
                                                Créer
                                            </Button>


                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}




                    </div>
                </div>

        </>

    )
}
