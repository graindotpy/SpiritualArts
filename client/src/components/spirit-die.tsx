import { cn } from "@/lib/utils";
import type { DieSize } from "@shared/schema";

interface SpiritDieProps {
  size: DieSize;
  isActive: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function SpiritDie({ size, isActive, isSelected, onClick, className }: SpiritDieProps) {
  return (
    <div className={cn("relative group", className)}>
      <div 
        className={cn(
          "w-14 h-14 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg transform transition-all duration-200 border-2",
          "cursor-pointer select-none",
          isActive 
            ? cn(
                "bg-gradient-to-br from-spiritual-400 to-spiritual-600 text-white border-spiritual-300",
                "dark:from-spiritual-500 dark:to-spiritual-700 dark:border-spiritual-400 dark:text-white",
                "hover:scale-105 hover:shadow-xl",
                "[text-shadow:_0_1px_2px_rgb(0_0_0_/_0.8)]"
              )
            : cn(
                "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-100 border-gray-400",
                "dark:from-gray-600 dark:to-gray-800 dark:text-gray-300 dark:border-gray-500"
              ),
          isSelected && "ring-4 ring-spiritual-400 ring-opacity-60 scale-105"
        )}
        onClick={onClick}
      >
        {size}
      </div>
      
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xs text-white font-bold">✓</span>
        </div>
      )}
      
      <span className={cn(
        "absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium",
        "text-gray-600 dark:text-gray-400"
      )}>
        {isActive ? "Active" : "Used"}
      </span>
    </div>
  );
}
