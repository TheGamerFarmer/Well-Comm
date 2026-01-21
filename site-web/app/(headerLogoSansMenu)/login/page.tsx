"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import {encryptPassword} from "@/functions/encryptPassword";
import logUser from "@/functions/logUser";
import { useSearchParams, useRouter } from "next/navigation";
import {sanitize} from "@/functions/Sanitize";

// 1. Move the logic into a separate component
function LoginForm() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const searchParams = useSearchParams();
    const router = useRouter();

    const callbackUrl = searchParams.get("callbackUrl") || "/mesAides";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        const hashedPwd = encryptPassword(password);
        const result = await logUser(userName, hashedPwd);

        if (result.success) {
            localStorage.setItem("username", userName);
            if (result.userId) {
                localStorage.setItem("userId", result.userId.toString());
            }
            router.push(callbackUrl);
        } else {
            setErrorMessage(result.message || "Une erreur est survenue");
        }
    };

    return (
        <form onSubmit={handleLogin}
              className="w-full max-w-md mx-auto flex flex-col bg-white p-10 pb-20 shadow-[0_4px_6px_0_rgba(0,0,0,0.08)] rounded-lg mt-10">
            <label className="w-full font-helvetica-neue text-2xl font-bold text-left text-[#0551ab] whitespace-nowrap block mb-4">
                Se connecter
            </label>

            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">
                Nom d&#39;utilisateur
            </label>
            <input
                onChange={(e) => setUserName(sanitize(e.target.value))}
                className="h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black"
                type="text"
            />

            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">
                Mot de passe
            </label>
            <input
                onChange={(e) => setPassword(sanitize(e.target.value))}
                className="h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black"
                type="password"
            />

            {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

            <input
                className="rounded-full mb-4 mt-1 bg-[#0551ab] text-white py-4 font-bold hover:bg-[#f87c7c] cursor-pointer"
                type="submit"
                value="Se connecter"
            />

            <Link
                href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="cursor-pointer m-auto flex items-center space-x-2 font-montserrat text-base text-center text-[#20baa7] font-bold"
            >
                Vous n&#39;avez pas de compte? Créez-en un!
            </Link>
        </form>
    );
}

// 2. The default export wraps the component in Suspense
export default function LoginPage() {
    return (
        <Suspense fallback={<div className="text-center mt-10">Chargement...</div>}>
            <LoginForm />
        </Suspense>
    );
}