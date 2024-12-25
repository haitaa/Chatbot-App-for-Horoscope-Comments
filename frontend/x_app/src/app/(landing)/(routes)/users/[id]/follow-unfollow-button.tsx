"use client";

import { useState, useEffect } from "react";

import {
  getFollowers,
  followUser,
  checkIfUserIsFollowing,
  unfollowUser,
} from "@/lib/userService";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FollowUnfollowButtonProps {
  userId: number;
  currentUserId: number;
  className?: string;
}

const FollowUnfollowButton = ({
  userId,
  currentUserId,
  className,
}: FollowUnfollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const status = await checkIfUserIsFollowing(userId, currentUserId);
        setIsFollowing(status);
      } catch (error) {
        console.error("Error fetching following status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkFollowingStatus();
  }, [currentUserId, userId]);

  const handleFollow = async () => {
    setLoading(true);
    try {
      await followUser(userId, currentUserId);
      setIsFollowing(true);
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setLoading(true);
    try {
      const result = await unfollowUser(userId, currentUserId);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setLoading(false);
      setIsFollowing(false);
    }
  };

  return (
    <>
      <Button
        variant={"outline"}
        onClick={isFollowing ? handleUnfollow : handleFollow}
        className={cn("", className)}
        disabled={loading}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </>
  );
};

export default FollowUnfollowButton;
