import { Switch, Route, useLocation } from "wouter";
import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import CharacterSheet from "@/pages/character-sheet";
import MainMenu from "@/pages/main-menu";
import NotFound from "@/pages/not-found";
import type { Character } from "@shared/schema";

function Router() {
  const [, setLocation] = useLocation();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setLocation(`/character/${character.id}`);
  };

  const handleReturnToMenu = () => {
    setSelectedCharacter(null);
    setLocation("/");
  };

  return (
    <Switch>
      <Route path="/">
        <MainMenu onCharacterSelect={handleCharacterSelect} />
      </Route>
      <Route path="/character/:id">
        {selectedCharacter ? (
          <CharacterSheet 
            character={selectedCharacter}
            onReturnToMenu={handleReturnToMenu}
          />
        ) : (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Character not found</p>
              <button 
                onClick={handleReturnToMenu}
                className="text-spiritual-600 hover:text-spiritual-700 dark:text-spiritual-400 dark:hover:text-spiritual-300"
              >
                Return to Main Menu
              </button>
            </div>
          </div>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
