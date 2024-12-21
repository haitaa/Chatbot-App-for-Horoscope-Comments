"use client";

import { useState, useEffect, useContext } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
      <AppSidebar data={sidebarData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}

// "use client";

// import { useContext } from "react";

// import { Button } from "@/components/ui/button";
// import AuthContext from "../../../utils/AuthContext";

// // Ana Sayfa

// const Home = () => {
//   const authContext = useContext(AuthContext);

//   if (!authContext) {
//     return <div>Loading...</div>;
//   }

//   const { user } = authContext;

//   if (!user) {
//     return <p>Loading...</p>;
//   }

//   const handleLogout = () => {
//     authContext?.logout(); // AuthContext'teki logout fonksiyonunu çağır
//   };

//   return (
//     <div>
//       <h1>HomePage {user.username}</h1>
//       <Button size="lg" onClick={handleLogout}>
//         Log out
//       </Button>
//     </div>
//   );
// };

// export default Home;
