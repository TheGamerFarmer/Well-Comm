import HeaderLoged from '@/components/HeaderLoged';
import React from "react";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
    return (

        <div className="flex flex-col min-h-screen ">
            <HeaderLoged />
            <main className="bg-[#f1f2f2] flex-1">{children}</main>
        </div>
    )
}