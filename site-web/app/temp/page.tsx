"use client";

import React, { useState, useEffect } from "react";

// --- CONFIGURATION ---
const API_BASE_URL = "http://localhost:8080";

export default function UserTestPage() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const [userData, setUserData] = useState<never>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Appel à la fonction getCurrentUser (mapping /api/accounts/me basé sur votre page.tsx)
                const response = await fetch(`${API_BASE_URL}/api/accounts/me`, {
                    credentials: 'include',
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    const errorText = await response.text();
                    setError(`Erreur ${response.status}: ${errorText || "Non autorisé"}`);
                }
            } catch (err) {
                setError("Erreur de connexion au serveur backend");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f1f2f2] font-montserrat p-6">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 max-w-md w-full text-center">
                <h1 className="text-[#0551ab] font-bold text-2xl mb-6">Réponse getCurrentUser</h1>

                {loading ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-[#26b3a9]/20 border-t-[#26b3a9] rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium italic tracking-wide">Récupération des données...</p>
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold">
                        {error}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Utilisateur Connecté</p>
                        <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                            <span className="text-[#26b3a9] text-3xl font-black">
                                {userData?.userName || "Inconnu"}
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs">
                            Format JSON reçu : {JSON.stringify(userData)}
                        </p>
                    </div>
                )}

                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 text-sm font-bold text-[#0551ab] hover:underline uppercase tracking-tighter"
                >
                    Actualiser
                </button>
            </div>
        </div>
    );
}