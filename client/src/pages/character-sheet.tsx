import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Moon, Sun } from "lucide-react";
import SpiritDiePoolComponent from "@/components/spirit-die-pool";
import TechniqueCard from "@/components/technique-card";
import DieRoller from "@/components/die-roller";
import TechniqueEditor from "@/components/technique-editor";
import SpiritDieOverride from "@/components/spirit-die-override";
import { useCharacterState } from "@/hooks/use-character-state";
import { useTheme } from "@/components/theme-provider";
import { SPIRIT_DIE_PROGRESSION } from "@shared/schema";
import type { Character, Technique, SpiritDiePool, DieSize } from "@shared/schema";

export default function CharacterSheet() {
  const { theme, toggleTheme } = useTheme();
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [selectedSP, setSelectedSP] = useState<number>(0);
  const [selectedDieIndex, setSelectedDieIndex] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTechnique, setEditingTechnique] = useState<Technique | null>(null);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);

  const { data: character } = useQuery<Character>({
    queryKey: ["/api/character"],
  });

  const { data: spiritDiePool } = useQuery<SpiritDiePool>({
    queryKey: ["/api/character", character?.id, "spirit-die-pool"],
    enabled: !!character?.id,
  });

  const { data: techniques = [] } = useQuery<Technique[]>({
    queryKey: ["/api/character", character?.id, "techniques"],
    enabled: !!character?.id,
  });

  const {
    updateSpiritDiePool,
    updateCharacterLevel,
    rollSpiritedie
  } = useCharacterState(character?.id);

  // Get level-based dice or use override
  const levelBasedDice = character ? SPIRIT_DIE_PROGRESSION[character.level] || ['d4'] : ['d4'];
  const isUsingOverride = spiritDiePool?.overrideDice !== null;
  const currentDice = spiritDiePool?.currentDice as DieSize[] || levelBasedDice;

  // Auto-select first die if none selected and dice are available
  if (selectedDieIndex === null && currentDice.length > 0) {
    setSelectedDieIndex(0);
  }

  // Reset selection if die no longer exists
  if (selectedDieIndex !== null && selectedDieIndex >= currentDice.length) {
    setSelectedDieIndex(currentDice.length > 0 ? 0 : null);
  }

  const handleLevelChange = async (newLevel: number) => {
    if (!character?.id) return;
    await updateCharacterLevel.mutateAsync({ level: newLevel });
  };

  const handleDiceOverride = async (dice: DieSize[]) => {
    if (!character?.id) return;
    await updateSpiritDiePool.mutateAsync({
      currentDice: dice,
      overrideDice: dice
    });
  };

  const handleResetToLevel = async () => {
    if (!character?.id) return;
    const levelDice = SPIRIT_DIE_PROGRESSION[character.level] || ['d4'];
    await updateSpiritDiePool.mutateAsync({
      currentDice: levelDice,
      overrideDice: null
    });
  };

  const handleTechniqueSelect = (techniqueId: string, sp: number) => {
    setSelectedTechnique(techniqueId);
    setSelectedSP(sp);
  };

  const handleRoll = async () => {
    if (!selectedTechnique || !selectedSP || selectedDieIndex === null) return;
    await rollSpiritedie.mutateAsync({ 
      spInvestment: selectedSP,
      dieIndex: selectedDieIndex 
    });
  };

  const handleDieSelect = (index: number) => {
    setSelectedDieIndex(index);
  };

  const handleEditTechnique = (technique: Technique) => {
    setEditingTechnique(technique);
    setIsEditorOpen(true);
  };

  const handleAddTechnique = () => {
    setEditingTechnique(null);
    setIsEditorOpen(true);
  };

  const selectedTechniqueData = techniques.find(t => t.id === selectedTechnique);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-spiritual-700 dark:text-spiritual-400">Spiritual Arts - Spirit Die System</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Character Info & Spirit Die Pool */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{character.name}</h2>
                <p className="text-lg text-spiritual-600 font-medium mb-1">{character.path}</p>
                <p className="text-sm text-gray-500">Level {character.level} Spiritual Artist</p>
              </div>
              
              {/* Level & Spirit Die Configuration */}
              <div className="lg:text-right">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level" className="text-sm font-medium text-gray-700">
                      Character Level
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="level"
                        type="number"
                        min={1}
                        max={20}
                        value={character?.level || 3}
                        onChange={(e) => handleLevelChange(parseInt(e.target.value) || 3)}
                        className="w-20"
                      />
                      <span className="flex items-center text-sm text-gray-500">
                        → {levelBasedDice.join(', ')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Manual Override
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={handleResetToLevel}
                        disabled={updateSpiritDiePool.isPending || !isUsingOverride}
                      >
                        Use Level-Based
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => setIsOverrideOpen(true)}
                        disabled={updateSpiritDiePool.isPending}
                      >
                        Custom Dice
                      </Button>
                    </div>
                    {isUsingOverride && (
                      <p className="text-xs text-spiritual-600 mt-1">
                        Using custom dice configuration
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Current Spirit Die Pool Display */}
            {spiritDiePool && (
              <SpiritDiePoolComponent 
                pool={spiritDiePool} 
                currentDice={currentDice}
                selectedDieIndex={selectedDieIndex}
                onDieSelect={handleDieSelect}
              />
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Techniques List */}
          <div className="xl:col-span-3">
            <Card>
              <CardContent className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Path Techniques</h3>
                  <Button 
                    onClick={handleAddTechnique}
                    className="bg-spiritual-600 hover:bg-spiritual-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Technique
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Hover over techniques and scroll to select SP investment, then click to roll
                </p>
              </CardContent>
              
              <div className="divide-y divide-gray-200">
                {techniques.map((technique) => (
                  <TechniqueCard
                    key={technique.id}
                    technique={technique}
                    isSelected={selectedTechnique === technique.id}
                    onSelect={handleTechniqueSelect}
                    onEdit={handleEditTechnique}
                  />
                ))}
              </div>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Die Roller */}
            <DieRoller
              selectedTechnique={selectedTechniqueData}
              selectedSP={selectedSP}
              selectedDie={selectedDieIndex !== null ? currentDice[selectedDieIndex] : null}
              onRoll={handleRoll}
              isRolling={rollSpiritedie.isPending}
            />
            

          </div>
        </div>
      </div>

      {/* Technique Editor Modal */}
      <TechniqueEditor
        technique={editingTechnique}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        characterId={character.id}
      />

      {/* Spirit Die Override Modal */}
      <SpiritDieOverride
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        currentDice={currentDice}
        onSave={handleDiceOverride}
      />
    </div>
  );
}
