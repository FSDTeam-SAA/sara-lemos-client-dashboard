"use client";

import { usePathname } from "next/navigation";
import { getRouteConfig, RouteConfig } from "@/config/routes";

export function useCurrentRoute(): RouteConfig {
  const pathname = usePathname();
  return getRouteConfig(pathname);
}
