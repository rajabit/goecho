import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const handler = async (req: NextRequest, _: NextResponse) => {
  const url = new URL(req.url);
  const requestInit: RequestInit = {
    method: req.method,
    headers: {
      ...req.headers,
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + req.cookies.get("jwt"),
    },
  };

  if (req.body !== null) {
    requestInit.body = JSON.stringify(await req.json());
  }

  var path: string = url.pathname.replace("/api/", "");
  const result = await fetch(`${process.env.BASE_API}${path}`, requestInit);

  let data = await result.json();

  if (path == "auth/login" && result.ok) {
    const cookieStore = cookies();
    cookieStore.set("jwt", data.Token, {
      secure: true,
      httpOnly: true,
      expires: new Date(new Date().getTime() + 60 * 60 * 72 * 1000),
    });
  }

  return Response.json(data, {
    status: result.status,
    statusText: result.statusText,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
