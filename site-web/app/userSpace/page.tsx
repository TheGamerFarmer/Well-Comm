"use client";

import { useState, useEffect } from "react";
import HeaderLoged from "@/components/HeaderLoged";
import { Button } from "@/components/ButtonMain";
import Image from "next/image";

export default function UserSpace() {
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);



//     const [prenom, setPrenom] = useState("");
//     const [nom, setNom] = useState("");
//     const [username, setUsername] = useState("");
//
//
//     useEffect(() => {
//         const storedUsername = localStorage.getItem("username");
//         const storedPrenom = localStorage.getItem("prenom");
//         const storedNom = localStorage.getItem("nom");
//
// //         if (storedUsername) setUsername(storedUsername);
// // /*        if (storedPrenom) setPrenom(storedPrenom);
// //         if (storedNom) setNom(storedNom);*/
// //     }, []);


    const handleSavePassword = () => {
        if (newPassword !== confirmPassword) {
            alert("Les nouveaux mots de passe ne correspondent pas!");
            return;
        }


        alert("Mot de passe enregistré !\n(Current: " + currentPassword +
            ", New: " + newPassword + ")");

        // Сброс полей после сохранения
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordFields(false);
    };

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <p className="p-4 font-bold text-[#0551ab] text-2xl">Mon Profil</p>

            <div className="flex justify-center items-center flex-col bg-[#ffffff] w-[100%] rounded-xl border-20 border-white">

                <div className="p-8 relative overflow-visible">
                    <Image
                        src="/images/avatar.svg"
                        alt="user avatar"
                        width={130}
                        height={130}
                        priority
                    />

                    <Image
                        src="/images/add_photo.svg"
                        alt="add photo"
                        width={32}
                        height={32}
                        priority
                        className="absolute bottom-11 right-11 z-3 translate-x-1/4 translate-y-1/4 cursor-pointer"
                    />
                </div>

                <form className="mx-auto max-w-200">
                    {/* Поля профиля */}
                    <div className="flex flex-col md:flex-row md:gap-4">
                        <div>
                            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Prénom</label>
                            <input
                                type="text"
                                // value={prenom}
                                // onChange={(e) => setPrenom(e.target.value)}
                                className="w-[300px] h-[50px] bg-white self-stretch flex flex-row justify-between items-start py-[14px] ph-4 border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"
                            />
                        </div>
                        <div>
                            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Nom</label>
                            <input
                                type="text"
                                // value={nom}
                                // onChange={(e) => setNom(e.target.value)}
                                className="w-[300px] h-[50px] bg-white self-stretch flex flex-row justify-between items-start py-[14px] ph-4 border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:gap-4">
                        <div>
                            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Date de naissance</label>
                            <input
                                type="date"
                                className="w-[300px] h-[50px] bg-white self-stretch flex flex-row justify-between items-start py-[14px] ph-4 border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"
                            />
                        </div>
                        <div>
                            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Nom utilisateur</label>
                            <input
                                type="text"
                                // value={username}
                                // readOnly
                                className="w-[300px] h-[50px] bg-white self-stretch flex flex-row justify-between items-start py-[14px] ph-4 border-solid bg-[#fff]h-10 rounded-lg border-2 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 justify-end mt-4 mb-4 lg:mt-16 lg:mb-16">
                        <Button variant="cancel" link={""}>Annuler</Button>
                        <Button type="submit" link={""} variant={"primary"}>Enregistrer</Button>
                    </div>


                    <div className="mt-8">
                        <p
                            className="text-[#0551ab] font-bold hover:underline p-4 mb-4 lg:mt-16 lg:mb-16 rounded-[10px] bg-[#f6f6f6] h-[60px] cursor-pointer"
                            onClick={() => setShowPasswordFields(!showPasswordFields)}
                        >
                            Changer le mot de passe
                        </p>

                        {showPasswordFields && (
                            <div className="flex flex-col gap-5 items-end">
                                <input
                                    type="password"
                                    placeholder="Mot de passe actuel"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-[300px] h-[50px] bg-white rounded-lg border-2 border-[#dfdfdf] p-3 text-black text-sm"
                                />

                                <input
                                    type="password"
                                    placeholder="Nouveau mot de passe"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-[300px] h-[50px] bg-white rounded-lg border-2 border-[#dfdfdf] p-3 text-black text-sm"
                                />

                                <input
                                    type="password"
                                    placeholder="Confirmer le nouveau mot de passe"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-[300px] h-[50px] bg-white rounded-lg border-2 border-[#dfdfdf] p-3 text-black text-sm"
                                />

                                <Button
                                    type="button"
                                    variant="primary"
                                    link={""}
                                    // onClick={handleSavePassword}
                                >
                                    Enregistrer
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex row py-4 mb-4 lg:mt-16 lg:mb-16 border-t-[#dfdfdf] border-t-2 h-[60px] gap-4">
                        <Image
                            src="/images/icons/icons-delete.svg"
                            alt="delete"
                            width={24}
                            height={24}
                            priority
                        />
                        <p
                            className="text-[#f67a7a] hover:underline text-xm mt-[3px] cursor-pointer"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Supprimer le compte
                        </p>
                    </div>

                </form>
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl w-[420px] p-8 shadow-xl">


                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            ✕
                        </button>

                        <div className="flex justify-center mb-4">
                            <Image
                                src="/images/icons/attention.svg"
                                alt="attention"
                                width={48}
                                height={48}
                                priority
                            />
                        </div>


                        <h2 className="text-center text-xl font-bold text-[#0551ab] mb-2">
                            Voulez-vous supprimer?
                        </h2>
                        <p className="text-center text-gray-700 mb-6">
                            Ceci sera supprimé définitivement
                        </p>


                        <div className="flex justify-center gap-4">

                            <Button variant={"cancel"} link={""}
                            // onClick={() => setShowDeleteModal(false)}
                                >
                                Non
                            </Button>

                            <Button variant={"validate"} link={""} // onClick={() => {
                                                                     //     console.log("DELETE ACCOUNT");
                                    //     setShowDeleteModal(false);
                                    // }}
                            > Oui
                            </Button>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
