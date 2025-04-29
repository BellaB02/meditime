
import React from "react";
import { OCRResult } from "@/services/OCRService";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface ScanResultProps {
  result: OCRResult;
  editedText: string;
  onEditText: (text: string) => void;
}

export const ScanResult: React.FC<ScanResultProps> = ({ 
  result, 
  editedText, 
  onEditText 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-1">Résultat de l'analyse</p>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={result.confidence > 70 ? "default" : "destructive"}>
            Confiance: {Math.round(result.confidence)}%
          </Badge>
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium mb-1">Texte détecté (modifiable)</p>
        <Textarea 
          value={editedText}
          onChange={(e) => onEditText(e.target.value)}
          rows={6}
          className="font-mono text-sm"
        />
      </div>
      
      {result.medicationData?.medications.length ? (
        <div>
          <p className="text-sm font-medium mb-1">Médicaments détectés</p>
          <div className="flex flex-wrap gap-2">
            {result.medicationData.medications.map((med, i) => (
              <Badge key={i} variant="outline">{med}</Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
