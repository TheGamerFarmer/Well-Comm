"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import encryptPassword from "../../../functions/encryptPassword";
import logUser from "../../../functions/logUser";
import { useSearchParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../config";

function RegisterForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const searchParams = useSearchParams();
    const router = useRouter();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !userName || !password || !confirmPassword) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        const hashedPwd = encryptPassword(password);

        try {
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    userName: userName,
                    password: hashedPwd,
                    firstName: firstName,
                    lastName: lastName,
                }),
            });

            if (response.ok) {
                await logUser(userName, hashedPwd);
                router.push(callbackUrl);
            } else {
                setErrorMessage("L'utilisateur existe déjà");
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("Une erreur est survenue.");
        }
    };

    return (
        <form onSubmit={handleLogin}
              className="w-full max-w-md mx-auto flex flex-col bg-white p-10 pb-20 shadow-[0_4px_6px_0_rgba(0,0,0,0.08)] rounded-lg mt-10" >
            <h2 className="font-helvetica-neue text-2xl font-bold text-[#0551ab] mb-6">Créer un compte</h2>

            <label className="font-montserrat text-sm font-bold text-[#727272]">Prénom</label>
            <input type="text" onChange={(e) => setFirstName(e.target.value)}
                   className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>

            <label className="font-montserrat text-sm font-bold text-[#727272]">Nom</label>
            <input type="text" onChange={(e) => setLastName(e.target.value)}
                   className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>

            <label className="font-montserrat text-sm font-bold text-[#727272]">Nom d&#39;utilisateur</label>
            <input type="text" onChange={(e) => setUserName(e.target.value)}
                   className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>

            <label className="font-montserrat text-sm font-bold text-[#727272]">Mot de passe</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)}
                   className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>

            <label className="font-montserrat text-sm font-bold text-[#727272]">Confirmer le mot de passe</label>
            <input type="password" onChange={(e) => setConfirmPassword(e.target.value)}
                   className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>

            {errorMessage && <p className="text-red-600 mb-4 text-sm font-bold">{errorMessage}</p>}

            <input className="cursor-pointer w-full rounded-full mb-4 mt-1 bg-[#0551ab] text-white py-4 font-bold hover:bg-[#f87c7c]"
                   type="submit" value="S'inscrire"/>

            <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                  className="self-center mt-4 font-montserrat text-base text-[#20baa7] font-bold">
                J&#39;ai déjà un compte
            </Link>
        </form>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="text-center p-10">Chargement...</div>}>
            <RegisterForm />
        </Suspense>
    );
}