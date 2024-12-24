"use client";

import { useEffect, useState } from "react";
import { getFollowers } from "@/lib/userService";

interface FollowerCountProps {
  userId: number;
}

export default function FollowerCount({ userId }: FollowerCountProps) {
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [followerCount, setFollowerCount] = useState<number>(0);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const followersData = await getFollowers(userId);
        setFollowers(followersData);
        setFollowerCount(followersData.length);
      } catch (error) {
        setError("Kullanıcıları yüklerken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{followerCount.toString()}</span>
    </span>
  );
}
