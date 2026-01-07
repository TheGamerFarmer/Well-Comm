"use client";

import { useState } from "react";
import Link from "next/link";
import sha256 from 'crypto-js/sha256';
import {Button} from "@/components/ButtonMain";

export default function LoginPage() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêche le reload de la page

        // Hash du mot de passe
        const hashedPwd = sha256(password + "Bonjour, Ceci est un hash pour du sha256 aueaie").toString();

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: userName,
                    password: hashedPwd,
                }),
            });

            if (response.ok) {
                alert("Login réussi !");
            } else {
                alert("Erreur : nom d'utilisateur ou mot de passe incorrect");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau");
        }
    };


    return (
        <form onSubmit={handleLogin}
            className="w-[466px] mt-12 mx-auto pt-7 pr-[33px] pb-[89px] pl-8 rounded-2xl shadow-[0_4px_6px_0_rgba(0,0,0,0.08)] bg-white flex flex-col">
            <label htmlFor="l_Seconnecter"
                   className=" w-full  font-helvetica-neue text-2xl font-bold text-left text-[#0551ab] whitespace-nowrap block mb-4" >Se
                connecter</label>

            <label htmlFor="l_UserName"
                   className=" flex font-montserrat text-sm font-bold text-left text-[#727272]">Nom d'utilisateur</label>

            <input onChange={(e) => setUserName(e.target.value)}
                   className=" h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black" type="text" id="t_UserName" name="t_UserName"/>

            <label htmlFor="t_Mdp"
                   className=" flex font-montserrat text-sm font-bold text-left text-[#727272]">Mot de
                passe</label>

            <input onChange={(e) => setPassword(e.target.value)}
                   className="h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black" type="password" id="t_Mdp" name="t_Mdp"/>

            <input className=" rounded-full mb-4 mt-1 bg-[#0551ab] text-white py-4 font-bold hover:bg-[#f87c7c]" type="submit" value="Se connecter"/><br/>

            <Link href="/register" className=" m-auto flex items-center space-x-2 font-montserrat text-base text-center text-[#20baa7] font-bold">Vous n'avez pas de compte? Créez-en un!</Link>
        </form>
    )
}