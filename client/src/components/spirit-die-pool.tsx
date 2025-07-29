import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info, RotateCcw } from "lucide-react";
import SpiritDie from "./spirit-die";
import type { SpiritDiePool, DieSize } from "@shared/schema";

interface SpiritDiePoolProps {
  pool: SpiritDiePool;
  currentDice: DieSize[];
  originalDice: DieSize[];
  selectedDieIndex: number | null;
  onDieSelect: (index: number) => void;
  onDieRestore: (index: number) => void;
  onRestoreAll: () => void;
}

export default function SpiritDiePoolComponent({ 
  pool, 
  currentDice, 
  originalDice,
  selectedDieIndex, 
  onDieSelect,
  onDieRestore,
  onRestoreAll
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
        {currentDice.map((dieSize, index) => {
          const originalDie = originalDice[index];
          const canRestore = originalDie && dieSize !== originalDie;
          
          return (
            <div key={index} className="flex flex-col items-center">
              {/* Reserve space for restore button to prevent layout shift */}
              <div className="h-6 mb-1 flex items-center">
                {canRestore && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDieRestore(index)}
                    className="h-6 px-2 text-xs text-gray-500 hover:text-spiritual-600 dark:text-gray-400 dark:hover:text-spiritual-400"
                    title={`Restore to ${originalDie}`}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Restore
                  </Button>
                )}
              </div>
              <SpiritDie
                size={dieSize}
                isActive={true}
                isSelected={selectedDieIndex === index}
                onClick={() => onDieSelect(index)}
              />
            </div>
          );
        })}
        
        {currentDice.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No active dice remaining</p>
            {originalDice.length > 0 && (
              <Button
                onClick={onRestoreAll}
                variant="outline"
                size="sm"
                className="bg-spiritual-50 border-spiritual-200 text-spiritual-700 hover:bg-spiritual-100 dark:bg-spiritual-900 dark:border-spiritual-700 dark:text-spiritual-300 dark:hover:bg-spiritual-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore All Dice ({originalDice.join(', ')})
              </Button>
            )}
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
