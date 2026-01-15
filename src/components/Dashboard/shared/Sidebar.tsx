"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  NotebookText,
  CircleDollarSign,
  Ship,
  LogOut,
  HardDrive,
  MessageCircleMore,
  ShoppingBag,
  ShoppingBasket,
  Users,
  Send,
} from "lucide-react";
import { useState } from "react";

import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard Overview", href: "/", icon: HardDrive },
  { name: "Listings", href: "/listings", icon: Ship },
  { name: "Upload Listing", href: "/upload-listing", icon: ShoppingBasket },
  { name: "Content Generator", href: "/content-generator", icon: NotebookText },
  { name: "Saved Drafts", href: "/saved-drafts", icon: ShoppingBag },
  { name: "Schedule Posts", href: "/schedule-posts", icon: MessageCircleMore },
  { name: "Social Accounts", href: "/social-accounts", icon: Send },
  { name: "Subscription", href: "/subscription", icon: Calendar },
  { name: "Settings", href: "/settings", icon: CircleDollarSign },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    // NextAuth signOut with redirect to login page
    signOut({ callbackUrl: "/login" });
    setOpen(false);
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200 fixed">
      {/* Logo */}
      <div className="flex  items-center py-5 justify-center px-6">
        <Link href="/" className="flex items-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
          >
            <path
              d="M15.4008 11.7219L15.3734 11.8246L12.8107 14.3942H12.7323C12.2167 14.1139 11.6422 13.9166 11.0638 13.81C7.59931 13.1725 4.2603 15.5329 3.69563 19.0281C2.98783 23.4055 6.917 27.1692 11.2422 26.2376C12.5598 25.9534 13.6715 25.2489 14.591 24.2798C15.5675 23.2516 16.487 22.1602 17.4575 21.1241C17.5026 21.0767 17.7261 20.8419 17.7595 20.832C17.8908 20.7925 18.0202 20.8675 18.1418 20.8853C19.6025 21.1004 21.3514 21.0254 22.769 20.5754C22.7866 20.5695 22.9297 20.4807 22.8866 20.5754C22.8807 20.5873 22.7494 20.7412 22.7258 20.7708C22.418 21.1201 22.0788 21.4517 21.7632 21.7971C20.277 23.4253 18.8065 25.0673 17.2987 26.6777C15.3106 28.8013 13.0931 29.8967 10.158 29.9953C4.32304 30.1907 -0.431568 25.1226 0.0311488 19.265C0.535039 12.8686 6.86014 8.58787 12.9539 10.5437C13.8244 10.8239 14.6283 11.2483 15.4067 11.7219H15.4008Z"
              fill="#904ED4"
            />
            <path
              d="M14.7967 18.496L14.8244 18.3915L17.4703 15.7621C17.5831 15.8036 17.6899 15.8608 17.8008 15.9022C20.3813 16.8233 23.2725 16.0481 24.9724 13.9021C27.547 10.6494 26.3755 5.90947 22.6215 4.19734C20.2012 3.09274 17.2803 3.66476 15.4359 5.55837C14.3495 6.67283 13.3323 7.86817 12.2736 9.01025C12.2182 9.0714 12.1549 9.13255 12.0896 9.18383C11.8244 9.17989 11.5493 9.10099 11.2861 9.0714C9.95033 8.91754 8.53934 9.03984 7.23522 9.37319C7.15804 9.39292 7.08086 9.44026 6.98785 9.45406C6.95223 9.45998 6.88692 9.46393 6.91463 9.41067C6.94233 9.35741 7.11252 9.22131 7.16991 9.15819C8.78869 7.38096 10.4273 5.62149 12.0638 3.86399C12.5051 3.39059 12.9148 2.89154 13.4056 2.46548C18.0956 -1.60577 25.3089 -0.497219 28.5464 4.77528C30.65 8.20152 30.4561 12.6515 28.0576 15.8785C25.0773 19.8866 19.6115 21.1076 15.1905 18.713C15.0619 18.644 14.9333 18.5394 14.7928 18.498L14.7967 18.496Z"
              fill="#AAD543"
            />
            <path
              d="M19.304 12.6165L19.2154 12.6618L12.1456 19.7326C10.9325 20.4793 9.64855 19.0095 10.5859 17.9063L17.6675 10.8177C17.6675 10.7902 17.6853 10.7488 17.6557 10.7468C17.51 10.7291 17.3308 10.7567 17.1791 10.7468C16.9153 10.7311 16.6396 10.7094 16.3776 10.6877C15.4521 10.6109 15.0011 9.48199 15.5486 8.75698C15.6746 8.59149 16.0271 8.34128 16.2319 8.31173C16.4781 8.2743 17.0354 8.29597 17.3012 8.31173C17.7246 8.33537 18.154 8.38266 18.5774 8.40236C19.4773 8.4457 20.3832 8.49299 21.2792 8.55012C21.3659 8.55603 21.6613 8.52254 21.6967 8.5777L21.7105 13.8242C21.6751 14.0153 21.683 14.1532 21.5963 14.3344C21.2143 15.1363 20.141 15.284 19.5699 14.5964C19.4793 14.4861 19.3021 14.165 19.3021 14.031V12.6204L19.304 12.6165Z"
              fill="#AAD543"
            />
          </svg>

          <h1 className="text-[#65A30D] text-[18px] font-bold ml-2">
            Lime Pitch
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigation.map((item) => {
          // Active logic
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 text-base leading-[150%] tracking-[0%] font-semibold transition-colors",
                isActive
                  ? "bg-[#F8F9FA] text-[#65A30D] font-bold text-[16px]"
                  : "text-[#65A30D] hover:bg-[#F8F9FA] hover:text-[#65A30D] font-normal",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 px-4 cursor-pointer rounded-lg font-medium text-[#e5102e] hover:bg-[#feecee] hover:text-[#e5102e] transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer"
                variant="destructive"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
