import Header from "@/components/Dashboard/shared/Header";
import Sidebar from "@/components/Dashboard/shared/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Client Dashboard",
  description:
    "A modern dashboard template built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen relative bg-[#FCFBF8]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col w-full lg:ml-64 transition-all duration-300">
          {/* Header */}
          <div className="sticky top-0 z-10">
            <Header />
          </div>

          {/* Page Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
