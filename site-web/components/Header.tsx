import Image from 'next/image';
import {Button} from "@/components/ButtonMain";

export default function Header() {
    return (
        <header className="bg-white shadow-md">
            <div className=" container mx-auto px-4 py-3 flex justify-between items-center">
                <Image
                    src="/images/logo.svg"
                    alt="Logo WellComm"
                    width={60}
                    height={60}
                    priority
                />

                <div className="sm:space-x-4 hidden lg:flex items-center space-x-2">

                    <Button variant="secondary" link="/login" >
                        Se connecter
                    </Button>
                    <Button variant="primary" link="/register" >
                        S&#39;inscrire
                    </Button>

                </div>
            </div>
        </header>
    );
}