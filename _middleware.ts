// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { auth } from "@/lib/auth";

// const protectedRoutes = ["/"];

// export default async function middleware(request: NextRequest) {
//     const session = await auth();

//     const { pathname } = request.nextUrl;

//     const isProtected = protectedRoutes.some((route) =>
//         pathname.startsWith(route)
//     );

//     if (isProtected && !session) {
//         return NextResponse.redirect(new URL("/api/auth/signin", request.url));
//     }

//     return NextResponse.next();
// }

export { auth as middleware } from "@/_lib/auth"

/*
 * Match all request paths except for the ones starting with:
 * - api (API routes)
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 */
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
}