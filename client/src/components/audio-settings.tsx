import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";

export function AudioSettings() {
  const { isEnabled, setEnabled, playClick } = useAudio();
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    setAudioEnabled(isEnabled());
  }, [isEnabled]);

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    setEnabled(newState);
    if (newState) {
      // Play a test sound when enabling
      setTimeout(() => playClick(), 100);
    }
  };

  return (
    <Button
      onClick={toggleAudio}
      variant="outline"
      size="sm"
      className="p-2"
      title={audioEnabled ? "Disable sound effects" : "Enable sound effects"}
    >
      {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </Button>
  );
}