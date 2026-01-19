"use client";

import Link from "next/link";
import Image from "next/image";
import {useEffect, useState} from "react";
import {getCurrentUser} from "@/functions/fil-API";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        getCurrentUser().then(setUserName);
    }, []);

    async function logout() {
        try {
            const response = await fetch(`http://localhost:8080/api/${userName}/logout`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: "john.doe", // ⚠️ à remplacer dynamiquement
                }),
                credentials: "include", // IMPORTANT si tu utilises des sessions/cookies
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la déconnexion");
            }

            // Redirection après logout
            window.location.href = "/login";
        } catch (error) {
            console.error(error);
        }
    }


    return (

        <div className="flex flex-col min-h-screen bg-[#fafafa]">
            <header className="flex bg-white shadow-md relative z-10">

                <div className=" w-full mx-auto px-4 py-3 flex justify-between items-center ">

                    {/* 1. Logo/Titre (Image dans la maquette) */}

                        {/* 🚨 NOUVEAU CODE POUR L'IMAGE */}
                        <Image
                            src="/images/logo.svg" // 🚨 Assurez-vous que ce nom de fichier est exact
                            alt="Logo WellComm"
                            width={60} // Largeur du logo (à ajuster)
                            height={60} // Hauteur du logo (à ajuster)
                            priority // Pour charger l'image rapidement
                        />
                        {/* --------------------------- */}

                </div>
                <div className="flex items-center space-x-2 sm:space-x-4 mr-4">

                        <Image
                            src="/images/user.svg"
                            alt="Logo WellComm"
                            onClick={() => setIsOpen(true)}
                            width={60}
                            height={60}
                            priority
                        />
                </div>
            </header>
            {isOpen && (
                <div className="absolute right-0 mt-17 w-44 rounded-md bg-white shadow-lg border border-black z-100 mr-2">
                    <button
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-md"
                        onClick={async () => {
                            await logout();
                            setIsOpen(false);
                        }}>
                        Déconnexion
                    </button>
                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-md"
                        onClick={() => {
                            setIsOpen(false);
                        }}>
                        Fermer
                        </button>
                </div>
            )}
            <main className="bg-[#fafafa] flex-1">{children}</main>

        </div>
    )
}