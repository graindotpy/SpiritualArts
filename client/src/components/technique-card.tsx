import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Technique, SPEffect } from "@shared/schema";

interface TechniqueCardProps {
  technique: Technique;
  isSelected: boolean;
  onSelect: (techniqueId: string, sp: number) => void;
  onEdit: (technique: Technique) => void;
  onDelete?: (techniqueId: string) => void;
}

export default function TechniqueCard({ 
  technique, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete 
}: TechniqueCardProps) {
  const [currentSP, setCurrentSP] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const spEffects = technique.spEffects as SPEffect;
  const spOptions = Object.keys(spEffects).map(Number).sort((a, b) => a - b);
  
  // Initialize currentSP if not set
  if (currentSP === 0 && spOptions.length > 0) {
    setCurrentSP(spOptions[0]);
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!isHovered || spOptions.length === 0) return;
    
    e.preventDefault();
    e.stopPropagation();

    const currentIndex = spOptions.indexOf(currentSP);
    let newIndex = currentIndex;

    if (e.deltaY < 0 && currentIndex < spOptions.length - 1) {
      newIndex = currentIndex + 1;
    } else if (e.deltaY > 0 && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    const newSP = spOptions[newIndex];
    setCurrentSP(newSP);
    onSelect(technique.id, newSP);
  };

  // Prevent page scrolling when hovering over technique card
  useEffect(() => {
    if (isHovered) {
      // Disable page scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable page scrolling
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scrolling is re-enabled
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isHovered]);

  const handleClick = () => {
    if (currentSP > 0) {
      onSelect(technique.id, currentSP);
    }
  };

  const getTriggerColor = (type: string) => {
    switch (type) {
      case 'action':
        return 'bg-green-100 text-green-800';
      case 'bonus':
        return 'bg-blue-100 text-blue-800';
      case 'reaction':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTriggerType = (type: string) => {
    switch (type) {
      case 'action':
        return 'Action';
      case 'bonus':
        return 'Bonus Action';
      case 'reaction':
        return 'Reaction';
      default:
        return type;
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "p-6 transition-all duration-200 cursor-pointer group border-2 rounded-lg",
        "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700",
        "hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-spiritual-300 hover:shadow-md hover:scale-105"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleWheel}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-spiritual-600">
              {technique.name}
            </h4>
            <Badge className={getTriggerColor(technique.triggerType)}>
              {formatTriggerType(technique.triggerType)}
            </Badge>
            {isHovered && currentSP > 0 && (
              <Badge className="bg-spiritual-100 text-spiritual-800">
                {currentSP} SP
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {technique.triggerDescription}
          </p>
          
          {/* Dynamic Effect Display */}
          {currentSP > 0 && spEffects[currentSP] && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                Effect ({currentSP} SP Investment):
              </h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {spEffects[currentSP]}
              </p>
            </div>
          )}
        </div>
        
        <div className="ml-4 flex flex-col space-y-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(technique);
            }}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 h-auto p-1"
          >
            <Edit className="w-5 h-5" />
          </Button>
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(technique.id);
              }}
              className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 h-auto p-1"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
