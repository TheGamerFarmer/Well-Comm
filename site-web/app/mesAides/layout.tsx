"use client";

import Image from "next/image";
import {useEffect, useState} from "react";
import {getCurrentUserId} from "@/functions/fil-API";
import { API_BASE_URL } from "@/config";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        getCurrentUserId().then(setUserId);
    }, []);

    async function logout() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/${userId}/logout`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                console.log("Erreur lors de la déconnexion");
            }

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

                <div className="flex items-center space-x-2 sm:space-x-4 mr-4 cursor-pointer rounded-2xl bg-gray-100 mt-2 mb-2 pl-2 pr-2"
                onClick={() => setIsOpen(true)}>

                    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.333 11.666a1 1 0 0 1 .096 1.996l-.096.004H2.667a1 1 0 0 1-.096-1.995l.095-.005h10.667zm0-4.666a1 1 0 0 1 0 2H2.667a1 1 0 1 1 0-2h10.666zm0-4.667a1 1 0 0 1 0 2H2.667a1 1 0 0 1 0-2h10.666z" fill="#215A9E"/>
                    </svg>

                        <Image
                            src="/images/user.svg"
                            alt="Logo WellComm"
                            width={60}
                            height={60}
                            priority
                        />
                </div>
            </header>
            {isOpen && (
                <div className="absolute right-0 mt-18 w-44 rounded-md bg-white shadow-lg border border-black z-100 mr-2">
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