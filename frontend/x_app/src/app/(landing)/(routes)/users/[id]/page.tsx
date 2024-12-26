"use client";

import { use, useEffect, useState, useContext } from "react";

import { getUserById } from "@/lib/userService";
import { AppSidebar } from "@/components/app-sidebar";
import AuthContext from "@/app/utils/AuthContext";
import UserAvatar from "@/components/user-avatar";
import Image from "next/image";
import FollowerCount from "@/components/follower-count";
import EditProfileButton from "./edit-profile-button";
import FollowingCount from "@/components/following-count";
import FollowUnfollowButton from "./follow-unfollow-button";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  profile: string | null;
  created_at: string;
}

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserPage({ params }: UserPageProps) {
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const { user: loggedInUser } = useContext(AuthContext) || {};

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const userData = await getUserById(id as string);
          setUser(userData);
        } catch (error) {
          console.error("User not found", error);
        }
      };
      fetchUser();
    }
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="w-2/3">
        {/* Orta kısım içeriğini buraya ekleyebilirsiniz */}
        <main className="flex w-full min-w-0 gap-5">
          <div className="w-full min-w-0 space-y-5">
            <UserProfile user={user} loggedInUserId={loggedInUser?.id} />
          </div>
        </main>
      </div>

      {/* Menu Section */}
      <div className="w-1/3 p-4">
        <h2 className="text-xl font-semibold">Menu Section</h2>
        {/* Menü içeriğinizi buraya ekleyebilirsiniz */}
      </div>
    </div>
  );
}

interface UserProfileProps {
  user: User;
  loggedInUserId: Number | undefined;
}

function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const formattedDate = formatDate(user.created_at as string);
  return (
    <div className="h-fit w-full rounded-2xl bg-card shadow-sm pt-5 relative">
      {/* Banner */}
      <div className="relative h-40 w-full bg-gray-200">
        {/* Banner Resmi (isteğe bağlı) */}
        <Image
          src="/images.jpeg"
          alt="Banner"
          className="h-full w-full object-cover rounded-t-2xl"
          width={48}
          height={48}
        />

        {/* Profil Resmi */}
        <UserAvatar
          avatarUrl={user.profile}
          size={100}
          className="absolute bottom-[-50px] left-5 rounded-full border-4 border-white"
        />
      </div>

      {/* Edit Profile Butonu */}
      <div className="absolute mt-5 right-5">
        {/* Edit Profile Butonu */}
        {Number(user.id) === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowUnfollowButton
            userId={Number(user.id)}
            currentUserId={Number(loggedInUserId)}
          />
        )}
      </div>

      {/* Kullanıcı Bilgileri */}
      <div className="mt-12 px-5 pb-5 space-y-3">
        <div>
          <h1 className="text-3xl font-bold">
            <p>Mustafa Haita</p>
          </h1>
          <div className="text-muted-foreground">@{user.username}</div>
        </div>
        <div>Member since {formattedDate}</div>
        <div className="flex items-center gap-3">
          <FollowerCount userId={Number(user.id)} />
          <FollowingCount userId={Number(user.id)} />
        </div>
      </div>
    </div>
  );
}
