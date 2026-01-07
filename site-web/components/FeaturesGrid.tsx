// mon-site-web/components/FeaturesGrid.tsx
import { Calendar, MessageSquare, LayoutDashboard } from 'lucide-react';

const features = [
    {
        title: "Le Calendrier",
        desc: "Le calendrier est votre assistant fiable au quotidien.",
        icon: <Calendar className="w-8 h-8 text-white" />,
    },
    {
        title: "Des Messages",
        desc: "Communiquez entres aidants de manière fiable et sécurisée.",
        icon: <MessageSquare className="w-8 h-8 text-white" />,
    },
    {
        title: "Un tableau de bord",
        desc: "Un condensé de l'activité des 7 derniers jours.",
        icon: <LayoutDashboard className="w-8 h-8 text-white" />,
    }
];

export default function FeaturesGrid() {
    return (
        <section className="w-full bg-[#f4f4f4] py-20">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-wrap justify-center gap-12 lg:gap-16">
                    {features.map((f, i) => (
                        <div key={i} className="flex flex-col items-center text-center w-full sm:w-[250px]">

                            {/* Le cercle Vert d'eau (Teal) - Animation supprimée */}
                            <div className="w-20 h-20 rounded-full bg-[#1abc9c] flex items-center justify-center mb-6 shadow-md">
                                {f.icon}
                            </div>

                            {/* Titre en bleu foncé */}
                            <h3 className="text-[#1e40af] font-extrabold text-lg mb-3">
                                {f.title}
                            </h3>

                            {/* Description en gris très foncé */}
                            <p className="text-gray-800 text-sm leading-relaxed max-w-[200px]">
                                {f.desc}
                            </p>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}