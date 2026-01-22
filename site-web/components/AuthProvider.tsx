"use client";
import { useEffect } from "react";
import {useRouter, usePathname, useParams} from "next/navigation";
import {Capacitor, CapacitorHttp} from "@capacitor/core";
import {API_BASE_URL} from "@/config";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const logPages = ["/login", "/register"];
    const homePage = "/mesAides";
    const nextJsPagesPrefix = "/_next";
    const imagesPrefix = "/images";

    useEffect(() => {
        const checkAuth = async () => {
            if (pathname.startsWith(nextJsPagesPrefix)
                || pathname.startsWith(imagesPrefix))
                return;

            if (Capacitor.isNativePlatform()) {
                const option = {
                    url: `${API_BASE_URL}/api/isLogin`,
                    method: "GET",
                    header: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }

                const response = await CapacitorHttp.get(option);
                const isLoged = response.data;

                if (!response.status || (isLoged && logPages.includes(pathname)) || pathname === "/")
                    router.push(homePage);
                else if (!isLoged
                    && !logPages.includes(pathname)) {
                    const urlSource = pathname + params;
                    const loginUrl = new URL("/login");
                    loginUrl.searchParams.set("callbackUrl", urlSource);
                    router.push(loginUrl.search);
                }
            }

            if (localStorage.getItem('activeRecordId') == null && !logPages.includes(pathname) && pathname !== "/" && pathname !== homePage)
                router.push(homePage);
        };

        checkAuth().then();
    }, [logPages, params, pathname, router]);

    return <>{children}</>;
}