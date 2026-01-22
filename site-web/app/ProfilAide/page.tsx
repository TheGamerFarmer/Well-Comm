"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ButtonMain";
import Image from "next/image";
import FilArianne from "@/components/FilArianne";
import {getRecordName, changeRecordName} from "@/functions/record-api";
import {getCurrentUserId} from "@/functions/fil-API";

export default function ProfilAide() {
    const [recordName, setRecordName] = useState<string>("");

    useEffect(() => {
        const loadRecord = async () => {

            const UserId = await getCurrentUserId();
            if (UserId === null)
                return;
            const localRecordId = localStorage.getItem('activeRecordId');
                if(localRecordId){
                    const name = await getRecordName(UserId, localRecordId);

                    if (name) {
                        setRecordName(name);
                        localStorage.setItem('recordName', name);
                    }}
        };
        loadRecord().then();
    }, []);


    const handleSave = async () => {
        const userId = await getCurrentUserId();
const localRecordId = localStorage.getItem('activeRecordId');
                if(localRecordId) {
                    const res = await changeRecordName(
                        userId,
                        localRecordId,
                        recordName
                    );

                    if (res) {
                        alert("Profil mis à jour avec succès!");
                    }
                }
    };

    const handleDefault = async () => {
        const name = localStorage.getItem('recordName')
        if (name) {
            setRecordName(name);
        }
    };

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="py-4 ">
                <p className="font-bold text-[#0551ab] text-2xl">L&#39;aidé</p>
                <FilArianne/>
            </div>
            <div  className="flex justify-center items-center flex-col bg-[#f4f4f4] w-full rounded-xl border-20 border-[#f4f4f4] md:border-white ">
                <div className="w-full h-[66px] mb-[22px] pt-4 pb-4 pl-[23px] rounded-xl bg-linear-to-r from-[#45bbb1] to-[#215a9e]">
                    <p className="w-[229px] h-[34px] font-montserrat text-xl font-bold leading-[1.7px] text-left text-white">
                        DOSSIER PATIENT
                    </p>
                </div>
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

                <form className="mx-auto  ">
                    <div className="flex flex-col md:flex-row md:gap-4">

                        <div className="self-center">
                            <label className="flex font-montserrat text-sm font-bold text-left text-[#727272]">Nom</label>
                            <input
                                type="text"
                                value={recordName}
                                onChange={(e) => setRecordName(e.target.value)}
                                className="w-[280px] md:w-[300px] h-[50px] bg-white self-stretch flex flex-row justify-between items-start py-3.5 ph-4 rounded-lg border #dfdfdf border-solid bg-[#fff]h-10 border-[#dfdfdf] mb-4 mt-1 p-3 text-black"/>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-end mt-4 mb-4 lg:mt-16 lg:mb-16 self-center">
                        <Button variant="cancel" link={""} onClickAction={handleDefault} >Annuler</Button>
                        <Button type="button" link={""} variant={"primary"} onClickAction={handleSave} >Enregistrer</Button>
                    </div>
                </form>

            </div>
        </div>
    );
}
