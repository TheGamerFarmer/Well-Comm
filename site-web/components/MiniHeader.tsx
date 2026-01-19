import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    return (
        <header className="bg-white shadow-md relative z-10">
            <div className="w-full mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/images/logo.svg"
                        alt="Logo WellComm"
                        width={60}
                        height={60}
                        priority
                    />
                </Link>
            </div>
        </header>
    );
}