"use client";

import React, { useEffect, useState } from "react";
import FilArianne from "@/components/FilArianne";
import { Button } from "@/components/ButtonMain";
import ImagePreview from "@/components/ImagePreview";
import {getCurrentUserId} from "@/functions/fil-API";
import { API_BASE_URL } from "@/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {sanitize} from "@/functions/Sanitize";

type Dossier = {
    id: number;
    name: string;
    admin: number;
};

export default function MesAides() {

    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        getCurrentUserId().then(setUserId);
    }, []);

    const [dossiers, setDossiers] = useState<Dossier[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [dossierToDelete, setDossierToDelete] = useState<Dossier | null>(null);
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();

    /* =======================
       Chargement des dossiers
       ======================= */
    useEffect(() => {
        if (!userId) return;

        const fetchDossiers = async () => {
            const res = await fetch(
                `${API_BASE_URL}/api/${userId}/records/`,
                { credentials: "include" }
            );

            if (!res.ok) {
                console.log("Erreur chargement dossiers");
                return;
            }

            const data: Dossier[] = await res.json();
            console.log("API dossiers =", data);
            setDossiers(data);
        };

        fetchDossiers().then();
    }, [userId]);

    /* =======================
       Création d’un dossier
       ======================= */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setName(sanitize(name));

        const res = await fetch(
            `${API_BASE_URL}/api/${userId}/records/create/${encodeURIComponent(
                name
            )}`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        if (!res.ok) {
            console.log("Erreur création dossier");
            return
        }

        const newRecord = await res.json();

        setDossiers((prev) => [
            ...prev,
            { id: newRecord.id, name: newRecord.name , admin: newRecord.admin },
        ]);

        setName("");
        setFile(null);
        setIsOpen(false);
    };

//supprimer un dossier
    const handleDelete = async (id: number) => {
        if (!id) return;

        const res = await fetch(
            `${API_BASE_URL}/api/${userId}/records/delete/${id}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        if (!res.ok) {
            console.log("Erreur suppression");
            return;
        }

        // Mise à jour de la liste côté front
        setDossiers(dossiers.filter(d => d.id !== id));

        console.log("Dossier supprimé ");
    }

    return (
        <div className="p-10">
            <p className="mt-10 font-montserrat text-2xl font-bold text-[#0551ab]">
                Mes aidés
            </p>

            <FilArianne />

            <div className="flex justify-end my-4">
                <Button variant="validate" type="button" onClickAction={() => setIsOpen(true)} link={""}>
                    Ajouter un aidé
                </Button>
            </div>

    {/* =======================
         Liste des dossiers
        ======================= */}
            <div className="p-4 rounded-2xl shadow bg-white">
                <div className="flex flex-col gap-4 text-black">
                    {dossiers.map((dossier) =>{
                        return(
                            <Link key={dossier.id} href={`/resume`}>
                        <div
                            key={dossier.id}
                            onClick={() => {
                                localStorage.setItem('activeRecordId', dossier.id.toString());
                                localStorage.setItem("activeRecordName", dossier.name);
                            }
                        }
                            className="w-full h-[83px] rounded-lg bg-[#f6f6f6] flex items-center px-5 gap-4 font-bold cursor-pointer hover:bg-gray-200"
                            >

                            {dossier.name}

                            <div className="ml-auto">
                                {userId && dossier.admin === userId && (
                                <button type="button" className="text-[#f27474] hover:scale-110 hover:cursor-pointer transition-transform" onClick={(e) => {
                                    e.preventDefault(); // empêche la navigation
                                    e.stopPropagation(); // empêche le click parent
                                    setDossierToDelete(dossier);}}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>)}
                            </div>
                        </div>
                            </Link>
                    )})}
                </div>
            </div>

      {/* =======================
          Modal création
          ======================= */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-[400px]">
                        <h2 className="text-lg font-bold mb-4 text-[#0551ab]">
                            Nouvel aidé
                        </h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                            <input
                                type="text"
                                value={name}
                                placeholder="Nom de l'aidé"
                                onChange={(e) => setName(e.target.value)}
                                className="border rounded-lg p-2 text-black"
                            />

                            <div className="flex justify-center gap-3">
                                <Button
                                    variant="cancel"
                                    type="button"
                                    onClickAction={() => setIsOpen(false)} link={""}>
                                    Annuler
                                </Button>

                                <Button variant="primary" type="submit" link={""}>
                                    Créer
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {dossierToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-[400px]">

                        <div className="flex justify-center items-center flex-col gap-y-4">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 44a19.939 19.939 0 0 0 14.142-5.858A19.939 19.939 0 0 0 44 24a19.939 19.939 0 0 0-5.858-14.142A19.94 19.94 0 0 0 24 4 19.94 19.94 0 0 0 9.858 9.858 19.94 19.94 0 0 0 4 24a19.94 19.94 0 0 0 5.858 14.142A19.94 19.94 0 0 0 24 44z" stroke="#F67A7A" strokeWidth="4" strokeLinejoin="round"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M24 37a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="#F67A7A"/>
                                <path d="M24 12v16" stroke="#F67A7A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p className="font-bold text-blue-800 text-xl">Voulez-vous supprimer ?</p>
                            <p>
                                <strong>{dossierToDelete.name}</strong> sera supprimé définitivement.
                            </p>
                            <div className="flex gap-4 justify-between mb-4">
                                <Button variant="cancel" onClickAction={() => setDossierToDelete(null)} link={""}>Non</Button>
                                <Button variant="validate" type="button" onClickAction={() => {
                                    if(!dossierToDelete?.id)
                                        return;

                                    handleDelete(dossierToDelete.id).then();
                                    setDossierToDelete(null);
                                }} link={""}>
                                    Oui
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
