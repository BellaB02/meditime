
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  isAnalyzing: boolean;
  onReset: () => void;
  onScanImage: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  imageUrl, 
  isAnalyzing, 
  onReset, 
  onScanImage 
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt="Ordonnance" 
          className="max-h-64 mx-auto object-contain rounded-md border" 
        />
        <Button
          size="sm"
          variant="destructive"
          className="absolute top-2 right-2"
          onClick={onReset}
        >
          <X size={16} />
        </Button>
      </div>
      
      <Button 
        onClick={onScanImage} 
        disabled={isAnalyzing}
        className="w-full"
      >
        {isAnalyzing ? "Analyse en cours..." : "Analyser l'ordonnance"}
      </Button>
    </div>
  );
};
