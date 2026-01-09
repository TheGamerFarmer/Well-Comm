// mon-site-web/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import {Button} from "@/components/ButtonMain";

export default function Header() {
    // Ici, on utiliserait un état React (useState) pour gérer l'ouverture/fermeture du menu sur mobile, mais nous allons garder le prototype simple.

    return (
        // La barre de navigation principale
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/images/logo.svg" //  Assurez-vous que ce nom de fichier est exact
                        alt="Logo WellComm"
                        width={60} // Largeur du logo (à ajuster)
                        height={60} // Hauteur du logo (à ajuster)
                        priority // Pour charger l'image rapidement
                    />
                </Link>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <Link href="/login">
                        <Button variant="secondary">
                            Se connecter
                        </Button>
                    </Link>

                    <Link href="/register">
                        <Button variant="primary">
                            S&#39;inscrire
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}