import React from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
