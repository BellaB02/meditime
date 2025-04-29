
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { File, Save, Trash, Undo } from "lucide-react";

interface SignatureProps {
  width?: number;
  height?: number;
  className?: string;
  onSave?: (signatureDataUrl: string) => void;
  defaultDataUrl?: string;
  disabled?: boolean;
}

export const Signature: React.FC<SignatureProps> = ({
  width = 400,
  height = 200,
  className,
  onSave,
  defaultDataUrl,
  disabled = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = width * 2; // For higher resolution
    canvas.height = height * 2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Get context
    const context = canvas.getContext("2d");
    if (context) {
      context.scale(2, 2); // Scale for high DPI screens
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = 2;
      context.strokeStyle = "black";
      contextRef.current = context;
    }

    // Initialize with default signature if provided
    if (defaultDataUrl) {
      const image = new Image();
      image.onload = () => {
        if (context) {
          context.drawImage(image, 0, 0, width, height);
          setHasSignature(true);
        }
      };
      image.src = defaultDataUrl;
    }
  }, [width, height, defaultDataUrl]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    // Get position
    const { x, y } = getEventPosition(event, canvas);
    lastPositionRef.current = { x, y };

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    // Prevent scrolling on touch devices
    event.preventDefault();

    // Get position
    const { x, y } = getEventPosition(event, canvas);
    
    // Draw line
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    lastPositionRef.current = { x, y };
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onSave) return;
    
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  const getEventPosition = (event: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    
    // Handle touch and mouse events differently
    if ("touches" in event) {
      // Touch event
      if (event.touches.length > 0) {
        return {
          x: event.touches[0].clientX - rect.left,
          y: event.touches[0].clientY - rect.top
        };
      }
      return lastPositionRef.current; // Fallback
    } else {
      // Mouse event
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <Card className="mb-2 overflow-hidden">
        <CardContent className="p-1">
          <canvas
            ref={canvasRef}
            className={cn(
              "border border-gray-300 rounded-md touch-none",
              disabled ? "cursor-not-allowed bg-gray-50" : "cursor-crosshair bg-white",
              hasSignature ? "" : "bg-grid-pattern"
            )}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{ width, height }}
          />
        </CardContent>
      </Card>
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={clearSignature}
          disabled={!hasSignature || disabled}
        >
          <Trash className="mr-2 h-4 w-4" />
          Effacer
        </Button>
        {onSave && (
          <Button
            variant="default"
            size="sm"
            onClick={saveSignature}
            disabled={!hasSignature || disabled}
          >
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        )}
      </div>
    </div>
  );
};

export default Signature;
