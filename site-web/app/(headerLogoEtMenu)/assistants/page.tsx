"use client";

import React, {useEffect, useState} from "react";
import {Button} from "@/components/ButtonMain";
import FilArianne from "@/components/FilArianne";
import { useCurrentDossier } from "@/hooks/useCurrentDossier";

import {
    getCurrentUser,
    getRecords,
    getChannels,
    mapCategoryToEnum,
    createChannel,
    FilResponse,
    DossierResponse
} from "@/functions/fil-API";

type Invitation = {
    id: string;
    username: string;
    role: "Aidant" | "Infirmier(e)" | "Aide soignant(e)" | "Aide à domicile";
};

export default function AssistantsPage() {

    const [currentUserName, setCurrentUserName] = useState<string>("");
    const [records, setRecords] = useState<DossierResponse[]>([]);
    const [activeRecordId, setActiveRecordId] = useState<number | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenPerms,setIsOpenPerms] = useState(false);
    const [invitationToDelete, setInvitationToDelete] = useState<Invitation | null>(null);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [role, setRole] = useState<Invitation["role"]>("Aidant");
    const [username, setUsername] = useState("");
    const [userName, setUserName] = useState<string | null>(null);

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        addAccessToCurrentRecord("Aidant");
    };

    useEffect(() => {
        getCurrentUser().then(setUserName);
    }, []);

    const { currentDossier, loading } = useCurrentDossier(userName);

    //afficher la liste d'assistants
    useEffect(() => {
        if (!userName) return;

        const fetchAssistants = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/${userName}/recordacount`,
                    { credentials: "include" }
                );
                if (!res.ok) throw new Error("Erreur chargement assistants");

                const data: Invitation[] = await res.json();
                setInvitations(data);
            }catch (err) {
                console.error(err);
            }
        };
        fetchAssistants();
    }, [userName]);
    
//ajouter un assitant au dossier
    const addAccessToCurrentRecord = async (title: string) => {
        if (!userName || !currentDossier) {
            console.error("Aucun dossier sélectionné");
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:8080/api/${userName}/addAccess/current_record/${encodeURIComponent(
                    username
                )}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        recordId: currentDossier,
                        title: title,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Impossible d'ajouter l'accès");
            }

            setInvitations((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    username,
                    role,
                },
            ]);

            setUsername("");
            setRole("Aidant");
            setIsOpen(false);

            console.log("Accès ajouté au dossier", currentDossier);
        } catch (err) {
            console.error(err);
        }
    };

    return (

        <>
            <div className=" w-full p-6 md:p-10 font-sans min-h-screen bg-[#f1f2f2] ">
                <p className="text-3xl font-bold text-[#0551ab]">
                    Assistants
                </p>
                <FilArianne/>

                <div className="text-black">
                    {currentDossier ? (
                        <p>Dossier courant : {currentDossier}</p>
                    ) : (
                        <p>Aucun dossier sélectionné</p>
                    )}
                </div>

                <div className="flex flex-col items-end my-4">
                    <Button variant="validate" type="button"
                            onClick={() => setIsOpen(true)}>
                        Ajouter un(e) Assistant(e)
                    </Button>
                </div>

                {/*liste des assistants*/}
                <div className=" space-y-4 bg-white rounded-lg shadow-[0_4px_6px_0_rgba(0,0,0,0.08)] px-4 py-6">
                    {invitations.map((inv) => (
                        <div
                            key={inv.id}
                            className="flex flex-col md:flex-row justify-between items-left p-4 rounded-lg bg-[#f6f6f6]">
                            <div className="flex flex-nowrap items-center gap-4 m-4">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${inv.username}&background=0551ab&color=fff`}
                                    alt="avatar"
                                    className="w-12 h-12 rounded-full"
                                />
                                <ul>
                                    <li>
                                        <span className="font-bold text-black ">{inv.username}</span>
                                    </li>
                                    <li>
                                        <span className="text-gray-500 ">ajouté le :  </span>
                                    </li>
                                </ul>
                            </div>



                            <div className="flex flex-col md:flex-row items-center gap-4 p-4">
                                <Button variant="secondary" type="button" onClick={() => setIsOpenPerms(true)}>
                                    Permissions
                                </Button>
                                <select
                                    value={inv.role}
                                    onChange={(e) =>
                                        setInvitations((prev) =>
                                            prev.map((i) =>
                                                i.id === inv.id
                                                    ? { ...i, role: e.target.value as Invitation["role"] }
                                                    : i
                                            )
                                        )
                                    }
                                    className="flex flex-col border rounded-lg px-3 py-2 bg-white text-[#20baa7] font-bold">
                                    <option>Aidant</option>
                                    <option>Infirmier(e)</option>
                                    <option>Aide soignant(e)</option>
                                    <option>Aide à domicile</option>
                                </select>
                                <button
                                    onClick={() => setInvitationToDelete(inv)}
                                    className="text-red-600 font-bold cursor-pointer hover:bg-black/10 hover:scale-110 rounded-full transition delay-10 duration-300 ease-in-out">

                                    <svg className="m-4" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><g fill="none" stroke="#c10808" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"/><path d="M4 5h16"/><path d="M10 4h4M10 9v7M14 9v7"/></g></svg>
                                </button>
                            </div>

                        </div>
                    ))}
                </div>



                {/* pop-up ajouter assistant*/}
                    {isOpen && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-2xl w-[400px]">
                                <h2 className="text-lg font-bold mb-4 text-[#0551ab]">Nouveau aidé</h2>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (!username.trim()) return;
                                        addAccessToCurrentRecord(role);
                                    }}
                                    className="flex flex-col gap-4"
                                >
                                    <input
                                        type="text"
                                        placeholder="Nom d'utilisateur de l'assistant"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="border rounded-lg p-2 text-black"
                                        required
                                    />

                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as Invitation["role"])}
                                        className="border rounded-lg p-2 text-black">
                                        <option>Aidant</option>
                                        <option>Infirmier(e)</option>
                                        <option>Médecin</option>
                                        <option>Aide soignant(e)</option>
                                        <option>Aide à domicile</option>
                                    </select>

                                    <div className="flex justify-center gap-3">
                                        <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>
                                            Annuler
                                        </Button>

                                        <Button variant="primary" type="submit" onClick={() => setIsOpen(false)}>
                                            Ajouter
                                        </Button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    )}


                </div>

            {/*pop-up delete*/}
            {invitationToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-[400px] flex flex-col items-center gap-y-4">

                        <img src="/images/icon-attention2x.png" alt="Attention" width={50} />

                        <p className="font-bold text-blue-800 text-xl text-center">
                            Voulez-vous supprimer l’invitation de
                            <br />
                            <span className="font-bold">
                    {invitationToDelete.username}
                </span>
                            ?
                        </p>

                        <p className="text-[#727272]">
                            Ceci sera supprimé définitivement.
                        </p>

                        <div className="flex gap-4">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    if (!invitationToDelete) return;

                                    setInvitations((prev) =>
                                        prev.filter((inv) => inv.id !== invitationToDelete.id)
                                    );

                                    setInvitationToDelete(null);
                                }}

                            >
                                Oui
                            </Button>

                            <Button
                                onClick={() => setInvitationToDelete(null)}
                            >
                                Non
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* pop-up permissions */}
            {isOpenPerms && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-[400px]">
                        <h2 className="text-lg font-bold mb-4 text-[#0551ab]">Permissions</h2>

                        <form className="flex flex-col gap-3 p-4 m-4 rounded-lg border-2 border-solid border-[#20baa7]">
                            <div className="flex justify-between">
                                <label htmlFor="permIsMedecin" className=" text-black"> Est un médecin </label><br/>
                                <input type="checkbox" id="permIsMedecin" name="permIsMedecin" value="PermIsMedecin" className=" scale-150"/>
                            </div>

                            <div className="flex justify-between">
                                <label htmlFor="permModifierAgenda" className=" text-black"> Peut modifier l'agenda </label><br/>
                                <input type="checkbox" id="permModifierAgenda" name="permModifierAgenda" value="PermModifierAgenda" className=" scale-150"/>
                            </div>

                            <div className="flex justify-between">
                                <label htmlFor="permAssignerPerms" className=" text-black"> Peut assigner des permissions </label><br/>
                                <input type="checkbox" id="permAssignerPerms" name="permAssignerPerms" value="PermAssignerPerms" className=" scale-150"/>
                            </div>

                            <div className="flex justify-between">
                                <label htmlFor="permAddAssistant" className=" text-black"> Peut ajouter un(e) assistant(e) </label><br/>
                                <input type="checkbox" id="permAddAssistant" name="permAddAssistant" value="PermAddAssistant" className=" scale-150"/>
                            </div>

                            <div className="flex justify-between">
                                <label htmlFor="permSendMessage" className=" text-black"> Peut envoyer des messages </label><br/>
                                <input type="checkbox" id="permSendMessage" name="permSendMessage" value="PermSendMessage" className=" scale-150"/>
                            </div>

                        </form>

                        <div className="flex justify-center gap-3">

                            <Button variant="secondary" type="button" onClick={() => setIsOpenPerms(false)}>
                                    Annuler
                                </Button>

                                <Button variant="primary" type="submit" onClick={() => setIsOpenPerms(false)}>
                                    Confirmer
                                </Button>


                            </div>
                    </div>
                </div>
            )}

        </>
    )
}