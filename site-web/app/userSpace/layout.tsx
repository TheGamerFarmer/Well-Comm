import HeaderLoged from "@/components/HeaderLoged";

export default function UserProfil({ children }: { children: React.ReactNode }) {
    return (

        <div className="flex flex-col min-h-screen ">
            <header className="bg-white shadow-md relative z-10">

                <HeaderLoged />

            </header>
            <main className="bg-[#fafafa] flex-1">{children}</main>

        </div>
    )
}