import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authClient } from "@/lib/auth-client";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: { cookie: request.headers.get("cookie") || "" },
    },
  });

  // Your Better Auth logic here...
  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/authentication', request.url));
  }

  const isAuthPage = pathname.startsWith('/authentication');
  const isRootPage = pathname === "/"; 

  if ((isAuthPage || isRootPage) && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};