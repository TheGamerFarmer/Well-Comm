// components/CTASection.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="py-12 px-6">
            <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#1e40af] to-[#1abc9c] min-h-[350px] flex flex-col md:flex-row items-center text-white">

                {/* TEXTE */}
                <div className="p-8 md:p-16 z-20 w-full md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        WellComme vous aidera !
                    </h2>
                    <p className="text-blue-50 mb-10 text-lg opacity-90">
                        Pour vous faciliter la vie au quotidien. Inscrivez-vous et recevez des conseils,
                        des rappels et du soutien.
                    </p>
                    <Link
                        href="/inscription"
                        className="bg-[#ff5f5f] hover:bg-[#ff4d4d] text-white font-bold py-3 px-10 rounded-full shadow-[0px_4px_0px_0px_#c93e3e]"
                    >
                        Commencer
                    </Link>
                </div>

                {/* IMAGE D'ACCOMPAGNEMENT */}
                <div className="relative w-full md:w-1/2 h-[300px] md:h-full z-10">
                    <Image
                        src="/images/Mask group1.png"
                        alt="Seniors au soleil"
                        fill
                        className="object-cover object-top"
                    />
                </div>
            </div>
        </section>
    );
}