"use client";

import { use, useEffect, useState } from "react";

import { getUserById } from "@/lib/userService";

interface UserPageProps {
  params: {
    id: string;
  };
}

const UserPage = ({ params }: UserPageProps) => {
  const id = params.id;
  const [user, setUser] = useState<any>(null);

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
    <div>
      <h1>User Information</h1>
      <p>
        <strong>Name:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      {/* Kullanıcı bilgilerini burada render edebilirsiniz */}
    </div>
  );
};

export default UserPage;
