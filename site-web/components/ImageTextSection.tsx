// mon-site-web/components/ImageTextSection.tsx
import Image from 'next/image';

export default function ImageTextSection() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">

                    {/* 1. Bloc Image à gauche */}
                    <div className="w-full md:w-1/2">
                        <div className="relative h-[350px] md:h-[500px] w-full">
                            <Image
                                src="/images/woman_laptop.png"
                                alt="Femme senior utilisant un ordinateur portable"
                                fill
                                className="object-cover rounded-[2rem] shadow-xl"
                                priority
                            />
                        </div>
                    </div>

                    {/* 2. Bloc Texte à droite (Plus de contenu, pas de bouton) */}
                    <div className="w-full md:w-1/2 text-gray-700">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1e40af] mb-6">
                            Qu'est-ce que WellComm?
                        </h2>

                        <div className="space-y-5 text-base md:text-lg leading-relaxed">
                            <p>
                                <span className="font-bold text-[#1e40af]">WellComm</span> est un assistant indispensable pour les seniors et leurs aidants. Il prend en charge la communication entre les aidants pour une vie plus sereine et plus pratique.
                            </p>

                            <p>
                                La plateforme vous indiques vos tâches importante, vous aide à ne rien oublier ni à vous sentir perdu, et vous indique les horaires de vos rendez-vous.
                            </p>

                            <p>
                                C'est un assistant simple et fiable qui facilite le quotidien et vous apporte sérénité, jour après jour.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}