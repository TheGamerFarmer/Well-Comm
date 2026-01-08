import MiniHeader from '@/components/MiniHeader';

export default function Calendar() {
    return (
        <>
            <MiniHeader />
            <main className="min-h-screen flex items-center space-x-2 bg-[#f1f2f2]">
                <div className="flex items-center space-x-2 bg-white flex items-center space-x-2">
                    <p className="w-[229px] h-[34px] flex font-montserrat text-2xl font-bold text-left text-[#0551ab]">
                        Choisir un aidéé
                    </p>
                </div>
            </main>
        </>

    )
}