"use client";
import { useEffect } from "react";
import {useRouter, usePathname, useParams} from "next/navigation";
import { Capacitor } from "@capacitor/core";
import {NextResponse} from "next/dist/server/web/spec-extension/response";
import {API_BASE_URL} from "@/config";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const logPages = ["/login", "/register"];
    const homePage = "/mesAides";
    const nextJsPagesPrefix = "/_next";
    const imagesPrefix = "/images";

    useEffect(() => {
        const checkAuth = async () => {
            if (Capacitor.isNativePlatform()) {

                if (pathname.startsWith(nextJsPagesPrefix)
                    || pathname.startsWith(imagesPrefix))
                    return NextResponse.next();

                const response = await fetch(`${API_BASE_URL}/api/isLogin`, {
                    method: "GET",
                    credentials: 'include',
                    cache: 'no-store'
                });

                const isLoged = await response.json();

                if (!response.ok || (isLoged && logPages.includes(pathname)))
                    router.push(homePage);
                else if (!isLoged
                            && !logPages.includes(pathname)
                            && "/" !== pathname) {
                    const urlSource = pathname + params;
                    const loginUrl = new URL("/login");
                    loginUrl.searchParams.set("callbackUrl", urlSource);
                    router.push(loginUrl.search);
                }
            }
        };

        checkAuth().then();
    }, [pathname, router]);

    return <>{children}</>;
}