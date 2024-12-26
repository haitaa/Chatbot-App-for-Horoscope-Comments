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

/**
 * Formats an ISO date string into a more readable date format (DD/MM/YYYY).
 * 
 * @param isoString - The ISO 8601 date string to be formatted.
 * @returns A string representing the date in the format DD/MM/YYYY.
 * 
 * This function takes an ISO date string (e.g., "2024-12-26T10:00:00Z"), 
 * creates a JavaScript `Date` object from it, and formats the date into 
 * a string with the day, month, and year in the format "DD/MM/YYYY".
 */
export const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}