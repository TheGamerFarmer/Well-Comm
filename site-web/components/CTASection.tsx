import Image from 'next/image';

import {Button} from "@/components/ButtonMain";

export default function CTASection() {
    return (
        <section className="py-12 px-6 bg-white">
            <div className="

             bg-[linear-gradient(89deg,#215a9e_0%,#45bbb1_140%)]  lg:container mx-auto relative overflow-hidden rounded-[2.5rem] min-h-[350px] flex flex-col md:flex-row items-center text-white">

                <Image
                    src="/images/CTA.png"
                    alt="Couple de seniors"
                    fill
                    className="hidden lg:flex object-cover object-center"
                    priority
                />

                {/* TEXTE */}
                <div className="p-8 md:p-16 z-20 w-full md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        WellComm vous aidera!
                    </h2>
                    <p className="text-blue-50 mb-10 text-lg opacity-90">
                        Pour vous faciliter la vie au quotidien. Inscrivez-vous et recevez des conseils,
                        des rappels et du soutien.
                    </p>

                    <Button variant={"start1"} link={"/register"}>
                        Commencer
                    </Button>

                </div>

            </div>
        </section>
    );
}