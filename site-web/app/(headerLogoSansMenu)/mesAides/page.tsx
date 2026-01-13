"use client";

import { useEffect, useState } from "react";
import FilArianne from "@/components/FilArianne";
import { Button } from "@/components/ButtonMain";
import ImagePreview from "@/components/ImagePreview";
import {getCurrentUser} from "@/functions/fil-API";

type Dossier = {
    id: number;
    name: string;
};

export default function MesAides() {

    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        getCurrentUser().then(setUserName);
    }, []);

    const [dossiers, setDossiers] = useState<Dossier[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);

    /* =======================
       Chargement des dossiers
       ======================= */
    useEffect(() => {
        if (!userName) return;

        const fetchDossiers = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/${userName}/records/`,
                    { credentials: "include" }
                );

                if (!res.ok) throw new Error("Erreur chargement dossiers");

                const data: Dossier[] = await res.json();
                setDossiers(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchDossiers();
    }, [userName]);

    /* =======================
       Création d’un dossier
       ======================= */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            const res = await fetch(
                `http://localhost:8080/api/${userName}/records/create/${encodeURIComponent(
                    name
                )}`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (!res.ok) throw new Error("Erreur création dossier");

            const newRecord = await res.json();

            setDossiers((prev) => [
                ...prev,
                { id: newRecord.id, name: newRecord.name },
            ]);

            setName("");
            setFile(null);
            setIsOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    /* =======================
       Upload image
       ======================= */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        setFile(files && files.length > 0 ? files[0] : null);
    };

    return (
        <div className="p-10">
            <p className="mt-10 font-montserrat text-2xl font-bold text-[#0551ab]">
                Mes aidés
            </p>

            <FilArianne />

            <div className="flex justify-end my-4">
                <Button variant="primary" type="button" onClick={() => setIsOpen(true)}>
                    Ajouter un aidé
                </Button>
            </div>

            {/* =======================
          Liste des dossiers
          ======================= */}
            <div className="p-4 rounded-2xl shadow bg-white">
                <div className="flex flex-col gap-4">
                    {dossiers.map((dossier) => (
                        <div
                            key={dossier.id}
                            className="w-full h-[83px] rounded-lg bg-[#f6f6f6] flex items-center px-5 gap-4 font-bold cursor-pointer hover:bg-gray-200"
                        >
                            {/* image plus tard depuis backend */}
                            <div className="w-12 h-12 bg-gray-300 rounded-md" />

                            {dossier.name}
                        </div>
                    ))}
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
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex justify-center"
                            >
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
                                className="border rounded-lg p-2 text-black"
                            />

                            <div className="flex justify-center gap-3">
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                >
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
    );
}
