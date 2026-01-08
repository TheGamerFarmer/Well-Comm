import {NextRequest} from "next/dist/server/web/spec-extension/request";
import {NextResponse} from "next/dist/server/web/spec-extension/response";
import * as url from "node:url";

export function middleware(request: NextRequest) {
    const logPages = ["/login", "/register"];
    const homePage = "/";

    fetch("http://localhost:8080/api/isLogin")
        .then((response: Response) => {
            if (response.ok)
                return response.json();
            else
                return false;
        }).then((isLoged: Response) => {
            if (isLoged && logPages.includes(request.url))
                return NextResponse.redirect(new URL("/", request.url));
            else if (isLoged || logPages.includes(request.url) || homePage === request.url)
                return NextResponse.next();
            else {
                const urlSource = request.nextUrl.pathname + request.nextUrl.search;
                const loginUrl = new URL("/login", request.url);
                loginUrl.searchParams.set("callbackUrl", urlSource);
                return NextResponse.redirect(loginUrl);
            }
        });
}