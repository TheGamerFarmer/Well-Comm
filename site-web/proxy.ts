import {NextRequest} from "next/dist/server/web/spec-extension/request";
import {NextResponse} from "next/dist/server/web/spec-extension/response";

export async function proxy(request: NextRequest) {
    const logPages = ["/login", "/register"];
    const homePage = "/";

    let result = fetch("http://localhost:8080/api/isLogin")
        .then((response: Response) => {
            if (response.ok)
                return response.json();
            else
                return false;
        }).then((isLoged: Response) => {
            if (isLoged && logPages.includes(request.url))
                return new URL("/", request.url);
            else if (isLoged || logPages.includes(request.url) || homePage === request.url)
                return null;
            else {
                const urlSource = request.nextUrl.pathname + request.nextUrl.search;
                const loginUrl = new URL("/login", request.url);
                loginUrl.searchParams.set("callbackUrl", urlSource);
                return loginUrl;
            }
        });

    let url = await result;
    if (url == null)
        return NextResponse.next()
    else
        return NextResponse.redirect(url);
}