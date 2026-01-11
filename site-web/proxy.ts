import {NextRequest} from "next/dist/server/web/spec-extension/request";
import {NextResponse} from "next/dist/server/web/spec-extension/response";

export async function proxy(request: NextRequest) {
    const logPages = ["/login", "/register"];
    const homePage = "/";
    const nextJsPagesPrefix = "/_next"
    const imagesPrefix = "/images"

    if (request.nextUrl.pathname.startsWith(nextJsPagesPrefix)
            || request.nextUrl.pathname.startsWith(imagesPrefix))
        return NextResponse.next();

    let response = await fetch("http://localhost:8080/api/isLogin");
    if (!response.ok)
        return false;

    let isLoged = await response.json();

    if (isLoged && logPages.includes(request.nextUrl.pathname))
        return NextResponse.redirect(new URL("/", request.url));
    else if (isLoged
                || logPages.includes(request.nextUrl.pathname)
                || homePage === request.nextUrl.pathname)
        return NextResponse.next();
    else {
        const urlSource = request.nextUrl.pathname + request.nextUrl.search;
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", urlSource);
        return NextResponse.redirect(loginUrl);
    }
}