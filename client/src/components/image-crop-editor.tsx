import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, RotateCcw, Check, X } from "lucide-react";

interface ImageCropEditorProps {
  imageUrl: string;
  onSave: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropEditor({ imageUrl, onSave, onCancel }: ImageCropEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState([1]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const CANVAS_SIZE = 300;
  const CROP_SIZE = 200; // Size of the circular crop area

  // Initialize image position when loaded
  useEffect(() => {
    if (imageLoaded && imageRef.current) {
      const img = imageRef.current;
      const centerX = (CANVAS_SIZE - img.width * zoom[0]) / 2;
      const centerY = (CANVAS_SIZE - img.height * zoom[0]) / 2;
      setImagePosition({ x: centerX, y: centerY });
    }
  }, [imageLoaded, zoom]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;
    
    if (!canvas || !ctx || !img || !imageLoaded) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw image with current position and zoom
    ctx.drawImage(
      img,
      imagePosition.x,
      imagePosition.y,
      img.width * zoom[0],
      img.height * zoom[0]
    );
    
    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Create circular crop area
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    const radius = CROP_SIZE / 2;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw circle border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }, [imagePosition, zoom, imageLoaded]);

  // Redraw canvas when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left - imagePosition.x,
        y: e.clientY - rect.top - imagePosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setImagePosition({
        x: e.clientX - rect.left - dragStart.x,
        y: e.clientY - rect.top - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomChange = (newZoom: number[]) => {
    setZoom(newZoom);
  };

  const resetPosition = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      const centerX = (CANVAS_SIZE - img.width * zoom[0]) / 2;
      const centerY = (CANVAS_SIZE - img.height * zoom[0]) / 2;
      setImagePosition({ x: centerX, y: centerY });
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;
    
    if (!canvas || !ctx || !img) return;

    // Create a new canvas for the cropped image
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    
    if (!cropCtx) return;

    cropCanvas.width = CROP_SIZE;
    cropCanvas.height = CROP_SIZE;

    // Calculate the area to crop from the original positioned image
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    const radius = CROP_SIZE / 2;
    
    // Create circular clipping path
    cropCtx.beginPath();
    cropCtx.arc(radius, radius, radius, 0, 2 * Math.PI);
    cropCtx.clip();
    
    // Draw the cropped portion
    const sourceX = centerX - radius - imagePosition.x;
    const sourceY = centerY - radius - imagePosition.y;
    const sourceWidth = CROP_SIZE;
    const sourceHeight = CROP_SIZE;
    
    cropCtx.drawImage(
      img,
      sourceX / zoom[0],
      sourceY / zoom[0],
      sourceWidth / zoom[0],
      sourceHeight / zoom[0],
      0,
      0,
      CROP_SIZE,
      CROP_SIZE
    );

    // Convert to blob and call onSave
    cropCanvas.toBlob((blob) => {
      if (blob) {
        onSave(blob);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Drag to position and use the slider to zoom your image
        </p>
      </div>

      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="flex justify-center"
      >
        <div className="relative border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="cursor-move bg-gray-100 dark:bg-gray-800"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {/* Hidden image element */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Crop source"
            className="hidden"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ZoomOut className="w-4 h-4 text-gray-500" />
          <Slider
            value={zoom}
            onValueChange={handleZoomChange}
            min={0.2}
            max={3}
            step={0.1}
            className="flex-1"
          />
          <ZoomIn className="w-4 h-4 text-gray-500" />
        </div>
        <div className="text-center">
          <Button
            onClick={resetPosition}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset Position
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={!imageLoaded}
          className="flex-1 bg-spiritual-600 hover:bg-spiritual-700"
        >
          <Check className="w-4 h-4 mr-2" />
          Save Portrait
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}