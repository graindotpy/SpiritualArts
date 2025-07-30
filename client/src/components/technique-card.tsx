import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import TooltipText from "./tooltip-text";
import { useTooltipContext } from "@/contexts/tooltip-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Technique, SPEffect, TechniquePreference } from "@shared/schema";

interface TechniqueCardProps {
  technique: Technique;
  isSelected: boolean;
  onSelect: (techniqueId: string, sp: number) => void;
  onEdit: (technique: Technique) => void;
  onDelete?: (techniqueId: string) => void;
}

// Simple user ID generator for demo purposes
const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
};

export default function TechniqueCard({ 
  technique, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete 
}: TechniqueCardProps) {
  const [currentSP, setCurrentSP] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { isEnhancedTooltipOpen } = useTooltipContext();
  const queryClient = useQueryClient();
  
  const userId = getUserId();

  // Query user preferences
  const { data: preferences = [] } = useQuery<TechniquePreference[]>({
    queryKey: ['/api/technique-preferences', userId],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation to update preferences
  const updatePreferenceMutation = useMutation({
    mutationFn: async ({ isMinimized }: { isMinimized: boolean }) => {
      return apiRequest(`/api/technique-preferences`, 'POST', {
        userId,
        techniqueId: technique.id,
        isMinimized
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/technique-preferences', userId]
      });
    }
  });

  const spEffects = technique.spEffects as SPEffect;
  const spOptions = Object.keys(spEffects).map(Number).sort((a, b) => a - b);
  
  // Initialize currentSP if not set
  useEffect(() => {
    if (currentSP === 0 && spOptions.length > 0) {
      setCurrentSP(spOptions[0]);
    }
  }, [currentSP, spOptions]);

  // Update local isMinimized state based on user preferences
  useEffect(() => {
    const preference = preferences.find(p => p.techniqueId === technique.id);
    if (preference) {
      setIsMinimized(preference.isMinimized);
    }
  }, [preferences, technique.id]);

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
    // Don't auto-roll on scroll, only update selection
  };

  // Prevent page scrolling when hovering over technique card
  useEffect(() => {
    const handleMouseLeave = () => {
      setIsHovered(false);
      document.body.style.overflow = 'unset';
    };

    const handlePageScroll = (e: WheelEvent) => {
      // If we're hovering and scrolling, prevent page scroll
      if (isHovered && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const isInBounds = e.clientX >= rect.left && e.clientX <= rect.right && 
                          e.clientY >= rect.top && e.clientY <= rect.bottom;
        
        if (isInBounds) {
          e.preventDefault();
        } else {
          // Mouse is outside card bounds, clear hover state
          setIsHovered(false);
          document.body.style.overflow = 'unset';
        }
      }
    };

    if (isHovered) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('wheel', handlePageScroll, { passive: false });
      document.addEventListener('mouseleave', handleMouseLeave);
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('wheel', handlePageScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered]);

  const handleClick = () => {
    // Prevent rolling when enhanced tooltip dialog is open
    if (isEnhancedTooltipOpen) {
      return;
    }
    
    if (currentSP > 0) {
      onSelect(technique.id, currentSP);
    }
  };

  const getTriggerColor = (type: string) => {
    switch (type) {
      case 'action':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'bonus':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'reaction':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
      case 'passive':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
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
      case 'passive':
        return 'Passive';
      default:
        return type;
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "p-4 transition-all duration-200 cursor-pointer group border-2 rounded-lg",
        "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700",
        "hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-spiritual-300 hover:shadow-md hover:scale-105"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        document.body.style.overflow = 'unset';
      }}
      onWheel={handleWheel}
      onClick={handleClick}
    >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-spiritual-600">
                {currentSP > 0 && spEffects[currentSP]?.alternateName ? spEffects[currentSP].alternateName : technique.name}
              </h4>
              {currentSP > 0 && spEffects[currentSP] && (
                <Badge className={getTriggerColor(spEffects[currentSP].actionType)}>
                  {formatTriggerType(spEffects[currentSP].actionType)}
                </Badge>
              )}
              {currentSP > 0 && (
                <Badge className="dark:bg-spiritual-900 dark:text-spiritual-300 bg-[#40177d] text-[#ffffff]">
                  {currentSP} SP
                </Badge>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  const newMinimizedState = !isMinimized;
                  setIsMinimized(newMinimizedState);
                  updatePreferenceMutation.mutate({ isMinimized: newMinimizedState });
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 h-auto p-1"
                title={isMinimized ? "Expand technique" : "Minimize technique"}
              >
                {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(technique);
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 h-auto p-1"
              >
                <Edit className="w-4 h-4" />
              </Button>
              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete "${technique.name}"? This cannot be undone.`)) {
                      onDelete(technique.id);
                    }
                  }}
                  className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 h-auto p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Expandable Content */}
          {!isMinimized && (
            <>
              <TooltipText 
                text={technique.triggerDescription}
                characterId={technique.characterId}
                className="text-sm text-gray-600 dark:text-gray-300 mb-3"
              />
              
              {/* Dynamic Effect Display */}
              {currentSP > 0 && spEffects[currentSP] && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                    Effect ({currentSP} SP Investment):
                  </h5>
                  <TooltipText 
                    text={spEffects[currentSP].effect}
                    characterId={technique.characterId}
                    className="text-sm text-gray-700 dark:text-gray-300"
                  />
                </div>
              )}
            </>
          )}
        </div>
    </div>
  );
}
