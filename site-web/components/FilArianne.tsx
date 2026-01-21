"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type BreadcrumbNode = {
    label: string;
    children?: Record<string, BreadcrumbNode>;
};
const breadcrumbHrefMap: Record<string, string> = {
    home: "/",
    mesAides: "/mesAides",
    dossier: "", // pas cliquable
    assistants: "/assistants",
    calendrier: "/calendrier",
    fil: "/fil",
    medecin: "/medecin",
    userSpace: "/userSpace"
};

const breadcrumbTree: Record<string, BreadcrumbNode> = {
    home: {
        label: "Accueil",
        children: {
            mesAides: {
                label: "Mes aidés",
                children: {
                    dossier: {
                        label: "Dossier",
                        children: {
                            assistants: { label: "Assistants" },
                            calendrier: { label: "Calendrier" },
                            fil: { label: "Fil de transmission" },
                            medecin: { label: "Médecins" }
                        }
                    }
                }
            },
            userSpace: {
                label: "Mon profil"
            }
        }
    }
};

function findBreadcrumbPath(
    tree: Record<string, BreadcrumbNode>,
    target: string,
    path: { key: string; label: string }[] = []
): { key: string; label: string }[] | null {
    for (const key in tree) {
        const node = tree[key];
        const newPath = [...path, { key, label: node.label }];
        if (key === target) return newPath;
        if (node.children) {
            const result = findBreadcrumbPath(node.children, target, newPath);
            if (result) return result;
        }
    }
    return null;
}

export default function Breadcrumb() {
    const pathname = usePathname();
    const [activeRecordName, setActiveRecordName] = useState<string | null>(null);

    useEffect(() => {
        const name = localStorage.getItem("activeRecordName");
        if (name) setActiveRecordName(name);
    }, []);

    const currentPage = pathname.split("/").filter(Boolean).pop();
    const breadcrumbPath = currentPage
        ? findBreadcrumbPath(breadcrumbTree, currentPage)
        : null;

    // Construit l'URL pour chaque étape
    const getBreadcrumbHref = (index: number) =>
    {
        const item = breadcrumbPath![index];
        return breadcrumbHrefMap[item.key] || "#";
    };

    return (
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 my-4">
            <ol className="flex items-center flex-wrap">
                {breadcrumbPath?.map((item, index) => {
                    const isLast = index === breadcrumbPath.length - 1;
                    const displayLabel =
                        item.key === "dossier" && activeRecordName
                            ? activeRecordName
                            : item.label;

                    const isClickable = !isLast && item.key !== "dossier";

                    return (
                        <li key={item.key} className="flex items-center">
                            {index > 0 && <span className="mx-2">/</span>}

                            {isClickable ? (
                                <Link
                                    href={getBreadcrumbHref(index)}
                                    className="text-[#223f81] font-bold hover:underline"
                                >
                                    {displayLabel}
                                </Link>
                            ) : (
                                <span className={isLast ? "font-semibold text-gray-800" : ""}>
                                    {displayLabel}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
