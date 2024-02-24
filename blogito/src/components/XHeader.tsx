import React from "react";
import XLink from "@/components/XLink";
import HeaderLink from "@/components/assets/HeaderLink";

const XHeader = ({ app_name }: { app_name?: string }) => {
  return (
    <header className="x-header">
      <XLink model="outlined" href="/">
        <h1 className="text-2xl font-bold">{app_name}</h1>
      </XLink>
      <div className="grow"></div>
      <HeaderLink />
    </header>
  );
};

export default XHeader;
