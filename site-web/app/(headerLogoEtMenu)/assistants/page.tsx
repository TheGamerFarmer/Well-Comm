"use client";

import React, {useCallback, useEffect, useState} from "react";
import {Button} from "@/components/ButtonMain";
import FilArianne from "@/components/FilArianne";
import {getCurrentUser} from "@/functions/fil-API";
import { API_BASE_URL } from "@/config";
import Image from "next/image";
import {sanitize} from "@/functions/Sanitize";
import {getPermissions, Permission} from "@/functions/Permissions";


//"Aidant" | "Infirmier(e)" | "Aide soignant(e)" | "Aide à domicile"
type Invitation = {
    id: number;
    title: string;
    accountUserName: string;
    dateCreation: string;
    recordId: number;
};

export default function AssistantsPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenPerms,setIsOpenPerms] = useState(false);
    const [invitationToDelete, setInvitationToDelete] = useState<Invitation | null>(null);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [title, setTitle] = useState<Invitation["title"]>("Aidant");
    const [username, setUsername] = useState("");
    const [userName, setUserName] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [recordAccount, setRecordAccount] = useState<{ permissions: Permission[] } | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
    const [selectedAssistant, setSelectedAssistant] = useState<Invitation | null>(null);


    useEffect(() => {
        getCurrentUser().then(setUserName);
    }, []);

    const [activeRecordId, setActiveRecordId] = useState<number | null>(null);


    useEffect(() => {
        const localRecordId = localStorage.getItem('activeRecordId');
        if (localRecordId) {
            const id = Number(localRecordId);
            if (!isNaN(id)) {
                setActiveRecordId(id);
            }
        }
    }, [setActiveRecordId])

    useEffect(() => {
        let assistantName: string | null = null; // ou "" si tu préfères

        if (selectedAssistant) {
            assistantName = selectedAssistant.accountUserName;
        }
        if (!assistantName || !activeRecordId || ! userName) return;

        const fetchPermissions = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/api/${userName}/recordsaccount/${activeRecordId}/autrepermissions/${assistantName}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!res.ok) {
                    console.log("Erreur chargement permissions");
                    return;
                }

                const data: Permission[] = await res.json();
                setSelectedPermissions(data);
            } catch (error) {
                console.error("Erreur fetch permissions", error);
            }
        };

        fetchPermissions();
    }, [username, activeRecordId, selectedAssistant]);


    useEffect(() => {
        if (!userName || !activeRecordId) {
            setRecordAccount(null);
            return;
        }

        getPermissions(userName, activeRecordId)
            .then((permissions: Permission[]) => {
                setRecordAccount({ permissions });
            })
            .catch(() => {
                setRecordAccount({ permissions: [] });
            });
    }, [userName, activeRecordId]);

    const permissions = recordAccount?.permissions ?? [];


    //récupérer les assistans de currentDossier
    const fetchAssistants = useCallback(async () => {
        if (!userName || !activeRecordId) return;

        const res = await fetch(
            `${API_BASE_URL}/api/${userName}/recordsaccount/${activeRecordId}/assistants`,
            {credentials: "include"}
        );

        if (!res.ok) {
            console.log("Erreur chargement assistants");
            return;
        }

        const data: Invitation[] = await res.json();
        setInvitations(data);
    }, [activeRecordId, userName]);
    
    //afficher la liste d'assistants quand on charge la page
    useEffect(() => {
        setTimeout(() => {
            fetchAssistants().then();
        }, 0);
    }, [userName, activeRecordId, fetchAssistants]);
    
