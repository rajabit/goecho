"use server";

import XLink from "@/components/XLink";
import { cookies } from "next/headers";

const HeaderLink = () => {
  const cookieStore = cookies();
  const jwt = cookieStore.get("jwt");

  if (jwt != null && jwt.value != null) {
    return (
      <XLink href="/" model="outlined" color="slate">
        Home
      </XLink>
    );
  }

  return (
    <>
      <XLink href="/register" model="outlined" color="slate">
        Register
      </XLink>
      <XLink href="/login" color="slate" className="ms-1">
        Login
      </XLink>
    </>
  );
};

export default HeaderLink;
