import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const customNanoId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
export const customId = customNanoId();

export const CONTRACT_ADDRESS = "0x3bB2a442a2D34741167DcD91507c2a5Dd500e16c";
