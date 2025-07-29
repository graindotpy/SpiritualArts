import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Character } from "@shared/schema";

interface CharacterSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterSelect: (character: Character) => void;
  onNewCharacter: () => void;
  currentCharacterId?: string;
}

export default function CharacterSelector({ 
  isOpen, 
  onClose, 
  onCharacterSelect, 
  onNewCharacter, 
  currentCharacterId 
}: CharacterSelectorProps) {
  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
    enabled: isOpen,
  });

  const handleCharacterSelect = (character: Character) => {
    onCharacterSelect(character);
    onClose();
  };

  const handleNewCharacter = () => {
    onClose();
    onNewCharacter();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-[var(--dialog-bg)] border-gray-200 dark:border-[var(--dialog-border)]">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Select Character
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {characters.map((character) => (
            <Card 
              key={character.id}
              className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                character.id === currentCharacterId 
                  ? 'ring-2 ring-spiritual-500 bg-spiritual-50 dark:bg-spiritual-900/20' 
                  : ''
              }`}
              onClick={() => handleCharacterSelect(character)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {character.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {character.path} • Level {character.level}
                    </p>
                  </div>
                  {character.id === currentCharacterId && (
                    <div className="text-xs bg-spiritual-100 dark:bg-spiritual-800 text-spiritual-700 dark:text-spiritual-300 px-2 py-1 rounded">
                      Current
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {characters.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No characters found
            </div>
          )}
        </div>
        
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleNewCharacter}
            className="bg-spiritual-600 hover:bg-spiritual-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Character
          </Button>
          
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}