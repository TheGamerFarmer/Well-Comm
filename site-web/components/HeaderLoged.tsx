"use client";

import Link from 'next/link';
import Image from 'next/image';
import BurgerScreen from "@/components/BurgerScreen";
import {useEffect, useState} from "react";
import {getCurrentUser} from "@/functions/fil-API";

export default function HeaderLoged() {
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

        <header className="bg-white shadow-md">
            <BurgerScreen/>

            <div className=" ml-20 px-4 py-3 flex justify-between items-center">

                <Link href="/mesAides" className="flex items-center space-x-2">
                    <Image
                        src="/images/logo.svg"
                        alt="Logo WellComm"
                        width={60}
                        height={60}
                        priority
                    />
                </Link>

                <div className="flex items-center space-x-2 sm:space-x-4 mr-4 cursor-pointer rounded-2xl bg-gray-100 pl-2 pr-2"
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
            </div>
            {isOpen && (
                <div className="absolute right-0 w-44 rounded-md bg-white shadow-lg border border-black z-100 mr-2">
                    <Link href="/userSpace">
                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-md"
                            onClick={() => {
                                setIsOpen(false);
                            }}>
                        Profil
                    </button>
                    </Link>
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
        </header>
    );
}