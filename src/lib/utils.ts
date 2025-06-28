import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isExternalLink = (link:string) => link.startsWith("http")

export const promisifyValue = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => (resolve(value)), 1000))
