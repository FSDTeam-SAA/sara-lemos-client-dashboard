import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Sign In | Client Dashboard",
  description: "Sign in to access your Sara Lemos client dashboard.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #f0faf9 0%, #e6f4f1 40%, #d4ece8 100%)",
      }}
    >
      {/* Subtle dot-grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(11,59,54,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Page content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
