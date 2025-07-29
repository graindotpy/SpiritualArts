import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Check, X, Plus, Moon, Sun } from "lucide-react";
import { useCharacterState } from "@/hooks/use-character-state";
import { useTheme } from "@/components/theme-provider";
import { SPIRIT_DIE_PROGRESSION } from "@shared/schema";
import type { Character } from "@shared/schema";

interface EditableCharacterHeaderProps {
  character: Character;
  onNewCharacter: () => void;
}

export default function EditableCharacterHeader({ character, onNewCharacter }: EditableCharacterHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPath, setIsEditingPath] = useState(false);
  const [tempName, setTempName] = useState(character.name);
  const [tempPath, setTempPath] = useState(character.path);
  
  const { updateCharacter, updateCharacterLevel } = useCharacterState(character.id);

  const handleNameSave = () => {
    if (tempName.trim() && tempName !== character.name) {
      updateCharacter.mutate({ name: tempName.trim() });
    }
    setIsEditingName(false);
  };

  const handlePathSave = () => {
    if (tempPath.trim() && tempPath !== character.path) {
      updateCharacter.mutate({ path: tempPath.trim() });
    }
    setIsEditingPath(false);
  };

  const handleNameCancel = () => {
    setTempName(character.name);
    setIsEditingName(false);
  };

  const handlePathCancel = () => {
    setTempPath(character.path);
    setIsEditingPath(false);
  };

  const handleLevelChange = (level: string) => {
    updateCharacterLevel.mutate({ level: parseInt(level) });
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex-1 max-w-2xl">
        {/* Character Name */}
        <div className="mb-2">
          {isEditingName ? (
            <div className="flex items-center space-x-2">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="text-2xl font-bold bg-white dark:bg-[var(--dialog-input)] border-gray-300 dark:border-[var(--dialog-input-border)]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') handleNameCancel();
                }}
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleNameSave}>
                <Check className="w-4 h-4 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleNameCancel}>
                <X className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 group">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {character.name}
              </h1>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditingName(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Character Path */}
        <div className="mb-4">
          {isEditingPath ? (
            <div className="flex items-center space-x-2">
              <Input
                value={tempPath}
                onChange={(e) => setTempPath(e.target.value)}
                className="text-lg bg-white dark:bg-[var(--dialog-input)] border-gray-300 dark:border-[var(--dialog-input-border)]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePathSave();
                  if (e.key === 'Escape') handlePathCancel();
                }}
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handlePathSave}>
                <Check className="w-4 h-4 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handlePathCancel}>
                <X className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 group">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {character.path}
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditingPath(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Level Selector */}
        <div className="flex items-center space-x-4">
          <Label htmlFor="level" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Level:
          </Label>
          <Select
            value={character.level.toString()}
            onValueChange={handleLevelChange}
          >
            <SelectTrigger className="w-20 bg-white dark:bg-[var(--dialog-input)] border-gray-300 dark:border-[var(--dialog-input-border)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((level) => (
                <SelectItem key={level} value={level.toString()}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({SPIRIT_DIE_PROGRESSION[character.level]?.join(', ') || 'd4'})
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <Button
          onClick={onNewCharacter}
          className="bg-spiritual-600 hover:bg-spiritual-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Character
        </Button>
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
  );
}