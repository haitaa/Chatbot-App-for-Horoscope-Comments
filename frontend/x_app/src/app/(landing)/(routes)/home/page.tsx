"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Chatbot from "@/components/chatbot";

export default function Page() {
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="w-2/3">
        {/* Orta kısım içeriğini buraya ekleyebilirsiniz */}

        <Chatbot />
      </div>

      {/* Menu Section */}
      <div className="w-1/3 p-4">
        <h2 className="text-xl font-semibold">Menu Section</h2>
        {/* Menü içeriğinizi buraya ekleyebilirsiniz */}
      </div>
    </div>
  );
}
