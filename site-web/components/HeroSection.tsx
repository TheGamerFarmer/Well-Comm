// mon-site-web/components/HeroSection.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative flex flex-row bg-[#1e40af] min-h-[300px] md:min-h-[550px] md:h-[650px] overflow-hidden">

            {/* --- 1. DÉCORATIONS (CERCLES) --- */}
            <div className="absolute top-[-5%] left-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] border border-blue-400/20 rounded-full z-10"></div>
            <div className="absolute bottom-[-5%] left-[5%] w-[150px] h-[150px] md:w-[300px] md:h-[300px] border border-blue-300/15 rounded-full z-10"></div>

            {/* --- 2. BLOC GAUCHE : TEXTE --- */}
            <div className="w-[55%] md:w-[45%] lg:w-[40%] flex flex-col justify-center items-start px-4 md:pl-16 lg:pl-24 z-20 text-white py-6 md:py-16">
                <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-2 md:mb-6 md:whitespace-nowrap">
                    WellComm est là pour vous !
                </h1>
                <p className="text-[13px] sm:text-base md:text-lg text-blue-100 mb-5 md:mb-10 max-w-full md:max-w-md leading-snug md:leading-relaxed opacity-90">
                    L'assistant indispensable pour les seniors et leurs aidants.
                </p>

                <Link
                    href="/inscription"
                    className="bg-[#ff5f5f] hover:bg-[#ff4d4d] text-white font-bold py-2 px-4 md:py-4 md:px-10 rounded-full
                     shadow-[0px_4px_0px_0px_#c93e3e] md:shadow-[0px_6px_0px_0px_#c93e3e] text-[12px] sm:text-sm md:text-base transition-all duration-300 hover:translate-y-[2px]"
                >
                    Commencer
                </Link>
            </div>

            {/* --- 3. BLOC DROITE : IMAGE --- */}
            {/* Sur mobile : 45% de largeur pour laisser la place au texte */}
            <div className="relative w-[45%] md:w-[60%] h-auto md:h-full shrink-0 z-10">
                <Image
                    src="/images/medium-shot-smiley-senior-couple-with-laptop.png"
                    alt="Couple de seniors"
                    fill
                    className="object-cover object-center"
                    priority
                />

                {/* LE FONDU : On l'ajuste pour qu'il couvre bien la jonction sur mobile */}
                <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#1e40af] via-[#1e40af]/30 to-transparent"></div>
            </div>

        </section>
    );
}