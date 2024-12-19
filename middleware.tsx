import { NextResponse } from 'next/server';
import { routing } from './src/i18n/routing';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  
  if (pathname === '/') {
    const defaultLang = routing.defaultLocale; 
    const url = new URL(`/${defaultLang}`, request.url);
    console.log("Tryed to redirect to default");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/', '/(en|ar)/:path*'],
};