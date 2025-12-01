import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function switchJSONBoolean(jsonBool: string) {
  switch (jsonBool) {
    case "true":
      return true;
    default:
      return false;
  }
}
