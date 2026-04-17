import { auth } from "@/auth";

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/app") && !req.auth) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return Response.redirect(url);
  }

  if ((pathname === "/login" || pathname === "/register") && req.auth) {
    return Response.redirect(new URL("/app/discover", req.nextUrl.origin));
  }

  return undefined;
});

export const config = {
  matcher: ["/app/:path*", "/login", "/register"],
};
