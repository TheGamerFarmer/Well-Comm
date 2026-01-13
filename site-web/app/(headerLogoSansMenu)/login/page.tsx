"use client";

import { useState } from "react";
import Link from "next/link";
import encryptPassword from "../../../functions/encryptPassword"
import logUser from "../../../functions/logUser"
import {useSearchParams} from "next/dist/client/components/navigation";
import {redirect} from "next/dist/client/components/redirect";

export default function LoginPage() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêche le reload de la page

        // Hash du mot de passe
        const hashedPwd = encryptPassword(password);

        if (await logUser(userName, hashedPwd))
            redirect(callbackUrl);
        else
            setErrorMessage("Nom d'utilisateur ou mot de passe incorrect");
    };


    return (
        <form onSubmit={handleLogin}
            className="w-full max-w-md mx-auto flex flex-col bg-white p-10 pb-20 shadow-[0_4px_6px_0_rgba(0,0,0,0.08)] rounded-lg mt-10">
            <label htmlFor="l_Seconnecter"
                   className=" w-full  font-helvetica-neue text-2xl font-bold text-left text-[#0551ab] whitespace-nowrap block mb-4" >Se
                connecter</label>

            <label htmlFor="l_UserName"
                   className=" flex font-montserrat text-sm font-bold text-left text-[#727272]">Nom d&#39;utilisateur</label>

            <input onChange={(e) => setUserName(e.target.value)}
                   className=" h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black" type="text" id="t_UserName" name="t_UserName"/>

            <label htmlFor="t_Mdp"
                   className=" flex font-montserrat text-sm font-bold text-left text-[#727272]">Mot de
                passe</label>

            <input onChange={(e) => setPassword(e.target.value)}
                   className="h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black" type="password" id="t_Mdp" name="t_Mdp"/>

            {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
            <input className=" rounded-full mb-4 mt-1 bg-[#0551ab] text-white py-4 font-bold hover:bg-[#f87c7c]" type="submit" value="Se connecter"/><br/>

            <Link href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="cursor-pointer m-auto flex items-center space-x-2 font-montserrat text-base text-center text-[#20baa7] font-bold">Vous n&#39;avez pas de compte? Créez-en un!</Link>
        </form>
    )
}