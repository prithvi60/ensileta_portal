import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  // variable: "--font-poppins",
  weight: "400",
});

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
      <body className={poppins.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

// #0E122B