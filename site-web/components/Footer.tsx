// mon-site-web/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-100 py-8 border-t border-gray-200">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">

                {/* Colonne 1 : Navigation */}
                <nav className="flex space-x-6 mb-4 md:mb-0">
                    <Link href="/" className="text-gray-600 hover:text-blue-500">
                        Home
                    </Link>
                    <Link href="/a-propos" className="text-gray-600 hover:text-blue-500">
                        À Propos
                    </Link>
                    <Link href="/services" className="text-gray-600 hover:text-blue-500">
                        Services
                    </Link>
                    {/* ... autres liens ... */}
                </nav>

                {/* Colonne 2 : Logo/Marque */}
                <div className="text-center">
                    {/* Remplacez ceci par votre logo ou texte de marque */}
                    <span className="text-blue-700 font-bold">WellComm © 2024</span>
                </div>

                {/* Colonne 3 : Contact/Inscription (Simulé par des boutons dans la maquette) */}
                <div className="flex space-x-2">
                    {/* Les boutons du header sont souvent répétés pour l'accessibilité */}
                    <button className="bg-gray-300 px-3 py-1 rounded text-gray-800">Se connecter</button>
                    <button className="bg-blue-500 px-3 py-1 rounded text-white">S'inscrire</button>
                </div>
            </div>
        </footer>
    );
}