"use client";

import { ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../app/utils/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const context = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const user = context?.user;

  useEffect(() => {
    if (user === null) {
      // Kullanıcı yoksa login ekranına yönlendir
      router.push("/login");
    } else {
      // Kullanıcı varsa isLoading'i kapat
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Geçici bir yükleme ekranı
  }

  return <>{children}</>;
};

export default ProtectedRoute;
