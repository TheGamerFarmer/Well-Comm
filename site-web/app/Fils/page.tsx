"use client";

import {Button} from "@/components/ButtonMain";
import Categories from "@/components/Categories";
import HeaderLoged from "@/components/HeaderLoged";
import { useState } from "react";

type Aide = {
    id: string;
    name: string;
};

export default function ProfilAide() {
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
        <div className="bg-[#f1f2f2]">
            <HeaderLoged/>
            <div className="flex justify-between m-2">
            <p className="text-lg font-bold text-blue-800">Fil de transmission</p>
            <Button onClick={() => setIsOpen(true)}>
                Créer un fil de transmission
            </Button>
            </div>
            {isOpen && (
                <div className="flex justify-center bg-black/50 items-center fixed inset-0 z-50">
                    <div className="bg-white p-10 rounded-xl">
                        <form onSubmit={handleSubmit} className="mx-auto max-w-132">
                            <label className="text-xl font-bold text-blue-800 mb-2 flex font-montserrat  font-bold text-left text-[#727272]">Créer un Fil de transmission</label>
                            <label className="mb-2 flex font-montserrat text-sm font-bold text-left text-[#727272]">Sélectionner une catégorie</label>
                            <div className="mb-2 relative inline-block w-64">
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
                            <label className="mb-2 flex font-montserrat text-sm font-bold text-left text-[#727272]">Sujet du fil</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="h-[50px] mb-2 self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>
                            <label className="mb-2 flex font-montserrat text-sm font-bold text-left text-[#727272]">Description du fil</label>
                            <textarea className="h-[100px] w-full mb-2 self-stretch flex flex flex-row justify-between items-start py-[14px] ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"></textarea>
                            <div className="flex gap-4 justify-between mb-4">
                                <Button variant="" onClick={() => setIsOpen(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit">
                                    Créer
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="bg-white rounded-xl border-20 border-white flex-col items-center">
                <Categories />
                <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20 21H4V10h2v9h12v-9h2zM3 3h18v6H3zm6.5 8h5c.28 0 .5.22.5.5V13H9v-1.5c0-.28.22-.5.5-.5M5 5v2h14V5z"/></svg>
                <p>Dans les archives:</p>
                </div>
            </div>
            {/*liste des fils*/}
            <div className="p-4 rounded-2xl shadow bg-white">
                <div className="flex flex-col gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center rounded-lg bg-[#f6f6f6] cursor-pointer hover:bg-gray-100 transition">
                            <div
                                className="flex items-center gap-4 p-4 ">
                                <div className="w-12 h-12 mr-[15px] p-[9.6px] rounded-[100px] bg-[#20baa7]">
                                    <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.833 21.75H7.25v4.931l6.164-4.93h5.92a2.42 2.42 0 0 0 2.416-2.418V9.668a2.42 2.42 0 0 0-2.417-2.417h-14.5a2.42 2.42 0 0 0-2.416 2.417v9.667a2.42 2.42 0 0 0 2.416 2.416z" fill="#fff"/>
                                        <path d="M24.167 2.417h-14.5A2.42 2.42 0 0 0 7.25 4.834h14.5a2.42 2.42 0 0 1 2.417 2.416v9.667a2.419 2.419 0 0 0 2.416-2.417V4.834a2.419 2.419 0 0 0-2.416-2.417z" fill="#fff"/>
                                    </svg>
                                </div>
                                <span className="font-bold text-black">{item.name}</span>
                            </div>

                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 5.25A2.25 2.25 0 0 1 3.75 3h16.5a2.25 2.25 0 0 1 2.25 2.25v1.5A2.25 2.25 0 0 1 21 8.873V9.9a8.252 8.252 0 0 0-1.5-.59V9h-15v8.25a2.25 2.25 0 0 0 2.25 2.25h2.56A8.19 8.19 0 0 0 9.9 21H6.75A3.75 3.75 0 0 1 3 17.25V8.873A2.25 2.25 0 0 1 1.5 6.75v-1.5zm2.25-.75a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 .75.75h16.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75H3.75zM17.25 24a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5zm-1.344-9.594L14.56 15.75h2.315A4.125 4.125 0 0 1 21 19.875v.375a.75.75 0 1 1-1.5 0v-.375a2.625 2.625 0 0 0-2.625-2.625H14.56l1.346 1.344a.75.75 0 0 1-1.062 1.062l-2.628-2.631a.75.75 0 0 1 .003-1.057l2.625-2.626a.75.75 0 0 1 1.062 1.063" fill="#0551AB"/>
                            </svg>

                        </div>
                    ))}
                </div>
        </div>
        </div>
    );
}
