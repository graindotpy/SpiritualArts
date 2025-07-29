import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Moon, Sun, User } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import CharacterCreator from "@/components/character-creator";
import type { Character } from "@shared/schema";

interface MainMenuProps {
  onCharacterSelect: (character: Character) => void;
}

export default function MainMenu({ onCharacterSelect }: MainMenuProps) {
  const { theme, toggleTheme } = useTheme();
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  const handleCharacterSelect = (character: Character) => {
    onCharacterSelect(character);
  };

  const handleCharacterCreated = (newCharacter: Character) => {
    onCharacterSelect(newCharacter);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-spiritual-700 dark:text-spiritual-400">Path Manuals</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">Spiritual Arts Mechanics</p>
            </div>
            
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="sm"
              className="p-2"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Select a Character
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a character to view their sheet, or create a new one
          </p>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {characters.map((character) => (
            <Card
              key={character.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              onClick={() => handleCharacterSelect(character)}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-spiritual-100 dark:bg-spiritual-900 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-spiritual-600 dark:text-spiritual-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {character.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Level {character.level}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-spiritual-600 dark:text-spiritual-400 font-medium">
                    {character.path}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Character Card */}
          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border-2 border-dashed border-spiritual-300 dark:border-spiritual-600"
            onClick={() => setIsCreatorOpen(true)}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[180px]">
              <div className="w-12 h-12 bg-spiritual-100 dark:bg-spiritual-900 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-spiritual-600 dark:text-spiritual-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Create New Character
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Start your spiritual journey
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {characters.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-spiritual-100 dark:bg-spiritual-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-spiritual-600 dark:text-spiritual-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Characters Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first character to begin using the Spirit Die System
            </p>
            <Button
              onClick={() => setIsCreatorOpen(true)}
              className="bg-spiritual-600 hover:bg-spiritual-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Character
            </Button>
          </div>
        )}
      </main>
      {/* Character Creator Dialog */}
      <CharacterCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onCharacterCreated={handleCharacterCreated}
      />
    </div>
  );
}