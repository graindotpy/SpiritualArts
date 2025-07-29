import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import SpiritDie from "./spirit-die";
import type { SpiritDiePool, DieSize } from "@shared/schema";

interface SpiritDiePoolProps {
  pool: SpiritDiePool;
  currentDice: DieSize[];
}

export default function SpiritDiePoolComponent({ pool, currentDice }: SpiritDiePoolProps) {

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Current Spirit Die Pool</h3>
      <div className="flex items-center space-x-4">
        {currentDice.map((dieSize, index) => (
          <SpiritDie
            key={index}
            size={dieSize}
            isActive={true}
          />
        ))}
        
        {currentDice.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No active dice remaining</p>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-500 ml-4">
          <Info className="w-4 h-4 mr-2" />
          Dice reduce on failed rolls
        </div>
      </div>
    </div>
  );
}
