import MiniHeader from '@/components/MiniHeader';

export default function Calendar() {
    return (
        <>
            <MiniHeader />
            <main className="min-h-screen flex items-center space-x-2 bg-[#f1f2f2]">
                <div className="mx-auto flex items-center space-x-2 bg-white flex items-center space-x-2">
                    <p className=" w-285 h-180 mt-[18px] mr-[39px] mb-[39px] ml-[41px] pt-[14px] pr-[34px] pb-6 pl-10 rounded-2xl shadow-[0 3px 6px 0 rgba(0, 0, 0, 0.1)] bg-[#fff">
                        Choisir une personne aidée
                    </p>
                </div>
            </main>
        </>

    )
}