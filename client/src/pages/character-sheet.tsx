import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Home, Moon, Sun, TrendingUp } from "lucide-react";
import SpiritDiePoolComponent from "@/components/spirit-die-pool";
import TechniqueCard from "@/components/technique-card";
import DieRoller from "@/components/die-roller";
import TechniqueEditor from "@/components/technique-editor";
import SpiritDieOverride from "@/components/spirit-die-override";
import EditableCharacterHeader from "@/components/editable-character-header";
import LevelEditor from "@/components/level-editor";
import { useTheme } from "@/components/theme-provider";
import { useCharacterState } from "@/hooks/use-character-state";
import { SPIRIT_DIE_PROGRESSION } from "@shared/schema";
import type { Character, Technique, SpiritDiePool, DieSize } from "@shared/schema";

interface CharacterSheetProps {
  character: Character;
  onReturnToMenu: () => void;
}

export default function CharacterSheet({ character, onReturnToMenu }: CharacterSheetProps) {
  const { theme, toggleTheme } = useTheme();
  const [selectedDieIndex, setSelectedDieIndex] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTechnique, setEditingTechnique] = useState<Technique | null>(null);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [isLevelEditorOpen, setIsLevelEditorOpen] = useState(false);

  const { data: spiritDiePool } = useQuery<SpiritDiePool>({
    queryKey: ["/api/character", character.id, "spirit-die-pool"],
  });

  const { data: techniques = [] } = useQuery<Technique[]>({
    queryKey: ["/api/character", character.id, "techniques"],
  });

  const {
    updateSpiritDiePool,
    rollSpiritedie
  } = useCharacterState(character.id);

  // Get level-based dice or use override
  const levelBasedDice = SPIRIT_DIE_PROGRESSION[character.level] || ['d4'];
  const isUsingOverride = spiritDiePool?.overrideDice !== null;
  const currentDice = spiritDiePool?.currentDice as DieSize[] || levelBasedDice;
  // Original dice should always be level-based unless there's an explicit override
  const originalDice = isUsingOverride ? (spiritDiePool?.overrideDice as DieSize[] || levelBasedDice) : levelBasedDice as DieSize[];

  // Auto-select first die if none selected and dice are available
  if (selectedDieIndex === null && currentDice.length > 0) {
    setSelectedDieIndex(0);
  }

  // Reset selection if die no longer exists
  if (selectedDieIndex !== null && selectedDieIndex >= currentDice.length) {
    setSelectedDieIndex(currentDice.length > 0 ? 0 : null);
  }

  // Global cleanup to ensure page scrolling is always restored
  useEffect(() => {
    const cleanup = () => {
      document.body.style.overflow = 'unset';
    };

    // Cleanup on window focus/blur events
    window.addEventListener('blur', cleanup);
    window.addEventListener('beforeunload', cleanup);
    
    return () => {
      cleanup();
      window.removeEventListener('blur', cleanup);
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);



  const handleDiceOverride = async (dice: DieSize[]) => {
    await updateSpiritDiePool.mutateAsync({
      currentDice: dice,
      overrideDice: dice
    });
  };

  const handleResetToLevel = async () => {
    const levelDice = SPIRIT_DIE_PROGRESSION[character.level] || ['d4'];
    await updateSpiritDiePool.mutateAsync({
      currentDice: levelDice,
      overrideDice: null
    });
  };

  const handleTechniqueSelect = async (techniqueId: string, sp: number) => {
    // Direct roll when technique is clicked with SP investment
    if (sp > 0 && selectedDieIndex !== null) {
      await rollSpiritedie.mutateAsync({ 
        spInvestment: sp,
        dieIndex: selectedDieIndex 
      });
    }
  };

  const handleDieSelect = (index: number) => {
    setSelectedDieIndex(index);
  };

  const handleDieRestore = async (index: number) => {
    // Create a copy of current dice array
    const newDice = [...currentDice];
    
    // Restore the specific die to its original value
    if (index < originalDice.length) {
      newDice[index] = originalDice[index] as DieSize;
      
      await updateSpiritDiePool.mutateAsync({
        currentDice: newDice
      });
    }
  };

  const handleRestoreAll = async () => {
    await updateSpiritDiePool.mutateAsync({
      currentDice: originalDice
    });
  };

  const handleEditTechnique = (technique: Technique) => {
    setEditingTechnique(technique);
    setIsEditorOpen(true);
  };

  const handleAddTechnique = () => {
    setEditingTechnique(null);
    setIsEditorOpen(true);
  };

  // Remove selected technique data since we no longer track selection

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-spiritual-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading character sheet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onReturnToMenu}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Main Menu
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-spiritual-700 dark:text-spiritual-400">
                  {character.name}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {character.path} • Level {character.level}
                  </p>
                  <Button
                    onClick={() => setIsLevelEditorOpen(true)}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Character Info & Spirit Die Pool */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <SpiritDiePoolComponent
                currentDice={currentDice}
                originalDice={originalDice}
                selectedDieIndex={selectedDieIndex}
                onDieSelect={handleDieSelect}
                onDieRestore={handleDieRestore}
                onRestoreAll={handleRestoreAll}
                isUsingOverride={isUsingOverride}
                onOverride={() => setIsOverrideOpen(true)}
                onResetToLevel={handleResetToLevel}
              />
            </div>
          </div>

          {/* Middle Column - Techniques */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Techniques</h2>
              <Button
                onClick={handleAddTechnique}
                className="bg-spiritual-600 hover:bg-spiritual-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Technique
              </Button>
            </div>

            <div className="space-y-4">
              {techniques.map((technique) => (
                <TechniqueCard
                  key={technique.id}
                  technique={technique}
                  isSelected={false}
                  onSelect={handleTechniqueSelect}
                  onEdit={() => handleEditTechnique(technique)}
                />
              ))}
              
              {techniques.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No techniques yet. Click "Add Technique" to create your first one.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <TechniqueEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          technique={editingTechnique}
          characterId={character.id}
        />

        <SpiritDieOverride
          isOpen={isOverrideOpen}
          onClose={() => setIsOverrideOpen(false)}
          currentDice={originalDice}
          onSave={handleDiceOverride}
        />

        {/* Level Editor Dialog */}
        <LevelEditor
          character={character}
          isOpen={isLevelEditorOpen}
          onClose={() => setIsLevelEditorOpen(false)}
        />

      </main>
    </div>
  );
}
