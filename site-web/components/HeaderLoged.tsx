import Link from 'next/link';
import Image from 'next/image';
import {Button} from "@/components/ButtonMain";
import BurgerScreen from "@/components/BurgerScreen";

export default function HeaderLoged() {

    return (

        <header className="bg-white shadow-md">
            <BurgerScreen/>

            <div className=" ml-20 px-4 py-3 flex justify-between items-center">

                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/images/logo.svg"
                        alt="Logo WellComm"
                        width={60}
                        height={60}
                        priority
                    />
                </Link>

                <div className="flex items-center space-x-2 sm:space-x-4">

                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/images/user.svg"
                            alt="Logo WellComm"
                            width={60}
                            height={60}
                            priority
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
}