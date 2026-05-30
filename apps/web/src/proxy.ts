import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes always
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check refreshToken httpOnly cookie set by backend
  const token = req.cookies.get("refreshToken")?.value;

  // No token → kick to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/webpack|favicon.ico|.*\\..*).*)",
  ],
};
