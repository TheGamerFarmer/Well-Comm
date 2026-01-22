import Link from 'next/link';
import {Button} from "@/components/ButtonMain";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-white py-8 border-t border-t-gray-200" >
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-end items-center text-sm">

                <div className="flex flex-col justify-center items-center ">

                    <Link href="/" className="flex items-center ">
                        <Image
                            src="/images/logo.svg"
                            alt="Logo WellComm"
                            width={140}
                            height={140}
                            priority
                        />
                    </Link>

                    <span className="mt-[15px] font-open-sans text-sm font-normal font-stretch-normal not-italic leading-none tracking-normal text-center text-[#333]">© 2026 WellComm. Tous droits réservés</span>

                </div>

                <div className="space-x-2 ml-75 hidden lg:flex items-center">

                    <Button variant="secondary" link="/login">
                        Se connecter
                    </Button>
                    <Button variant="primary" link="/register">
                        S&#39;inscrire
                    </Button>

                </div>
            </div>
        </footer>
    );
}