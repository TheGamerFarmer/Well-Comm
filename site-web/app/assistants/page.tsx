"use client";

import { useState } from "react";
import {Button} from "@/components/ButtonMain";

type Invitation = {
    id: string;
    email: string;
    role: "Aidant" | "Infirmier(e)" | "Médecin" | "Aide soignant(e)" | "Aide à domicile";
};

export default function AssistantsPage() {

    const [isOpen, setIsOpen] = useState(false);
    const [invitationToDelete, setInvitationToDelete] = useState<Invitation | null>(null);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<Invitation["role"]>("Aidant");

    return (

        <>
            <div className=" p-10 ">
                <p className=" mt-10 flex font-montserrat text-2xl font-bold text-left text-[#0551ab]">
                    Assistans
                </p>


                <div className="flex flex-col items-end my-4">
                    <Button variant="primary" type="button"
                            onClick={() => setIsOpen(true)}>
                        Inviter Assistant
                    </Button>
                </div>

                {/*liste des assistants*/}
                <div className="mt-8 space-y-4 bg-white rounded-lg shadow-[0_4px_6px_0_rgba(0,0,0,0.08)] px-4 py-6">
                    {invitations.map((inv) => (
                        <div
                            key={inv.id}
                            className="flex justify-between items-center p-4 rounded-lg bg-[#f6f6f6]"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${inv.email}&background=0551ab&color=fff`}
                                    alt="avatar"
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className="flex flex-col">
                                    <span className="font-bold text-black">{inv.email}</span>
                                    <span className="text-sm text-gray-500">{inv.role}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
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
                                className="border rounded-lg px-3 py-2 text-black">
                                <option>Aidant</option>
                                <option>Infirmier(e)</option>
                                <option>Médecin</option>
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



                {/* pop-up */}
                    {isOpen && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-2xl w-[400px]">
                                <h2 className="text-lg font-bold mb-4 text-[#0551ab]">Nouveau aidé</h2>
                                <div className="flex justify-center">

                                </div>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        if (!email.trim()) return;

                                        setInvitations((prev) => [
                                            ...prev,
                                            {
                                                id: crypto.randomUUID(),
                                                email,
                                                role,
                                            },
                                        ]);

                                        setEmail("");
                                        setRole("Aidant");
                                        setIsOpen(false);
                                    }}
                                    className="flex flex-col gap-4"
                                >
                                    <input
                                        type="email"
                                        placeholder="Email de l'assistant"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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

                                        <Button variant="primary" type="submit">
                                            Ajouter
                                        </Button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    )}


                </div>


            {invitationToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-[400px] flex flex-col items-center gap-y-4">

                        <img src="/images/icon-attention2x.png" alt="Attention" width={50} />

                        <p className="font-bold text-blue-800 text-xl text-center">
                            Voulez-vous supprimer l’invitation de
                            <br />
                            <span className="font-bold">
                    {invitationToDelete.email}
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

        </>
    )
}