import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import XHeader from "@/components/XHeader";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <XHeader app_name={app_name} />
        {children}
      </body>
    </html>
  );
}
