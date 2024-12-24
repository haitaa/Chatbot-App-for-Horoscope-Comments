"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  profile: string | null;
}

interface EditProfileButtonProps {
  user: User;
  className?: string;
}

export default function EditProfileButton({
  user,
  className,
}: EditProfileButtonProps) {
  return (
    <>
      <Button
        variant={"outline"}
        onClick={() => {}}
        className={cn("", className)}
      >
        Edit Profile
      </Button>
    </>
  );
}
