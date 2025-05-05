'use server'
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { verifySession } from "./app/lib/session";


export default async function middleware(request: NextRequest) {
    const protectedRoutes = [
        '/bookLibrary'
    ];
    const currentPath = request.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(currentPath);
    
    if (isProtectedRoute && (await verifySession()) !== true){
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image).*)']
}