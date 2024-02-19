"use client";

import React, { useEffect, useState } from "react";
import XLink from "@/components/XLink";

const XHeader = ({ app_name }: { app_name?: string }) => {
  const [jwt, setJwt] = useState("");

  useEffect(() => {
    setJwt(localStorage.jwt);
  }, []);

  const authPath = ["/login", "/register"].includes(location.pathname);
  
  return (
    <header className="x-header">
      <XLink model="outlined" href="/">
        <h1 className="text-2xl font-bold">{app_name}</h1>
      </XLink>
      <div className="grow"></div>
      {(jwt == null || jwt.length == 0) && authPath ? (
        <XLink href="/" model="outlined" color="slate">
          Home
        </XLink>
      ) : (
        <>
          <XLink href="/register" model="outlined" color="slate">
            Register
          </XLink>
          <XLink href="/login" color="slate" className="ms-1">
            Login
          </XLink>
        </>
      )}
    </header>
  );
};

export default XHeader;
