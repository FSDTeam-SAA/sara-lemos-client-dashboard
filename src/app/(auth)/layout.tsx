import type { Metadata } from "next";
import "../globals.css";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Client Auth",
  description: "Authentication Layout for Client",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full">
      {/* ===== Background Image ===== */}
      <Image
        src="/images/auth.jpg"
        alt="Auth Background"
        fill
        priority
        className="object-cover"
      />

      {/* ===== Dark Overlay ===== */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ===== Content (Login Card) ===== */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}
