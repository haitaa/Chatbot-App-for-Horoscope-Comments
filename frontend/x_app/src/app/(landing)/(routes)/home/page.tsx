"use client";

import { useState, useEffect, useContext } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import AuthContext from "@/app/utils/AuthContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user: currentUser } = useContext(AuthContext) || {};

  const sidebarData = {
    user: {
      name: currentUser?.username as string,
      email: currentUser?.email as string,
      avatar: currentUser?.profile as string,
    },
    navMain: [
      {
        title: "Playground",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen">
        {/* Sidebar */}
        <div className="">
          <AppSidebar data={sidebarData} />
        </div>

        {/* Main Content */}
        <div className="w-2/3">
          {/* Orta kısım içeriğini buraya ekleyebilirsiniz */}
          <h1 className="text-left">Timeline</h1>
        </div>

        {/* Menu Section */}
        <div className="w-1/3 p-4">
          <h2 className="text-xl font-semibold">Menu Section</h2>
          {/* Menü içeriğinizi buraya ekleyebilirsiniz */}
        </div>
      </div>
    </SidebarProvider>
  );
}
