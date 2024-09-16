import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/"];
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = cookies().get("jwt-token")?.value;

  if (isPublicRoute && !cookie) {
    return NextResponse.next();
  }

  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
