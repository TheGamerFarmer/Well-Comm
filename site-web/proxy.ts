import {NextRequest} from "next/dist/server/web/spec-extension/request";
import {NextResponse} from "next/dist/server/web/spec-extension/response";
import { API_BASE_URL } from "./config";
import { fetchWithCert } from "@/functions/fetchWithCert";

export async function proxy(request: NextRequest) {
    const logPages = ["/login", "/register"];
    const homePage = "/mesAides";
    const nextJsPagesPrefix = "/_next";
    const imagesPrefix = "/images";

    if (request.nextUrl.pathname.startsWith(nextJsPagesPrefix)
            || request.nextUrl.pathname.startsWith(imagesPrefix))
        return NextResponse.next();

    const cookieHeader = request.headers.get('cookie');

    const response = await fetchWithCert(`${API_BASE_URL}/api/isLogin`, {
        method: "GET",
        headers: {
            "Cookie": cookieHeader || ""
        },
        cache: 'no-store'
    });

    const isLoged = await response.json();

    if (!response.ok || (isLoged && logPages.includes(request.nextUrl.pathname)))
        return NextResponse.redirect(new URL(homePage, request.url));
    else if (isLoged
                || logPages.includes(request.nextUrl.pathname)
                || "/" === request.nextUrl.pathname)
        return NextResponse.next();
    else {
        const urlSource = request.nextUrl.pathname + request.nextUrl.search;
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", urlSource);
        return NextResponse.redirect(loginUrl);
    }
}
