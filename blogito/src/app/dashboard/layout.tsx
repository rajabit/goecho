import "./../globals.css";

import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import XHeader from "@/components/XHeader";
import {
  RectangleGroupIcon,
  DocumentTextIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";

const ubuntu = Ubuntu({ subsets: ["latin"], weight: "700" });

const app_name = process.env.APP_NAME;
export const metadata: Metadata = {
  title: app_name,
  description: app_name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>
        <XHeader app_name={app_name} />
        <div className="container flex w-full h-full">
          <div className="flex-1 flex items-center justify-center">
            <div className="list">
              <a href="/dashboard" title="Dashboard" className="item">
                <RectangleGroupIcon />
                Dashboard
              </a>
              <a href="/posts" title="Posts" className="item">
                <DocumentTextIcon />
                Posts
              </a>
              <a href="/categories" title="Categories" className="item">
                <RectangleStackIcon />
                Categories
              </a>
            </div>
          </div>
          <div className="flex-[4_4_0%]">{children}</div>
        </div>
      </body>
    </html>
  );
}
