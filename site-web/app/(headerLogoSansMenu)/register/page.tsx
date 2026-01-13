"use client";

import Link from "next/link";
import { useState } from "react";
import encryptPassword from "../../../functions/encryptPassword"
import logUser from "../../../functions/logUser"
import {redirect} from "next/dist/client/components/redirect";
import {useSearchParams} from "next/dist/client/components/navigation";

export default function RegisterPage() {

    // ⚡ States pour les inputs
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1️⃣ Vérifier tous les champs
        if (!firstName || !lastName || !userName || !password || !confirmPassword) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }

        // 2️⃣ Vérifier mots de passe identiques
        if (password !== confirmPassword) {
            setErrorMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        // 3️⃣ Interdire certains caractères
        const forbiddenChars = ["\\", ";", "\"", "'", "#", "/", "<", ">", "&", "-", "?", "."];
        forbiddenChars.forEach(char => {
            firstName.replace(char, "\\" + char);
            lastName.replace(char, "\\" + char);
            userName.replace(char, "\\" + char);
            password.replace(char, "\\" + char);
        })

        const hashedPwd = encryptPassword(password);

        try {
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: userName,
                    password: hashedPwd,
                    firstName: firstName,
                    lastName: lastName,
                }),
            });

            if (response.ok) {
                await logUser(userName, hashedPwd);
                redirect(callbackUrl);
            } else {
                setErrorMessage("L'utilisateur éxiste déjà");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <form  onSubmit={handleLogin}
                   className=" w-full max-w-md mx-auto flex flex-col bg-white p-10 pb-20 shadow-[0_4px_6px_0_rgba(0,0,0,0.08)] rounded-lg mt-10" >
                <label htmlFor="l_CreateAccount" className="w-37 h-[29px] mr-[305px] mb-[26.5px] font-helvetica-neue text-2xl font-bold text-left text-[#0551ab] whitespace-nowrap" >Créer un compte</label>

                <label htmlFor="l_FirstName" className="w-37 h-[17px] flex font-montserrat text-sm font-bold text-left text-[#727272] ">Prénom</label>
                <input type="text" id="t_FirstName" name="t_FirstName"
                       onChange={(e) => setFirstName(e.target.value)}
                       className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black"/>

                <label htmlFor="l_LasteName" className="w-37 h-[17px] flex font-montserrat text-sm font-bold text-left text-[#727272] ">Nom</label>
                <input type="text" id="t_LastName" name="t_LastName"
                       onChange={(e) => setLastName(e.target.value)}
                       className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black"/>

                <label htmlFor="l_UserName" className="w-37 h-[17px] flex font-montserrat text-sm font-bold text-left text-[#727272] whitespace-nowrap">Nom d'utilisateur (identifiant)</label>
                <input type="text" id="t_UserName" name="t_UserName"
                       onChange={(e) => setUserName(e.target.value)}
                       className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black"/>

                <label htmlFor="l_PassWord" className="w-37 h-[17px] flex font-montserrat text-sm font-bold text-left text-[#727272] ">Mot de passe</label>
                <input type="password" id="t_PassWord" name="t_PassWord"
                       onChange={(e) => setPassword(e.target.value)}
                       className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black"/>

                <label htmlFor="l_ConfirmPassWord" className="w-37 h-[17px] flex font-montserrat text-sm font-bold text-left text-[#727272] whitespace-nowrap">Confirmer le mot de passe</label>
                <input type="password" id="t_ConfirmPassWord" name="t_ConfirmPassWord"
                       onChange={(e) => setConfirmPassword(e.target.value)}
                       className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black"/>

                {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
                <input className="cursor-pointer w-full rounded-full mb-4 mt-1 bg-[#0551ab] text-white py-4 font-bold hover:bg-[#f87c7c]" type="submit" value="S'inscrire"/><br/>

                <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="self-center mt-4 font-montserrat text-base text-[#20baa7] font-bold">J'ai déjà un compte</Link>

            </form>

        </>

    )
}