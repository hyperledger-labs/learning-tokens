import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const copyCode = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success("Copied!");
  });
};
