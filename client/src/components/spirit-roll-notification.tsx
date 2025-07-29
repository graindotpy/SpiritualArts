import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dice6, CheckCircle, XCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpiritDieRollBroadcast } from '@/hooks/use-websocket';

interface SpiritRollNotificationProps {
  rollData: SpiritDieRollBroadcast | null;
  currentCharacterId?: string;
}

export default function SpiritRollNotification({ rollData, currentCharacterId }: SpiritRollNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (rollData && rollData.character.id !== currentCharacterId) {
      setVisible(true);
      
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [rollData, currentCharacterId]);

  if (!rollData) return null;

  const { character, roll } = rollData;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            duration: 0.6 
          }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <Card className="bg-white dark:bg-gray-800 border-2 border-spiritual-200 dark:border-spiritual-700 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Character Avatar */}
                <Avatar className="w-10 h-10 border-2 border-spiritual-200 dark:border-spiritual-600">
                  <AvatarImage src={character.portraitUrl || undefined} alt={character.name} />
                  <AvatarFallback className="bg-spiritual-100 dark:bg-spiritual-800">
                    <User className="w-5 h-5 text-spiritual-600 dark:text-spiritual-400" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  {/* Character Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {character.name}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {character.path}
                    </Badge>
                  </div>
                  
                  {/* Roll Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <Dice6 className="w-4 h-4 text-spiritual-600 dark:text-spiritual-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Rolled {roll.dieSize} for {roll.spInvestment} SP
                    </span>
                  </div>
                  
                  {/* Result */}
                  <div className="flex items-center gap-2">
                    {roll.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-bold text-lg ${
                      roll.success 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {roll.value}
                    </span>
                    <span className={`text-sm font-medium ${
                      roll.success 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {roll.success ? 'Success!' : 'Failed'}
                    </span>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setVisible(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs"
                >
                  ✕
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}