"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
const allowedOrigins = [process.env.NEXT_URL];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = new URL(request.url);

  if (url.pathname.startsWith("/dashboard")) {
    const cookieStore = cookies();
    const jwt = cookieStore.get("jwt");

    if (jwt == null || jwt.value == null)
      return NextResponse.redirect(new URL("/login", request.url));
  } else if (url.pathname.startsWith("/api")) {
    const origin = request.headers.get("origin") ?? "";
    const isAllowedOrigin = allowedOrigins.includes(origin);
    const isPreflight = request.method === "OPTIONS";
    if (isPreflight) {
      const preflightHeaders = {
        ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
        ...corsOptions,
      };
      return NextResponse.json({}, { headers: preflightHeaders });
    }

    if (isAllowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    Object.entries(corsOptions).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  } else if (url.pathname.startsWith("/login")) {
    const cookieStore = cookies();
    const jwt = cookieStore.get("jwt");

    if (jwt != null && jwt.value != null)
      return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
