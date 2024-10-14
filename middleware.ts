


import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
        '/cart',
        '/sign-in',
        '/sign-up',
        '/my-orders',
        '/',
    ],
};

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;
    console.log("Token", token)
    if (!token) {
        if (
            url.pathname.startsWith('/cart') ||
            url.pathname.startsWith('/my-orders')) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    } else if (token) {
        if (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up')) {
            return NextResponse.redirect(new URL('/', request.url));

        }
    }

    return NextResponse.next();
}
