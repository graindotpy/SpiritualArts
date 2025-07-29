import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import SpiritDiePoolComponent from "@/components/spirit-die-pool";
import TechniqueCard from "@/components/technique-card";
import DieRoller from "@/components/die-roller";
import TechniqueEditor from "@/components/technique-editor";
import { useCharacterState } from "@/hooks/use-character-state";
import type { Character, Technique, SpiritDiePool, ActiveEffect, DieSize } from "@shared/schema";

export default function CharacterSheet() {
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [selectedSP, setSelectedSP] = useState<number>(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTechnique, setEditingTechnique] = useState<Technique | null>(null);
  const [diceCount, setDiceCount] = useState<number>(2);
  const [dieSize, setDieSize] = useState<DieSize>("d4");

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

  const { data: activeEffects = [] } = useQuery<ActiveEffect[]>({
    queryKey: ["/api/character", character?.id, "active-effects"],
    enabled: !!character?.id,
  });

  const {
    updateSpiritDiePool,
    rollSpiritedie,
    longRest,
    deleteActiveEffect
  } = useCharacterState(character?.id);

  const handleUpdatePool = async () => {
    if (!character?.id) return;
    
    const newDice = Array(diceCount).fill(dieSize);
    await updateSpiritDiePool.mutateAsync({
      diceCount,
      dieSize,
      currentDice: newDice
    });
  };

  const handleTechniqueSelect = (techniqueId: string, sp: number) => {
    setSelectedTechnique(techniqueId);
    setSelectedSP(sp);
  };

  const handleRoll = async () => {
    if (!selectedTechnique || !selectedSP) return;
    await rollSpiritedie.mutateAsync({ spInvestment: selectedSP });
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-spiritual-700">Spiritual Arts</h1>
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-spiritual-600 border-b-2 border-spiritual-600 px-1 pb-4 text-sm font-medium">
                  Character Sheet
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-1 pb-4 text-sm font-medium">
                  Inventory
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-1 pb-4 text-sm font-medium">
                  Journal
                </a>
              </nav>
            </div>
            <Button className="bg-spiritual-600 hover:bg-spiritual-700">
              Export Character
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
              
              {/* Spirit Die Pool Configuration */}
              <div className="lg:text-right">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Spirit Die Pool Configuration
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start lg:items-end">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Number of Dice</label>
                    <Select value={diceCount.toString()} onValueChange={(value) => setDiceCount(parseInt(value))}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Die</SelectItem>
                        <SelectItem value="2">2 Dice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Die Size</label>
                    <Select value={dieSize} onValueChange={(value: DieSize) => setDieSize(value)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="d4">d4</SelectItem>
                        <SelectItem value="d6">d6</SelectItem>
                        <SelectItem value="d8">d8</SelectItem>
                        <SelectItem value="d10">d10</SelectItem>
                        <SelectItem value="d12">d12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleUpdatePool}
                    disabled={updateSpiritDiePool.isPending}
                    className="bg-spiritual-600 hover:bg-spiritual-700"
                  >
                    Update Pool
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Current Spirit Die Pool Display */}
            {spiritDiePool && (
              <SpiritDiePoolComponent 
                pool={spiritDiePool} 
                onLongRest={() => longRest.mutateAsync()}
                isLoading={longRest.isPending}
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
              onRoll={handleRoll}
              isRolling={rollSpiritedie.isPending}
            />
            
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => longRest.mutateAsync()}
                    disabled={longRest.isPending}
                  >
                    Long Rest (Restore Dice)
                  </Button>
                  <Button variant="secondary" className="w-full">
                    Import Techniques
                  </Button>
                  <Button variant="secondary" className="w-full">
                    Export Techniques
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Active Effects */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Effects</h3>
                <div className="space-y-2">
                  {activeEffects.length > 0 ? (
                    activeEffects.map((effect) => (
                      <div key={effect.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                        <span className="text-sm font-medium text-yellow-800">
                          {effect.name} {effect.level && `(${effect.level})`}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteActiveEffect.mutateAsync(effect.id)}
                          className="text-yellow-600 hover:text-yellow-800 h-auto p-1"
                        >
                          ✕
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No active effects</p>
                  )}
                </div>
              </CardContent>
            </Card>
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
    </div>
  );
}
