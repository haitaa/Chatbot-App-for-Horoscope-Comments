import { useContext } from "react"

import AuthContext from "@/app/utils/AuthContext"

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getActiveUser = () => {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    return undefined;
  }

  const { user } = authContext;

  return user;
}