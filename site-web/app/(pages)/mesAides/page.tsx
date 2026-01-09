"use client";

import { useState } from "react";
import FilArianne from '@/components/FilArianne';
import {Button} from "@/components/ButtonMain";

import ImagePreview from "@/components/ImagePreview";

type Aide = {
    id: string;
    name: string;
    image: File | null;
};

export default function mesAides() {
    const [items, setItems] = useState<Aide[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");

    const [file, setFile] = useState<File | null>(null);

    const [itemToDelete, setItemToDelete] = useState<Aide | null>(null);

    //ImagePreviewV2
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        setFile(files && files.length > 0 ? files[0] : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(file);

        if (!name.trim()) return;

        setItems((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name,
                image: file,
            },
        ]);

        //setItems((prev) => [...prev, name]);

        setName("");
        setFile(null);
        setIsOpen(false);
    }

    //ImagePreview
    /*
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            setFile(fileList[0]);
        } else {
            setFile(null);
        }
    };
    */


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

                    {/*liste des aides*/}
                        <div className="p-4 rounded-2xl shadow bg-white">
                            <div className="flex flex-col gap-4">

                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center rounded-lg bg-[#f6f6f6] cursor-pointer hover:bg-gray-100 transition">
                                        <div
                                            className="flex items-center gap-4 p-4 ">
                                            {item.image && (
                                                <img
                                                    src={URL.createObjectURL(item.image)}
                                                    alt={item.name}
                                                    className="w-30 h-30 rounded-full object-cover"
                                                />
                                            )}
                                            <span className="font-bold text-black">{item.name}</span>
                                    </div>

                                        <button
                                            onClick={() => setItemToDelete(item)}
                                            className="text-red-600 font-bold cursor-pointer hover:bg-black/10 hover:scale-110 rounded-full transition delay-10 duration-300 ease-in-out">
                                            <svg className="m-4" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><g fill="none" stroke="#c10808" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"/><path d="M4 5h16"/><path d="M10 4h4M10 9v7M14 9v7"/></g></svg>
                                        </button>

                                    </div>
                                ))}
                            </div>


                            {/* pop-up */}
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

            {itemToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-[400px] flex flex-col items-center justify-center gap-y-4">
                        <img src="/images/icon-attention2x.png" alt="Attention" width={50}/>

                        <p className="font-bold text-blue-800 text-xl">Voulez-vous supprimer :{" "}
                            <span className="font-bold">
                                {itemToDelete.name}
                            </span>{" "}?
                        </p>

                        <p className="text-[#727272]">Ceci sera supprimé définitivement.</p>

                        <div className="flex gap-4 justify-between mb-4">
                            <Button variant="secondary" type="submit" onClick={() => {

                                if (!itemToDelete) return;

                                setItems((prev) =>
                                    prev.filter((item) => item.id !== itemToDelete.id)
                                );

                                setItemToDelete(null);
                            }}
                            >
                                Oui
                            </Button>
                            <Button  onClick={() => setItemToDelete(null)}>
                                Non
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
