import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { Toaster } from "react-hot-toast";


const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ensileta Customer Portal",
  description: "View and manage your drawings easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
