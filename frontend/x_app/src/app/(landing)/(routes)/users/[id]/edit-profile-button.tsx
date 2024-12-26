"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/lib/userService";

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
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    bio: user.bio || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedUser = await updateUser(Number(user.id), formData);
      toast.success("Profile updated successfully!");
      setIsOpen(false);
    } catch (e) {
      console.error("Error updating profile:", e);
      toast.error("Failed to update profile. Please try again later.");
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn("", className)}
            onClick={() => setIsOpen(true)}
          >
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                className="col-span-3"
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                First Name
              </Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Last Name
              </Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="col-span-3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
