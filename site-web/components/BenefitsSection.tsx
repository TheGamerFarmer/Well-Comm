// components/BenefitsSection.tsx
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

const benefits = [
    "L'organisation simplifiée pour toute la famille.",
    "Un suivi de santé rigoureux et rassurant.",
    "Une interface pensée exclusivement pour les seniors."
];

export default function BenefitsSection() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-16">

                {/* TEXTE */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1e40af] mb-6">
                        Vos Avantages
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Découvrez comment WellComm transforme le quotidien en apportant sécurité,
                        autonomie et lien social.
                    </p>

                    <ul className="space-y-4">
                        {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-3 text-gray-700">
                                <CheckCircle2 className="text-[#1abc9c] w-6 h-6 mt-1 shrink-0" />
                                <span className="text-lg font-medium">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* IMAGES : Coins inversés symétriquement */}
                <div className="w-full md:w-1/2 flex items-start gap-4 md:gap-6">

                    {/* Image 1 (Gauche) : Arrondie en Haut-Droit et Bas-Gauche */}
                    <div className="relative w-1/2 h-[420px] md:h-[480px] mt-10">
                        <Image
                            src="/images/Frame 20.png"
                            alt="Seniors heureux"
                            fill
                            className="object-cover shadow-lg rounded-tr-none rounded-bl-none rounded-tl-[4rem] rounded-br-[4rem]"
                        />
                    </div>

                    {/* Image 2 (Droite) : Arrondie en Haut-Gauche et Bas-Droit */}
                    <div className="relative w-1/2 h-[420px] md:h-[480px]">
                        <Image
                            src="/images/Mask group.png"
                            alt="Dame avec fleurs"
                            fill
                            className="object-cover shadow-lg rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-none rounded-bl-none"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}