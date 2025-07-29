import { cn } from "@/lib/utils";
import type { DieSize } from "@shared/schema";

interface SpiritDieProps {
  size: DieSize;
  isActive: boolean;
  className?: string;
}

export default function SpiritDie({ size, isActive, className }: SpiritDieProps) {
  return (
    <div className={cn("relative group", className)}>
      <div className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg transform transition-transform group-hover:scale-105 cursor-pointer",
        isActive 
          ? "bg-gradient-to-br from-spiritual-400 to-spiritual-600" 
          : "bg-gradient-to-br from-gray-400 to-gray-600"
      )}>
        {size}
      </div>
      {isActive && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-medium">✓</span>
        </div>
      )}
      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        {isActive ? "Active" : "Reduced"}
      </span>
    </div>
  );
}
