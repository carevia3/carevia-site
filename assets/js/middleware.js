import { NextResponse } from "next/server";

export function middleware(req) {
  const isAdmin = req.cookies.get("loggedIn") === "true";

  if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/login.html", req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin.html"],
};
