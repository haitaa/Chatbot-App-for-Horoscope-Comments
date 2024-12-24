"use client";

import { AppSidebar } from "@/components/app-sidebar";
import UsersList from "@/components/users-list";

const UsersPage = () => {
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="w-2/3">
        {/* Orta kısım içeriğini buraya ekleyebilirsiniz */}
        <h1 className="text-center pt-10">Users</h1>
        <div className="mt-10">
          <div className="text-center">
            <UsersList />
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="w-1/3 p-4">
        <h2 className="text-xl font-semibold">Menu Section</h2>
        {/* Menü içeriğinizi buraya ekleyebilirsiniz */}
      </div>
    </div>
    // <div>
    //   <UsersList></UsersList>
    // </div>
  );
};

export default UsersPage;
