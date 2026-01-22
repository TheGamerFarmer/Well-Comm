"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const breadcrumbNames: Record<string, string> = {
    home: "Accueil",
    mesAides: "Mes aidés",
    calendar: "Calendrier",
    userSpace: "Mon profil",
    ProfilAide: "L'Aidé",
    fil: "Fil de Transmission",
    assistants: "Assistants",
    archive: "Archives",
    medecin: "Médecins",
    resume: "Résumé",
};

export default function Breadcrumb() {
    const pathname = usePathname();

    // Découpe l'URL : "/calendar/settings" → ["calendar", "settings"]
    const segments = pathname.split("/").filter(Boolean);

    return (
        <nav aria-label="Breadcrumb" className="text-sm text-[#6b7280]">
            <ol className="flex items-center space-x-2 my-4">
                <li>
                    <Link href="/" className="text-[#223f81] hover:underline font-medium">
                        Accueil
                    </Link>
                </li>

                {segments.map((segment, index) => {
                    const href = "/" + segments.slice(0, index + 1).join("/");
                    const isLast = index === segments.length - 1;
                    const name = breadcrumbNames[segment] || decodeURIComponent(segment);

                    return (
                        <li key={href} className="flex items-center space-x-2">
                            <span>/</span>

                            {isLast ? (
                                <span className="font-medium text-gray">{name}</span>
                            ) : (
                                <Link
                                    href={href}
                                    className="text-[#223f81] hover:underline"
                                >
                                    {name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
