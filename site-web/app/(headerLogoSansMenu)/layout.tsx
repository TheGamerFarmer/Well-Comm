import Link from "next/link";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (

        <div className="flex flex-col min-h-screen bg-[#fafafa]">
            <header className="bg-white shadow-md relative z-10">

                <div className=" w-full mx-auto px-4 py-3 flex justify-between items-center ">

                    {/* 1. Logo/Titre (Image dans la maquette) */}
                    <Link href="/mesAides"
                          className="flex items-center space-x-2"> {/* On utilise Link pour rendre le logo cliquable */}

                        {/* 🚨 NOUVEAU CODE POUR L'IMAGE */}
                        <Image
                            src="/images/logo.svg" // 🚨 Assurez-vous que ce nom de fichier est exact
                            alt="Logo WellComm"
                            width={60} // Largeur du logo (à ajuster)
                            height={60} // Hauteur du logo (à ajuster)
                            priority // Pour charger l'image rapidement
                        />
                        {/* --------------------------- */}

                    </Link>
                </div>
            </header>
            <main className="bg-[#fafafa] flex-1">{children}</main>

        </div>
    )
}