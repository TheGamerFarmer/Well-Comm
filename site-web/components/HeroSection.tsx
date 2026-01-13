// mon-site-web/components/HeroSection.tsx
import Image from 'next/image';
import {Button} from "@/components/ButtonMain";

export default function HeroSection() {
    return (
        <section className=" relative flex flex-row min-h-[300px] md:min-h-[550px] md:h-[650px] overflow-hidden">

            <Image
                src="/images/background.png"
                alt="Couple de seniors"
                fill
                className="object-cover object-center"
                priority
            />

           <div className=" container mx-auto px-4 md:pl-16 lg:pl-24 z-20 text-white py-6 md:py-16">

            {/* --- 2. BLOC GAUCHE : TEXTE --- */}
            <div className="w-[55%] h-[80%] md:w-[45%] lg:w-[40%] flex flex-col justify-center items-start ">
                <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-2 md:mb-6  md:whitespace-nowrap">
                    WellComm est là pour vous !
                </h1>
                <p className="
                w-136 h-[82px] mb-[259px] text-2xl font-normal font-stretch-normal leading-[1.42px] tracking-normal text-left text-[#fff]
                  md:mb-10  md:leading-relaxed
                ">
                    WellComm est un assistant indispensable pour les seniors et leurs aidants.
                </p>

                <Button variant={"start1"}>
                    Commencer
                </Button>

            </div>
           </div>

        </section>
    );
}