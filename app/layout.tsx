import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Base from "@/components/Base";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Base>
          {children}
        </Base>
      </body>
    </html>
  );
}
