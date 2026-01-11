// mon-site-web/components/HeroSection.tsx
import Image from 'next/image';
import Link from 'next/link';
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

           <div className=" container p-8

           md:pl-16 lg:pl-24 z-20 text-white py-6 md:py-16">

            {}
            <div className="
             w-[90%] h-[50%] md:w-[45%] lg:w-[40%] flex flex-col ">
                <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-2 md:mb-6  md:whitespace-nowrap">
                    WellComm est là pour vous !
                </h1>
                <p className="

                md:w-120 h-[82px] mb-[16px] md:text-2xl md:font-normal md:font-stretch-normal md:leading-[1.42px] md:tracking-normal text-left text-[#fff]
                  md:mb-16  md:leading-relaxed
                  lg:mb-16
                ">
                    WellComm est un assistant indispensable pour les seniors et leurs aidants.
                </p>

                <Button variant={"start1"} link={"/register"}>
                    Commencer
                </Button>

            </div>
           </div>

        </section>
    );
}