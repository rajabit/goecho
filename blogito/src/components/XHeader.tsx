"use client";

import XButton from "@/components/XButton";
import React, { useState } from "react";

const XHeader = ({ app_name }: { app_name?: string }) => {
  const jwt_token = localStorage.getItem("jwt");

  return (
    <header className="fixed top-0 h-16 px-5 flex justify-center items-center border-b dark:border-gray-800 backdrop-blur-sm  dark:bg-gray/30 bg-gray/30 w-full">
      <h1 className="text-2xl font-bold">{app_name}</h1>
      <div className="grow"></div>
      {jwt_token == null && <XButton>Login</XButton>}
    </header>
  );
};

export default XHeader;
