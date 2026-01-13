"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const breadcrumbNames: Record<string, string> = {
    home: "Accueil",
    mesAides: "Mes aidés",
    calendrier: "Calendrier",
    userSpace: "Mon profil",
    fil: "Fil de Transmission",
};

export default function Breadcrumb() {
    const pathname = usePathname();

    // Découpe l'URL : "/calendar/settings" → ["calendar", "settings"]
    const segments = pathname.split("/").filter(Boolean);

    return (
        <nav aria-label="Breadcrumb" className="text-sm text-gray-600">
            <ol className="flex items-center space-x-2 my-4">
                <li>
                    <Link href="/" className="text-[#223f81] hover:underline font-bold">
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
                                <span className="font-bold text-gray">{name}</span>
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
