import { LucideIcon } from "lucide-react";
import {
  Calendar,
  Ship,
  HardDrive,
  ShoppingBag,
  Settings,
  WandSparkles,
  Globe,
  Upload,
} from "lucide-react";

export interface RouteConfig {
  name: string;
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export const routes: RouteConfig[] = [
  {
    name: "Dashboard Overview",
    href: "/",
    icon: HardDrive,
    title: "Dashboard",
    subtitle: "See your updates today!",
  },
  {
    name: "Listings",
    href: "/listings",
    icon: Ship,
    title: "Listings",
    subtitle: "Manage your yacht listings",
  },
  {
    name: "Upload Listing",
    href: "/upload-listing",
    icon: Upload,
    title: "Upload New Listing",
    subtitle: "Choose how you'd like to create your yacht listing",
  },
  {
    name: "Social Accounts",
    href: "/social-accounts",
    icon: Globe,
    title: "Social Media Accounts",
    subtitle: "Connect and manage your social media accounts",
  },
  {
    name: "Content Generator",
    href: "/content-generator",
    icon: WandSparkles,
    title: "Content Generator",
    subtitle: "Create professional social media content powered by AI",
  },
  {
    name: "Saved Drafts",
    href: "/saved-drafts",
    icon: ShoppingBag,
    title: "Saved Drafts",
    subtitle: "View and edit your saved content",
  },
  {
    name: "Subscription",
    href: "/subscription",
    icon: Calendar,
    title: "Subscription",
    subtitle: "Manage your subscription plan",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    title: "Settings",
    subtitle: "Configure your account preferences",
  },
];

// Helper function to get route config by pathname
export function getRouteConfig(pathname: string): RouteConfig {
  // First, try exact match
  const exactMatch = routes.find((route) => route.href === pathname);
  if (exactMatch) return exactMatch;

  // Then, try to find a route that the pathname starts with (for nested routes)
  // Sort by length descending to match the most specific route first
  const sortedRoutes = [...routes].sort(
    (a, b) => b.href.length - a.href.length,
  );
  const partialMatch = sortedRoutes.find(
    (route) => route.href !== "/" && pathname.startsWith(route.href),
  );
  if (partialMatch) return partialMatch;

  // Default to dashboard
  return routes[0];
}
