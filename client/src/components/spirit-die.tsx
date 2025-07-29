import { cn } from "@/lib/utils";
import type { DieSize } from "@shared/schema";

// SVG die symbols for different die types
const DieSymbols = {
  d4: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
      <path d="M12 2L2 20h20L12 2zm0 3.26L19.07 18H4.93L12 5.26z"/>
    </svg>
  ),
  d6: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
      <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z"/>
      <circle cx="12" cy="12" r="1.5"/>
    </svg>
  ),
  d8: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
      <path d="M12 2L4 7v5l8 8 8-8V7l-8-5z"/>
    </svg>
  ),
  d10: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
      <path d="M12 2L3 7l9 13 9-13-9-5z"/>
      <path d="M12 2v18"/>
    </svg>
  ),
  d12: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
      <path d="M12 2l3.09 6.31L22 9.27l-3.64 5.46L20 21l-8-2-8 2 1.64-6.27L2 9.27l6.91-0.96L12 2z"/>
    </svg>
  ),
};

interface SpiritDieProps {
  size: DieSize;
  isActive: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function SpiritDie({ size, isActive, isSelected, onClick, className }: SpiritDieProps) {
  const dieSymbol = DieSymbols[size] || DieSymbols.d6;
  
  return (
    <div className={cn("relative group", className)}>
      <div 
        className={cn(
          "w-14 h-14 rounded-lg flex flex-col items-center justify-center shadow-lg transform transition-all duration-200 border-2",
          "cursor-pointer select-none",
          isActive 
            ? cn(
                "bg-gradient-to-br from-spiritual-400 to-spiritual-600 text-white border-spiritual-300",
                "dark:from-spiritual-500 dark:to-spiritual-700 dark:border-spiritual-400",
                "hover:scale-105 hover:shadow-xl"
              )
            : cn(
                "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-100 border-gray-400",
                "dark:from-gray-600 dark:to-gray-800 dark:text-gray-300 dark:border-gray-500"
              ),
          isSelected && "ring-4 ring-spiritual-400 ring-opacity-60 scale-105"
        )}
        onClick={onClick}
      >
        {dieSymbol}
        <span className="text-xs font-bold mt-0.5">{size}</span>
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
