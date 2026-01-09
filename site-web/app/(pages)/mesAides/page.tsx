"use client";

import { useState } from "react";
import FilArianne from '@/components/FilArianne';
import {Button} from "@/components/ButtonMain";

import ImagePreview from "@/components/ImagePreview";


export default function mesAides() {
    const [items, setItems] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(file);

        if (!name.trim()) return;

        setItems((prev) => [...prev, name]);
        setName("");
        setIsOpen(false);
    }

    //ImagePreview
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            setFile(fileList[0]);
        } else {
            setFile(null);
        }
    };

    /*
    const handleSubmit2 = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(file);
    };
    */

    return (

        <>
                <div className=" p-10 ">

                    <p className=" mt-10 flex font-montserrat text-2xl font-bold text-left text-[#0551ab]">
                        Mes aidés
                    </p>

                    <FilArianne />
                    <div className="flex flex-col items-end my-4">

                        <Button variant="primary" type="button"
                                onClick={() => setIsOpen(true)}>
                            Ajouter un aidé
                        </Button>

                    </div>

                    <div className=" p-4 rounded-2xl shadow-[0 3px 6px 0 rgba(0, 0, 0, 0.1)] bg-[#fff]">

                        <div className="flex flex-col gap-4">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => alert("fonctionne")}
                                    className="w-full h-[83px] mb-1 pt-[18px] pr-[23px] pb-[17px] pl-5 rounded-lg bg-[#f6f6f6] text-black font-bold flex items-center">
                                    <ImagePreview file={file} />
                                    {item}


                                </div>
                            ))}
                        </div>

                        {isOpen && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-2xl w-[400px]">
                                    <h2 className="text-lg font-bold mb-4 text-[#0551ab]">Nouveau aidé</h2>
                                    <div className="flex justify-center">

                                    </div>

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                                        <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center">
                                            <ImagePreview file={file} />
                                        </label>

                                        <input
                                            id="file-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />

                                        <input
                                            type="text"
                                            value={name}
                                            placeholder="Nom de l'aidé"
                                            onChange={(e) => setName(e.target.value)}
                                            className="border rounded-lg p-2 text-black "/>

                                        <div className="flex justify-center gap-3" defaultValue="Nouveau dossier">


                                            <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>
                                                Annuler
                                            </Button>

                                            <Button variant="primary" type="submit">
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
