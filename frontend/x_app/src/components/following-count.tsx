"use client";

import { useEffect, useState } from "react";
import { getFollowings } from "@/lib/userService";

interface FollowingCountProps {
  userId: number;
}

export default function FollowingCount({ userId }: FollowingCountProps) {
  const [followings, setFollowings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [followingCount, setFollowingCount] = useState<number>(0);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const followingsData = await getFollowings(userId);
        setFollowings(followingsData);
        setFollowingCount(followingsData.length);
      } catch (error) {
        setError("Takip edilenleri yüklerken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowings();
  }, [userId]);

  return (
    <span>
      Following:{" "}
      <span className="font-semibold">{followingCount.toString()}</span>
    </span>
  );
}
