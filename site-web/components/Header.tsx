// mon-site-web/components/Header.tsx
import Link from 'next/link';
import { Menu } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
    // Ici, on utiliserait un état React (useState) pour gérer l'ouverture/fermeture du menu sur mobile, mais nous allons garder le prototype simple.

    return (
        // La barre de navigation principale
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">

                {/* 1. Logo/Titre (Image dans la maquette) */}
                <Link href="/" className="flex items-center space-x-2"> {/* On utilise Link pour rendre le logo cliquable */}

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

                {/* 2. Boutons d'Action à droite (Toujours visibles) */}
                <div className="flex items-center space-x-2 sm:space-x-4">

                    {/* Bouton "Se connecter" : On retire le 'hidden md:block' */}
                    <Link
                        href="/login"
                        className="px-3 py-1.5 sm:px-5 sm:py-2 border-2 border-blue-400 text-blue-500
                       text-sm sm:text-base font-medium rounded-full hover:bg-blue-50 transition duration-150"
                    >
                        Se connecter
                    </Link>

                    {/* Bouton "S'inscrire" : Toujours visible */}
                    <Link
                        href="/register"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold
                       px-3 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base rounded-full shadow-md transition duration-150"
                    >
                        S'inscrire
                    </Link>
                </div>
            </div>
        </header>
    );
}