"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import HeaderTitle from "../ReusableComponents/HeaderTitle";
import { useSidebar } from "@/contexts/SidebarContext";
import { useCurrentRoute } from "@/hooks/useCurrentRoute";

export default function DashboardHeader() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { toggleSidebar } = useSidebar();
  const currentRoute = useCurrentRoute();

  const loading = false;

  const handleLogout = () => {
    signOut();
    setLogoutDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-4 p-5 bg-white rounded-md">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <header className="w-full h-auto lg:h-[100px] bg-white shadow-sm border-b px-3 sm:px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Hamburger Menu - visible on mobile/tablet */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md border border-gray-200 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} className="text-gray-700" />
        </button>

        {/* Header Title - dynamic based on route */}
        <div className="min-w-0 flex-1">
          <HeaderTitle
            title={currentRoute.title}
            subtitle={currentRoute.subtitle}
          />
        </div>
      </div>

      {/* Logout Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogTrigger asChild>
          <button style={{ display: "none" }}></button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
