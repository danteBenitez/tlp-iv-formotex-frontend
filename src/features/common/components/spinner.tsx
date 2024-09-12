import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export default function Spinner({ className }: { className: string }) {
  return (
    <LoaderCircle
      className={cn("w-12 h-12 text-blue-500 animate-spin", className)}
    />
  );
}
