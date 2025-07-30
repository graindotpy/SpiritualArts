import { createContext, useContext, useState, ReactNode } from 'react';

interface TooltipContextType {
  isEnhancedTooltipOpen: boolean;
  setIsEnhancedTooltipOpen: (open: boolean) => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

interface TooltipProviderProps {
  children: ReactNode;
}

export function EnhancedTooltipProvider({ children }: TooltipProviderProps) {
  const [isEnhancedTooltipOpen, setIsEnhancedTooltipOpen] = useState(false);

  return (
    <TooltipContext.Provider value={{ isEnhancedTooltipOpen, setIsEnhancedTooltipOpen }}>
      {children}
    </TooltipContext.Provider>
  );
}

export function useTooltipContext() {
  const context = useContext(TooltipContext);
  if (context === undefined) {
    throw new Error('useTooltipContext must be used within a TooltipProvider');
  }
  return context;
}