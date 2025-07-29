import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import SpiritDie from "./spirit-die";
import type { SpiritDiePool, DieSize } from "@shared/schema";

interface SpiritDiePoolProps {
  pool: SpiritDiePool;
  currentDice: DieSize[];
  selectedDieIndex: number | null;
  onDieSelect: (index: number) => void;
}

export default function SpiritDiePoolComponent({ 
  pool, 
  currentDice, 
  selectedDieIndex, 
  onDieSelect 
}: SpiritDiePoolProps) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Spirit Die Pool</h3>
        {currentDice.length > 1 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Click to select die for rolling
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {currentDice.map((dieSize, index) => (
          <SpiritDie
            key={index}
            size={dieSize}
            isActive={true}
            isSelected={selectedDieIndex === index}
            onClick={() => onDieSelect(index)}
          />
        ))}
        
        {currentDice.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No active dice remaining</p>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 ml-4">
          <Info className="w-4 h-4 mr-2" />
          Dice reduce on failed rolls
        </div>
      </div>
    </div>
  );
}
