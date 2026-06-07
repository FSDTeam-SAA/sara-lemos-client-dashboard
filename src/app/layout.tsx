import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Poppins, Fraunces } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import MainProviders from "@/lib/Providers/MainProviders";
import Provider from "@/lib/Providers/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Client Dashboard.",
  description:
    "A modern dashboard template built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${montserrat.variable} ${geistMono.variable} ${poppins.variable} ${fraunces.variable} font-poppins antialiased`}
      >
        <MainProviders>
          <Provider> {children} </Provider>
        </MainProviders>
        <Toaster position="top-right" closeButton />
      </body>
    </html>
  );
}