//ajouter un assitant au dossier
    const addAccessToCurrentRecord = async (title: string) => {
        if (!userName || !activeRecordId) {
            console.log("Aucun dossier sélectionné");
            return;
        }

        const res = await fetch(
            `${API_BASE_URL}/api/${userName}/addAccess/current_record/${encodeURIComponent(
                username
            )}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recordId: activeRecordId,
                    title: title,
                }),
            }
        );

        if (!res.ok) {
            const errorMessage = await res.text();
            setError(errorMessage);
            console.log(errorMessage);
            return;
        }

        await fetchAssistants();
        setIsOpen(false);

        console.log("Accès ajouté au dossier", activeRecordId);
    }

//supprimer un assistant
    const removeAccess = async (name: string, id: number ) => {
        if (!userName || !activeRecordId) {
            console.log("Aucun dossier sélectionné");
            return;
        }

        const res = await fetch(`${API_BASE_URL}/api/${userName}/deleteAccess/current_record/${name}/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!res.ok) {
            const errorMessage = await res.text();
            console.log(errorMessage);
            return;
        }

        await fetchAssistants();
        console.log("recordAccount supprimé ");
    };


    //mettre a jour le role d'un assistant
    const updateRoleAccess = async (name: string, id: number, title: string) => {
        if (!userName || !activeRecordId) {
            console.log("Aucun dossier sélectionné");
            return;
        }

        const res = await fetch (`${API_BASE_URL}/api/${userName}/updateRoleAccess/current_record/${name}/${id}/${title}`,{
            method: "PUT",
            credentials: "include",
        });

        if (!res.ok) {
            const errorMessage = await res.text();
            console.log(errorMessage);
            return;
        }
        await fetchAssistants();
        console.log("recordAccount modifié ")
    }

    const openPermissionsModal = (assistant: Invitation) => {
        setSelectedAssistant(assistant);
        setIsOpenPerms(true);
    };

    const togglePermission = (perm: Permission) => {
        setSelectedPermissions((prev) =>
            prev.includes(perm)
                ? prev.filter((p) => p !== perm)
                : [...prev, perm]
        );
    };

    const savePermissions = async () => {
        let assistantName: string | null = null; // ou "" si tu préfères

        if (selectedAssistant) {
            assistantName = selectedAssistant.accountUserName;
        }
        if (!selectedAssistant || !activeRecordId) return;

        await fetch(
            `${API_BASE_URL}/api/${userName}/recordsaccount/${activeRecordId}/changepermissions`,
            {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: assistantName,
                    permissions: selectedPermissions
                }),
            }
        );

        setIsOpenPerms(false);
    };


    return (

        <>
            <div className=" w-full p-6 md:p-10 font-sans min-h-screen bg-[#f1f2f2] ">
                <p className="text-3xl font-bold text-[#0551ab]">
                    Assistants
                </p>
                <FilArianne/>
                {permissions.includes(Permission.INVITE) && (
                <div className="flex flex-col items-end my-4">
                    <Button variant="validate" type="button"
                            onClickAction={() => setIsOpen(true)}
                            link={""}>
                        Ajouter un(e) Assistant(e)
                    </Button>
                </div>
                )}

                {/*liste des assistants*/}
                <div className=" space-y-4 bg-white rounded-lg shadow-[0_4px_6px_0_rgba(0,0,0,0.08)] px-4 py-6">
                    {invitations.map((inv) => (
                        <div
                            key={inv.id}
                            className="flex flex-col md:flex-row justify-between items-left p-4 rounded-lg bg-[#f6f6f6]">
                            <div className="flex flex-nowrap items-center gap-4 m-4">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${inv.accountUserName}&background=0551ab&color=fff`}
                                    alt="avatar"
                                    className="w-12 h-12 rounded-full"
                                />
                                <ul>
                                    <li>
                                        <span className="font-bold text-black ">{inv.accountUserName}</span>
                                    </li>
                                    <li>
                                        <span className="text-gray-500 ">ajouté le : {new Date(inv.dateCreation).toLocaleDateString()} </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-4 p-4">
                                {permissions.includes(Permission.ASSIGN_PERMISSIONS) && (
                                <Button variant="secondary" type="button" onClickAction={() => openPermissionsModal(inv)} link={""}>
                                    Permissions
                                </Button>
                                )}

                                {permissions.includes(Permission.ASSIGN_PERMISSIONS) && (
                                <select
                                    value={inv.title}
                                    onChange={(e) => {
                                        if ( !activeRecordId)
                                            return;

                                        updateRoleAccess(inv.accountUserName, activeRecordId, sanitize(e.target.value)).then()
                                    }}
                                    className="flex flex-col cursor-pointer border rounded-lg px-3 py-2 bg-white text-[#20baa7] font-bold">
                                    <option value="Aidant">Aidant</option>
                                    <option value="Employée">Employé</option>
                                </select>
                                )}

                                {permissions.includes(Permission.INVITE) && (
                                <button
                                    onClick={() => setInvitationToDelete(inv)}
                                    className="text-red-600 font-bold cursor-pointer hover:bg-black/10 hover:scale-110 rounded-full transition delay-10 duration-300 ease-in-out">

                                    <svg className="m-4" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><g fill="none" stroke="#c10808" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"/><path d="M4 5h16"/><path d="M10 4h4M10 9v7M14 9v7"/></g></svg>
                                </button>
                                )}
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
                                        addAccessToCurrentRecord(title).then();
                                    }}
                                    className="flex flex-col gap-4"
                                >
                                    <input
                                        type="text"
                                        placeholder="Nom d'utilisateur de l'assistant"
                                        value={username}
                                        onChange={(e) => setUsername(sanitize(e.target.value))}
                                        className="border rounded-lg p-2 text-black"
                                        required
                                    />

                                    <select
                                        id="title"
                                        name="title"
                                        value={title}
                                        onChange={(e) => setTitle(sanitize(e.target.value))}
                                        className="flex flex-col border rounded-lg px-3 py-2 bg-white text-black">
                                        <option value="AIDANT">Aidant</option>
                                        <option value="EMPLOYEE">Employé</option>
                                    </select>

                                    <p className="text-red-500 font-bold text-center">{error}</p>

                                    <div className="flex justify-center gap-3">
                                        <Button variant="secondary" type="button" onClickAction={() => setIsOpen(false)} link={""}>
                                            Annuler
                                        </Button>

                                        <Button variant="primary" type="submit" link={""}>
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

                        <Image src="/images/icons/attention.svg" alt="attention" width={48} height={48} priority />

                        <p className="font-bold text-blue-800 text-xl text-center">
                            Voulez-vous supprimer l’invitation de
                            <br />
                            <span className="font-bold">
                    {invitationToDelete.accountUserName}
                </span>
                            ?
                        </p>

                        <p className="text-[#727272]">
                            Ceci sera supprimé définitivement.
                        </p>

                        <div className="flex gap-4">

                            <Button
                                variant="secondary"
                                onClickAction={() => {
                                    if (!invitationToDelete?.accountUserName || !activeRecordId)
                                        return;
                                    
                                    removeAccess(invitationToDelete.accountUserName, activeRecordId).then();
                                    setInvitationToDelete(null);}}
                                link={""}>
                                Oui
                            </Button>

                            <Button onClickAction={() => setInvitationToDelete(null)} link={""}>
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
                                <label htmlFor="permModifierAgenda" className=" text-black"> Peut modifier l&#39;agenda </label><br/>
                                <input type="checkbox" id="permModifierAgenda" name="permModifierAgenda" value="PermModifierAgenda" className=" scale-150"
                                       checked={selectedPermissions.includes(Permission.EDIT_CALENDAR)}
                                       onChange={() => togglePermission(Permission.EDIT_CALENDAR)}/>
                            </div>

                            <div className="flex justify-between">
                                <label htmlFor="permModifierAgenda" className=" text-black"> Peut voir l&#39;agenda </label><br/>
                                <input type="checkbox" id="permModifierAgenda" name="permModifierAgenda" value="PermModifierAgenda" className=" scale-150"
                                       checked={selectedPermissions.includes(Permission.SEE_CALENDAR)}
                                       onChange={() => togglePermission(Permission.SEE_CALENDAR)}/>
                            </div>

                            <div className="flex justify-between">
                                <label htmlFor="permAssignerPerms" className=" text-black"> Peut assigner des permissions </label><br/>
                                <input type="checkbox" id="permAssignerPerms" name="permAssignerPerms" value="PermAssignerPerms" className=" scale-150"
                                       checked={selectedPermissions.includes(Permission.ASSIGN_PERMISSIONS)}
                                       onChange={() => togglePermission(Permission.ASSIGN_PERMISSIONS)}/>
                            </div>

                            <div className="flex justify-between">
                                <label htmlFor="permAddAssistant" className=" text-black"> Peut ajouter un(e) assistant(e) </label><br/>
                                <input type="checkbox" id="permAddAssistant" name="permAddAssistant" value="PermAddAssistant" className=" scale-150"
                                       checked={selectedPermissions.includes(Permission.INVITE)}
                                       onChange={() => togglePermission(Permission.INVITE)}/>
                            </div>

                            <div className="flex justify-between">
                                <label htmlFor="permSendMessage" className=" text-black"> Peut envoyer des messages </label><br/>
                                <input type="checkbox" id="permSendMessage" name="permSendMessage" value="PermSendMessage" className=" scale-150"
                                       checked={selectedPermissions.includes(Permission.SEND_MESSAGE)}
                                       onChange={() => togglePermission(Permission.SEND_MESSAGE)}/>
                            </div>

                            <div className="flex justify-between">
                                <label htmlFor="permSendMessage" className=" text-black"> Peut modifier des messages </label><br/>
                                <input type="checkbox" id="permSendMessage" name="permSendMessage" value="PermSendMessage" className=" scale-150"
                                       checked={selectedPermissions.includes(Permission.MODIFY_MESSAGE)}
                                       onChange={() => togglePermission(Permission.MODIFY_MESSAGE)}/>
                            </div>

                            <div className="flex justify-between">
                                <label htmlFor="permSendMessage" className=" text-black"> Peut supprimer des messages </label><br/>
                                <input type="checkbox" id="permSendMessage" name="permSendMessage" value="PermSendMessage" className=" scale-150"
                                       checked={selectedPermissions.includes(Permission.DELETE_MESSAGE)}
                                       onChange={() => togglePermission(Permission.DELETE_MESSAGE)}/>
                            </div>

                            <div className="flex justify-between">
                                <label htmlFor="permSendMessage" className=" text-black"> Peut ouvrir des fils </label><br/>
                                <input type="checkbox" id="permSendMessage" name="permSendMessage" value="PermSendMessage" className=" scale-150"
                                       checked={selectedPermissions.includes(Permission.OPEN_CHANNEL)}
                                       onChange={() => togglePermission(Permission.OPEN_CHANNEL)}/>
                            </div>

                            <div className="flex justify-between">
                                <label htmlFor="permSendMessage" className=" text-black"> Peut archiver des fils </label><br/>
                                <input type="checkbox" id="permSendMessage" name="permSendMessage" value="PermSendMessage" className=" scale-150"
                                       checked={selectedPermissions.includes(Permission.CLOSE_CHANNEL)}
                                       onChange={() => togglePermission(Permission.CLOSE_CHANNEL)}/>
                            </div>


                        </form>

                        <div className="flex justify-center gap-3">

                            <Button variant="secondary" type="button" onClickAction={() => setIsOpenPerms(false)} link={""}>
                                    Annuler
                                </Button>

                            <Button variant="primary" type="submit" onClickAction={savePermissions} link={""}>
                                Confirmer
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}