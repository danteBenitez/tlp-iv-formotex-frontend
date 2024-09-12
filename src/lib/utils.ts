import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<A>(func: (...args: A[]) => void, secs: number) {
  let stop = false;
  return (...args: A[]) => {
    if (!stop) func(...args);
    stop = true;
    setTimeout(() => {
      stop = false;
    }, secs);
  }
}
