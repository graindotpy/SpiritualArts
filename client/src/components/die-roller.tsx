import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Technique, RollResult } from "@shared/schema";

interface DieRollerProps {
  selectedTechnique: Technique | undefined;
  selectedSP: number;
  selectedDie: string | null;
  onRoll: () => Promise<void>;
  isRolling: boolean;
}

export default function DieRoller({ 
  selectedTechnique, 
  selectedSP, 
  selectedDie,
  onRoll, 
  isRolling 
}: DieRollerProps) {
  const [rollResult, setRollResult] = useState<RollResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRoll = async () => {
    if (!selectedTechnique || selectedSP === 0 || !selectedDie) return;
    
    setIsAnimating(true);
    setRollResult(null);
    
    try {
      await onRoll();
      // Roll result will be handled by the parent component's state management
    } catch (error) {
      console.error("Roll failed:", error);
    } finally {
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const targetNumber = selectedSP > 0 ? `${selectedSP}+` : '-';

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Spirit Die Roller</h3>
        
        <div className="text-center mb-6">
          <div className={cn(
            "w-24 h-24 mx-auto bg-gradient-to-br from-spiritual-400 to-spiritual-600 dark:from-spiritual-500 dark:to-spiritual-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4 transform transition-transform hover:scale-105 cursor-pointer",
            isAnimating && "animate-bounce"
          )}>
            {rollResult ? rollResult.value : selectedDie || "?"}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {selectedDie ? `Rolling ${selectedDie} with ${selectedSP} SP` : "Select technique and die to roll"}
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Selected Technique:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {selectedTechnique?.name || "None"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">SP Investment:</span>
            <span className="font-medium text-spiritual-600 dark:text-spiritual-400">{selectedSP}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Target Number:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{targetNumber}</span>
          </div>
        </div>
        
        <Button
          onClick={handleRoll}
          disabled={!selectedTechnique || selectedSP === 0 || isRolling}
          className="w-full bg-spiritual-600 hover:bg-spiritual-700 dark:bg-spiritual-700 dark:hover:bg-spiritual-800 text-white mt-4"
        >
          {isRolling ? "Rolling..." : "Roll Spirit Die"}
        </Button>
        
        {/* Roll Result */}
        {rollResult && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {rollResult.value}
              </div>
              <div className={cn(
                "text-sm",
                rollResult.success ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              )}>
                {rollResult.success ? "Success!" : "Failed - Die Reduced"}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
