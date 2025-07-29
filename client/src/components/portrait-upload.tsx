import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface PortraitUploadProps {
  characterId: string;
  currentPortraitUrl?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PortraitUpload({ characterId, currentPortraitUrl, isOpen, onClose }: PortraitUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Portrait must be smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('portrait', file);

      const response = await fetch(`/api/character/${characterId}/portrait`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Invalidate character queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/character", characterId] });

      toast({
        title: "Portrait uploaded",
        description: "Character portrait has been updated successfully",
      });

      setPreviewUrl(null);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload portrait. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPortraitUrl) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/character/${characterId}/portrait`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      // Invalidate character queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/character", characterId] });

      toast({
        title: "Portrait removed",
        description: "Character portrait has been removed",
      });

      onClose();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Failed to remove portrait. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const displayUrl = previewUrl || currentPortraitUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Character Portrait
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current/Preview Portrait */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
              {displayUrl ? (
                <img
                  src={displayUrl}
                  alt="Character portrait"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* File Input */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
              disabled={isUploading || isDeleting}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Image
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {previewUrl && (
              <Button
                onClick={handleUpload}
                disabled={isUploading || isDeleting}
                className="flex-1 bg-spiritual-600 hover:bg-spiritual-700"
              >
                {isUploading ? "Uploading..." : "Upload Portrait"}
              </Button>
            )}

            {currentPortraitUrl && !previewUrl && (
              <Button
                onClick={handleDelete}
                disabled={isUploading || isDeleting}
                variant="destructive"
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Removing..." : "Remove Portrait"}
              </Button>
            )}

            <Button
              onClick={onClose}
              variant="outline"
              disabled={isUploading || isDeleting}
              className={previewUrl || currentPortraitUrl ? "flex-1" : "w-full"}
            >
              {previewUrl ? "Cancel" : "Close"}
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Supported formats: JPG, PNG, GIF • Max size: 5MB
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}