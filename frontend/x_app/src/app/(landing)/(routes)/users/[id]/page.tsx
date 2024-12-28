"use client";

import { useEffect, useState, useContext } from "react";
import {
  FaRegComment,
  FaRegHeart,
  FaRetweet,
  FaBookmark,
} from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { useParams } from "next/navigation";

import { getUserById } from "@/lib/userService";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthContext } from "@/app/utils/AuthContext";
import UserAvatar from "@/components/user-avatar";
import Image from "next/image";
import FollowerCount from "@/components/follower-count";
import EditProfileButton from "./edit-profile-button";
import FollowingCount from "@/components/following-count";
import FollowUnfollowButton from "./follow-unfollow-button";
import { formatDate, formatTime } from "@/lib/utils";
import { getUserTweets } from "@/lib/tweetService";

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
  params: {
    id: string;
  };
}

export default function UserPage({ params }: UserPageProps) {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { user: loggedInUser } = authContext;

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
            <UserTweets user={user} />
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
  loggedInUserId: number | undefined;
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
            <p>
              {user.first_name} {user.last_name}
            </p>
          </h1>
          <div className="text-muted-foreground">@{user.username}</div>
        </div>
        {user.bio && (
          <div className="mt-3 text-gray-600">
            <p>{user.bio}</p>
          </div>
        )}
        <div>Member since {formattedDate}</div>
        <div className="flex items-center gap-3">
          <FollowerCount userId={Number(user.id)} />
          <FollowingCount userId={Number(user.id)} />
        </div>
      </div>
    </div>
  );
}

interface Tweet {
  id: number;
  content: string;
  created_at: string;
}

interface UserTweetsProps {
  user: User;
}

function UserTweets({ user }: UserTweetsProps) {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    const fetchUsersTweets = async () => {
      if (user.id) {
        try {
          const userTweets = await getUserTweets(Number(user.id));
          setTweets(userTweets);
          console.log(tweets);
        } catch (error) {
          console.error("Error fetching tweets: ", error);
          throw error;
        }
      }
    };
    fetchUsersTweets();
  }, [user.id]);

  return (
    <div className="mt-10 px-5">
      {tweets.map((tweet) => (
        <div
          key={tweet.id}
          className="mb-6 bg-white p-4 rounded-lg shadow-md flex items-start space-x-4 relative"
        >
          <div className="flex-shrink-0">
            {/* Profil Avatarı */}
            <Image
              src={user.profile ? user.profile : "/avatar-placeholder.png"} // Avatar resmi
              alt="User Avatar"
              className="h-12 w-12 rounded-full"
              width={48}
              height={48}
            />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-lg text-black">
              <span className="text-blue-600">
                {user.first_name} {user.last_name}
              </span>
              <div className="text-sm text-gray-600">@{user.username}</div>
            </div>
            <div className="text-xl text-gray-800 mt-2">{tweet.content}</div>

            {/* Tweetin oluşturulma tarihi ve saati */}
            <div className="absolute top-3 right-5 text-sm text-gray-500 mt-2">
              {formatDate(tweet.created_at)}{" "}
              <span className="ml-2">{formatTime(tweet.created_at)}</span>
            </div>

            {/* Etkileşim Butonları */}
            <div className="flex items-center space-x-6 mt-3 text-sm text-gray-600">
              <div className="flex items-center space-x-1 cursor-pointer">
                <FaRegHeart className="h-5 w-5" />
                <span>Beğen</span>
              </div>
              <div className="flex items-center space-x-1 cursor-pointer">
                <FaRegComment className="h-5 w-5" />
                <span>Yorum</span>
              </div>
              <div className="flex items-center space-x-1 cursor-pointer">
                <FaRetweet className="h-5 w-5" />
                <span>Retweet</span>
              </div>
            </div>
          </div>

          {/* Kaydet butonunu sağ alt köşeye yerleştir */}
          <div className="absolute bottom-0 right-0 p-4 flex items-center space-x-1 cursor-pointer">
            <CiBookmark className="h-5 w-5" />
            <span>Kaydet</span>
          </div>
        </div>
      ))}
    </div>
  );
}
