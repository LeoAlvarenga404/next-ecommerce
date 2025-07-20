import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;
  // if (pathname.startsWith("/admin")) {
  //   try {
  //     const session = await getSession();
  //     console.log("sessão", session);
  //     if (!session || session.role !== "ADMIN") {
  //       return NextResponse.redirect(new URL("/", request.url));
  //     }
  //   } catch (err) {
  //     console.error("Erro ao validar sessão no middleware:", err);
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }
  // if (pathname.startsWith("/checkout")) {
  //   try {
  //     const session = await getSession();
  //     if (!session || !session.user_id) {
  //       return NextResponse.redirect(new URL("/login", request.url));
  //     }
  //   } catch (err) {
  //     console.error("Erro ao validar sessão no middleware:", err);
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }
  // return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*"],
};
