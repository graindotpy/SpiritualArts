import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Character } from "@shared/schema";
import { SPIRIT_DIE_PROGRESSION } from "@shared/schema";

interface LevelEditorProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
}

export default function LevelEditor({ character, isOpen, onClose }: LevelEditorProps) {
  const [level, setLevel] = useState(character.level.toString());
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    const newLevel = parseInt(level);
    
    // Validation
    if (isNaN(newLevel) || newLevel < 1 || newLevel > 20) {
      toast({
        title: "Invalid level",
        description: "Level must be a number between 1 and 20",
        variant: "destructive",
      });
      return;
    }

    if (newLevel === character.level) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/character/${character.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level: newLevel }),
      });

      if (!response.ok) {
        throw new Error('Failed to update level');
      }

      // Update spirit die pool to match new level
      const newLevelDice = SPIRIT_DIE_PROGRESSION[newLevel] || ['d4'];
      
      // First try to update existing spirit die pool
      let spiritDieResponse = await fetch(`/api/character/${character.id}/spirit-die-pool`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentDice: newLevelDice,
          overrideDice: null // Reset any override when level changes
        }),
      });

      // If update failed (404), create a new spirit die pool
      if (!spiritDieResponse.ok && spiritDieResponse.status === 404) {
        spiritDieResponse = await fetch(`/api/character/${character.id}/spirit-die-pool`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            characterId: character.id,
            currentDice: newLevelDice,
            overrideDice: null
          }),
        });
      }

      // Don't fail if spirit die pool operations fail
      if (!spiritDieResponse.ok) {
        console.warn('Spirit die pool operations failed, but level was updated successfully');
      }

      // Invalidate character queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/character", character.id] });
      await queryClient.invalidateQueries({ queryKey: ["/api/character", character.id, "spirit-die-pool"] });

      toast({
        title: "Level updated",
        description: `${character.name} is now level ${newLevel} with updated spirit dice`,
      });

      onClose();
    } catch (error) {
      console.error('Level update error:', error);
      toast({
        title: "Update failed",
        description: "Failed to update character level. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setLevel(character.level.toString());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Update Character Level
          </DialogTitle>
          <DialogDescription>
            Change {character.name}'s level (1-20)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Level Display */}
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Level</p>
            <p className="text-2xl font-bold text-spiritual-600 dark:text-spiritual-400">
              {character.level}
            </p>
          </div>

          {/* Level Input */}
          <div className="space-y-2">
            <Label htmlFor="level">New Level</Label>
            <Input
              id="level"
              type="number"
              min="1"
              max="20"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Enter level (1-20)"
              disabled={isSaving}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-spiritual-600 hover:bg-spiritual-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Level"}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              disabled={isSaving}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}