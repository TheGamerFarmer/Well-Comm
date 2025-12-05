// components/ServiceCard.tsx
// N'oubliez pas l'interface
interface ServiceCardProps {
    title: string;
    description: string;
}

// Nous attachons l'interface au paramètre du composant
export default function ServiceCard({ title, description }: ServiceCardProps) {
    return (
        // La carte occupe 1 colonne sur mobile (par défaut),
        // mais elle est contrainte en largeur sur PC (md:w-96)
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200
                    w-full md:w-96 hover:shadow-xl transition duration-300">

            <h3 className="text-xl font-semibold mb-2 text-blue-600">{title}</h3>
            <p className="text-gray-700">{description}</p>

            {/* Bouton qui s'élargit sur mobile mais reste petit sur PC */}
            <button className="mt-4 w-full md:w-auto px-4 py-2 bg-blue-500 text-white
                         rounded hover:bg-blue-600">
                Voir Détail
            </button>
        </div>
    );
}