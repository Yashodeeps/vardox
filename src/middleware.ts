import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = request.nextUrl;

    // Redirect authenticated users away from auth pages
    if (token && (pathname === "/" || pathname.startsWith("/auth"))) {
      return NextResponse.redirect(new URL("/td/dashboard", request.url));
    }

    // Protect /td routes
    if (!token && pathname.startsWith("/td")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // In case of error, allow the request to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/td/:path*", "/auth/:path*", "/"],
};
