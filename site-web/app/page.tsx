// mon-site-web/app/page.tsx
import ServiceCard from '@/components/ServiceCard'; // <-- 1. L'IMPORTATION est essentielle !

// Données simulées
const mockServices = [
    { title: "Service A", description: "Le service clé..." },
    // ... deux autres services
];

export default function HomePage() {
    return (
        <main className="p-8">
            {/* ... Titre ... */}

            <div className="flex flex-col items-center space-y-8 md:flex-row md:justify-center md:space-x-8">
                {mockServices.map((service, index) => (
                    // 2. L'UTILISATION : C'est ici que nous "plaçons" la carte
                    <ServiceCard
                        key={index}
                        title={service.title}
                        description={service.description}
                    />
                ))}
            </div>
        </main>
    );
}