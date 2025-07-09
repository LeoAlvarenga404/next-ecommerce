import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  if (
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/checkout")
  ) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/checkout/:path*",
    "/admin/:path*"
  ],
}
